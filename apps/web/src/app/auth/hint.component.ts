import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { HintComponent as BaseHintComponent } from "@bitwarden/angular/auth/components/hint.component";
import { LoginEmailServiceAbstraction } from "@bitwarden/auth/common";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";

@Component({
  selector: "app-hint",
  templateUrl: "hint.component.html",
})
export class HintComponent extends BaseHintComponent {
  private destroy$ = new Subject<void>();
  formGroup = this.formBuilder.group({
    email: ["", [Validators.email, Validators.required]],
  });

  constructor(
    router: Router,
    i18nService: I18nService,
    apiService: ApiService,
    platformUtilsService: PlatformUtilsService,
    logService: LogService,
    loginEmailService: LoginEmailServiceAbstraction,
    private formBuilder: FormBuilder,
  ) {
    super(router, i18nService, apiService, platformUtilsService, logService, loginEmailService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.formGroup.get("email").setValue(this.email);
    this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v) => {
      this.email = v.email;
    });
  }

  async submitSuper() {
    await super.submit();
  }

  submit = async () => {
    this.email = this.formGroup.get("email").value;
    await this.submitSuper();
  };
}
