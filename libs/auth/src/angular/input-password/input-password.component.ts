import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";

import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { MasterPasswordPolicyOptions } from "@bitwarden/common/admin-console/models/domain/master-password-policy-options";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { Utils } from "@bitwarden/common/platform/misc/utils";
import {
  AsyncActionsModule,
  ButtonModule,
  CheckboxModule,
  FormFieldModule,
  IconButtonModule,
  InputModule,
} from "@bitwarden/components";

import { InputsFieldMatch } from "../../../../angular/src/auth/validators/inputs-field-match.validator";
import { SharedModule } from "../../../../components/src/shared";
import { PasswordCalloutComponent } from "../password-callout/password-callout.component";

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
  ],
})
export class InputPasswordComponent implements OnInit {
  policy: MasterPasswordPolicyOptions = null;

  minPasswordLength = Utils.minimumPasswordLength;

  minHintLength = 0;
  maxHintLength = 50;

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

  constructor(
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private policyService: PolicyService,
  ) {}

  async ngOnInit() {
    this.policy = await firstValueFrom(this.policyService.masterPasswordPolicyOptions$());
  }

  submit() {}
}
