import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

import { FormGroupControls } from "../../platform/abstractions/form-validation-errors.service";

export class InputsFieldMatch {
  //check to ensure two fields do not have the same value
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

  //checks the formGroup if two fields have the same value and validation is controlled from either field
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
   * @param controlNameA The name of the first form control to compare.
   * @param controlNameB The name of the second form control to compare.
   * @param errorMessage The error message to display if there is an error. This will probably
   *                     be an i18n translated string.
   * @param showErrorOn The control under which you want to display the error (default is controlB).
   */
  static validateFormInputsDoNotMatch(
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
        controlThatShowsError.setErrors(null);
        return null;
      }

      if (controlA.value === controlB.value) {
        controlThatShowsError.setErrors({
          inputsShouldNotMatchError: {
            message: errorMessage,
          },
        });
        return {
          inputsShouldNotMatchError: {
            message: errorMessage,
          },
        };
      } else {
        controlThatShowsError.setErrors(null);
        return null;
      }
    };
  }
}
