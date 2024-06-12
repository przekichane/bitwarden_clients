import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

import { FormGroupControls } from "../../platform/abstractions/form-validation-errors.service";

export class InputsFieldMatch {
  /**
   *  Check to ensure two fields do not have the same value
   *
   * @deprecated Use compareInputs() instead
   *
   * // TODO-rr-bw: consider just replacing deprecated custom validators in this PR.
   */
  static validateInputsDoesntMatch(matchTo: string, errorMessage: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.parent && control.parent.controls) {
        return control?.value === (control?.parent?.controls as FormGroupControls)[matchTo].value
          ? {
              inputsMatchError: {
                message: errorMessage,
              },
            }
          : null;
      }

      return null;
    };
  }

  // TODO-rr-bw: Check we we can remove this (we are not currently using it)
  //check to ensure two fields have the same value
  static validateInputsMatch(matchTo: string, errorMessage: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.parent && control.parent.controls) {
        return control?.value === (control?.parent?.controls as FormGroupControls)[matchTo].value
          ? null
          : {
              inputsDoesntMatchError: {
                message: errorMessage,
              },
            };
      }

      return null;
    };
  }

  /**
   * Checks the formGroup if two fields have the same value and validation is controlled from either field
   *
   * @deprecated
   * Use compareInputs() instead.
   *
   * For more info on deprecation
   * - Do not use untyped `options` object in formBuilder.group() {@link https://angular.dev/api/forms/UntypedFormBuilder}
   * - Use formBuilder.group() overload with AbstractControlOptions type instead {@link https://angular.dev/api/forms/AbstractControlOptions}
   *
   * Remove this method after deprecated instances are replaced
   *
   * // TODO-rr-bw: consider just replacing deprecated custom validators in this PR.
   */
  static validateFormInputsMatch(field: string, fieldMatchTo: string, errorMessage: string) {
    return (formGroup: UntypedFormGroup) => {
      const fieldCtrl = formGroup.controls[field];
      const fieldMatchToCtrl = formGroup.controls[fieldMatchTo];

      if (fieldCtrl.value !== fieldMatchToCtrl.value) {
        fieldMatchToCtrl.setErrors({
          inputsDoesntMatchError: {
            message: errorMessage,
          },
        });
      } else {
        fieldMatchToCtrl.setErrors(null);
      }
    };
  }

  /**
   * Checks that two form controls do not have the same input value (except for empty string values).
   *
   * - Validation is controlled from either form control.
   * - The error message is displayed under controlB by default, but can be set to controlA.
   *
   * @param validationGoal Whether you want to verify that the form control input values match or do not match
   * @param controlNameA The name of the first form control to compare.
   * @param controlNameB The name of the second form control to compare.
   * @param errorMessage The error message to display if there is an error. This will probably
   *                     be an i18n translated string.
   * @param showErrorOn The control under which you want to display the error (default is controlB).
   */
  static compareInputs(
    validationGoal: "match" | "doNotMatch",
    controlNameA: string,
    controlNameB: string,
    errorMessage: string,
    showErrorOn: "controlA" | "controlB" = "controlB",
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlA = control.get(controlNameA);
      const controlB = control.get(controlNameB);
      const controlThatShowsError = showErrorOn === "controlA" ? controlA : controlB;

      // Don't compare empty strings
      if (controlA.value === "") {
        return valid();
      }

      const controlValuesMatch = controlA.value === controlB.value;

      if (validationGoal === "match") {
        if (controlValuesMatch) {
          return valid();
        } else {
          return invalid();
        }
      }

      if (validationGoal === "doNotMatch") {
        if (!controlValuesMatch) {
          return valid();
        } else {
          return invalid();
        }
      }

      // TODO-rr-bw: default return?

      function invalid() {
        controlThatShowsError.setErrors({
          inputMatchError: {
            message: errorMessage,
          },
        });
        return {
          inputMatchError: {
            message: errorMessage,
          },
        };
      }

      function valid(): null {
        controlThatShowsError.setErrors(null);
        return null;
      }
    };
  }
}
