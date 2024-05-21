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
  passwordForm = this.formBuilder.group({
    password: ["", Validators.required],
    confirmedPassword: ["", Validators.required],
    hint: [""],
    checkForBreaches: [true],
  });

  constructor(private formBuilder: FormBuilder) {}

  submit() {}
}
