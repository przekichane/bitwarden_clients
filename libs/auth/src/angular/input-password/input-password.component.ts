import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

import {
  AsyncActionsModule,
  ButtonModule,
  CheckboxModule,
  FormFieldModule,
  IconButtonModule,
  InputModule,
} from "@bitwarden/components";

import { SharedModule } from "../../../../components/src/shared";

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
  ],
})
export class InputPasswordComponent {
  minPasswordLength = 12;

  currentHintLength = 0;
  minHintLength = 0;
  maxHintLength = 50;

  passwordForm = this.formBuilder.group({
    password: ["", Validators.required, Validators.minLength(this.minPasswordLength)],
    confirmedPassword: ["", Validators.required],
    hint: ["", Validators.maxLength(this.maxHintLength)],
    checkForBreaches: [true],
  });

  constructor(private formBuilder: FormBuilder) {}

  submit() {}
}
