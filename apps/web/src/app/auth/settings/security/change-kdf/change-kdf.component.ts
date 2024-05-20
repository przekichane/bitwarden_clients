import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { KdfConfigService } from "@bitwarden/common/auth/abstractions/kdf-config.service";
import {
  Argon2KdfConfig,
  KdfConfig,
  PBKDF2KdfConfig,
} from "@bitwarden/common/auth/models/domain/kdf-config";
import {
  DEFAULT_KDF_CONFIG,
  PBKDF2_ITERATIONS,
  ARGON2_ITERATIONS,
  ARGON2_MEMORY,
  ARGON2_PARALLELISM,
  KdfType,
} from "@bitwarden/common/platform/enums";
import { DialogService } from "@bitwarden/components";

import { ChangeKdfConfirmationComponent } from "./change-kdf-confirmation.component";

@Component({
  selector: "app-change-kdf",
  templateUrl: "change-kdf.component.html",
})
export class ChangeKdfComponent implements OnInit {
  kdfConfig: KdfConfig = DEFAULT_KDF_CONFIG;
  kdfType = KdfType;
  kdfOptions: any[] = [];
  private destroy$ = new Subject<void>();

  protected formGroup = new FormGroup({
    kdf: new FormControl(KdfType.PBKDF2_SHA256, [Validators.required]),
    kdfConfig: new FormGroup({
      iterations: new FormControl(this.kdfConfig.iterations, [
        Validators.required,
        Validators.min(PBKDF2_ITERATIONS.min),
        Validators.max(PBKDF2_ITERATIONS.max),
      ]),
      memory: new FormControl(null, [
        Validators.required,
        Validators.min(ARGON2_MEMORY.min),
        Validators.max(ARGON2_MEMORY.max),
      ]),
      parallelism: new FormControl(null, [
        Validators.required,
        Validators.min(ARGON2_PARALLELISM.min),
        Validators.max(ARGON2_PARALLELISM.max),
      ]),
    }),
  });

  // Default values for template
  protected PBKDF2_ITERATIONS = PBKDF2_ITERATIONS;
  protected ARGON2_ITERATIONS = ARGON2_ITERATIONS;
  protected ARGON2_MEMORY = ARGON2_MEMORY;
  protected ARGON2_PARALLELISM = ARGON2_PARALLELISM;

  constructor(
    private dialogService: DialogService,
    private kdfConfigService: KdfConfigService,
  ) {
    this.kdfOptions = [
      { name: "PBKDF2 SHA-256", value: KdfType.PBKDF2_SHA256 },
      { name: "Argon2id", value: KdfType.Argon2id },
    ];
  }

  async ngOnInit() {
    this.kdfConfig = await this.kdfConfigService.getKdfConfig();
    this.setFormControlValues(this.kdfConfig);

    this.formGroup
      .get("kdf")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        let config;
        const validators: {
          iterations: ValidatorFn[];
          memory: ValidatorFn[];
          parallelism: ValidatorFn[];
        } = {
          iterations: [],
          memory: [],
          parallelism: [],
        };

        switch (newValue) {
          case KdfType.PBKDF2_SHA256:
            config = new PBKDF2KdfConfig();
            validators.iterations = [
              Validators.min(PBKDF2_ITERATIONS.min),
              Validators.max(PBKDF2_ITERATIONS.max),
            ];
            break;
          case KdfType.Argon2id:
            config = new Argon2KdfConfig();
            validators.iterations = [
              Validators.min(ARGON2_ITERATIONS.min),
              Validators.max(ARGON2_ITERATIONS.max),
            ];
            validators.memory = [
              Validators.min(ARGON2_MEMORY.min),
              Validators.max(ARGON2_MEMORY.max),
            ];
            validators.parallelism = [
              Validators.min(ARGON2_PARALLELISM.min),
              Validators.max(ARGON2_PARALLELISM.max),
            ];
            break;
          default:
            throw new Error("Unknown KDF type.");
        }

        this.kdfConfig = config;
        this.formGroup.clearValidators();
        this.setValidators("kdfConfig.iterations", validators.iterations);
        this.setValidators("kdfConfig.memory", validators.memory);
        this.setValidators("kdfConfig.parallelism", validators.parallelism);
        this.setFormControlValues(this.kdfConfig);
      });
  }
  setValidators(controlName: string, validators: ValidatorFn[]) {
    const control = this.formGroup.get(controlName);
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  setFormControlValues(kdfConfig: KdfConfig) {
    this.formGroup.get("kdf").setValue(kdfConfig.kdfType);
    if (kdfConfig.kdfType === KdfType.PBKDF2_SHA256) {
      this.formGroup.get("kdfConfig.iterations").setValue(kdfConfig.iterations);
    } else if (kdfConfig.kdfType === KdfType.Argon2id) {
      this.formGroup.get("kdfConfig.iterations").setValue(kdfConfig.iterations);
      this.formGroup.get("kdfConfig.memory").setValue(kdfConfig.memory);
      this.formGroup.get("kdfConfig.parallelism").setValue(kdfConfig.parallelism);
    }
  }

  isPBKDF2(t: KdfConfig): t is PBKDF2KdfConfig {
    return t instanceof PBKDF2KdfConfig;
  }

  isArgon2(t: KdfConfig): t is Argon2KdfConfig {
    return t instanceof Argon2KdfConfig;
  }

  async openConfirmationModal() {
    if (this.kdfConfig.kdfType === KdfType.PBKDF2_SHA256) {
      this.kdfConfig.iterations = this.formGroup.value.kdfConfig.iterations;
    } else if (this.kdfConfig.kdfType === KdfType.Argon2id) {
      this.kdfConfig.iterations = this.formGroup.value.kdfConfig.iterations;
      this.kdfConfig.memory = this.formGroup.value.kdfConfig.memory;
      this.kdfConfig.parallelism = this.formGroup.value.kdfConfig.parallelism;
    }
    this.dialogService.open(ChangeKdfConfirmationComponent, {
      data: {
        kdfConfig: this.kdfConfig,
      },
    });
  }
}
