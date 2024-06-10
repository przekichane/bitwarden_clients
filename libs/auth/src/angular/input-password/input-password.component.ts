import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Subject, firstValueFrom, map, takeUntil } from "rxjs";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { MasterPasswordPolicyOptions } from "@bitwarden/common/admin-console/models/domain/master-password-policy-options";
import { AccountService } from "@bitwarden/common/auth/abstractions/account.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { Utils } from "@bitwarden/common/platform/misc/utils";
import {
  AsyncActionsModule,
  ButtonModule,
  CheckboxModule,
  DialogService,
  FormFieldModule,
  IconButtonModule,
  InputModule,
  ToastService,
} from "@bitwarden/components";

import { InputsFieldMatch } from "../../../../angular/src/auth/validators/inputs-field-match.validator";
import { SharedModule } from "../../../../components/src/shared";
import { PasswordCalloutComponent } from "../password-callout/password-callout.component";

export interface PasswordInput {
  password: string;
  hint?: string;
}

@Component({
  standalone: true,
  selector: "auth-input-password",
  templateUrl: "./input-password.component.html",
  imports: [
    AsyncActionsModule,
    ButtonModule,
    CheckboxModule,
    FormFieldModule,
    IconButtonModule,
    InputModule,
    ReactiveFormsModule,
    SharedModule,
    PasswordCalloutComponent,
    JslibModule,
  ],
})
export class InputPasswordComponent implements OnInit {
  @Output() onPasswordFormSubmit = new EventEmitter();

  @Input() buttonText: string;
  @Input() orgId: string;
  @Input() orgName: string;

  email: string;
  minPasswordLength = Utils.minimumPasswordLength;
  minHintLength = 0;
  maxHintLength = 50;
  masterPasswordPolicy: MasterPasswordPolicyOptions;
  passwordStrengthResult: any; // TODO-rr-bw: fix any

  passwordForm = this.formBuilder.group(
    {
      password: ["", Validators.required, Validators.minLength(this.minPasswordLength)],
      confirmedPassword: ["", Validators.required, Validators.minLength(this.minPasswordLength)],
      hint: [
        "",
        [
          Validators.maxLength(this.maxHintLength),
          InputsFieldMatch.validateInputsDoesntMatch(
            "password",
            this.i18nService.t("hintEqualsPassword"),
          ),
        ],
      ],
      checkForBreaches: [true],
    },
    {
      validator: InputsFieldMatch.validateFormInputsMatch(
        "password",
        "confirmedPassword",
        this.i18nService.t("masterPassDoesntMatch"),
      ),
    },
  );

  protected destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private auditService: AuditService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private policyService: PolicyService,
    private toastService: ToastService,
  ) {}

  async ngOnInit() {
    this.email = await firstValueFrom(
      this.accountService.activeAccount$.pipe(map((a) => a?.email)),
    );

    this.policyService
      .masterPasswordPolicyOptions$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (masterPasswordPolicyOptions) =>
          (this.masterPasswordPolicy ??= masterPasswordPolicyOptions),
      );
  }

  // TODO-rr-bw: fix any
  getPasswordStrengthResult(result: any) {
    this.passwordStrengthResult = result;
  }

  submit = async () => {
    // Check if password is breached (if breached, user chooses to accept and continue or not)
    const passwordIsBreached =
      this.passwordForm.controls.checkForBreaches.value &&
      (await this.auditService.passwordLeaked(this.passwordForm.controls.password.value));

    if (passwordIsBreached) {
      const userAcceptedDialog = await this.dialogService.openSimpleDialog({
        title: { key: "exposedMasterPassword" },
        content: { key: "exposedMasterPasswordDesc" },
        type: "warning",
      });

      if (!userAcceptedDialog) {
        return;
      }
    }

    // Check if password meets org policy requirements
    if (
      this.masterPasswordPolicy != null &&
      !this.policyService.evaluateMasterPassword(
        this.passwordStrengthResult.score,
        this.passwordForm.value.password,
        this.masterPasswordPolicy,
      )
    ) {
      this.toastService.showToast({
        variant: "error",
        title: this.i18nService.t("errorOccurred"),
        message: this.i18nService.t("masterPasswordPolicyRequirementsNotMet"),
      });

      return;
    }

    const passwordInput = {
      password: this.passwordForm.controls.password.value,
      hint: this.passwordForm.controls.hint.value,
    };

    this.onPasswordFormSubmit.emit(passwordInput);
  };
}
