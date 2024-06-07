import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";

import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { PasswordStrengthServiceAbstraction } from "@bitwarden/common/tools/password-strength";

import { I18nMockService } from "../../../../components/src/utils/i18n-mock.service";

import { mockZXCVBNResult, mockMasterPasswordPolicyOptions$ } from "./input-password-mocks";
import { InputPasswordComponent } from "./input-password.component";

class MockPolicyService implements Partial<PolicyService> {
  masterPasswordPolicyOptions$ = () => mockMasterPasswordPolicyOptions$;
}

class MockPasswordStrengthService implements Partial<PasswordStrengthServiceAbstraction> {
  getPasswordStrength = () => mockZXCVBNResult;
}

export default {
  title: "Auth/Input Password",
  component: InputPasswordComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: PolicyService,
          useClass: MockPolicyService,
        },
        {
          provide: PasswordStrengthServiceAbstraction,
          useClass: MockPasswordStrengthService,
        },
        {
          provide: I18nService,
          useValue: new I18nMockService({
            // Master password
            masterPassword: "Master password",
            important: "Important:",
            masterPassImportant: "Your master password cannot be recovered if you forget it!",

            // Confirm master password
            characterMinimum: "__$1__ character minimum",
            confirmMasterPassword: "Confirm master password",
            masterPassDoesntMatch: "Master password confirmation does not match",

            // Master password hint
            masterPassHintLabel: "Master password hint",
            masterPassHintText:
              "If you forget your password, the password hint can be sent to your email. __$1__/__$2__ character maximum.",
            hintEqualsPassword: "Your hint cannot be your master password", // TODO-rr-bw: update this in messages.json to match figma

            // Button text
            setMasterPassword: "Set master password",

            // Other
            checkForBreaches: "Check known data breaches for this password",
            createAccount: "Create account",

            // Angular Validators
            required: "required",
            inputMaxLength: (max) => `51/${max} character maximum`, // TODO-rr-bw: not sure how to show the current length in a Validator error message

            inputRequired: "Input is required.", // for BitErrorComponent error message
            toggleVisibility: "Toggle visibility", // for BitPasswordInputToggleDirective

            // Password Callout
            masterPasswordPolicyInEffect:
              "One or more organization policies require your master password to meet the following requirements:",
            policyInEffectMinLength: "Minimum length of __$1__",
            policyInEffectMinComplexity: "Minimum complexity score of __$1__",
            policyInEffectUppercase: "Contain one or more uppercase characters",
            policyInEffectLowercase: "Contain one or more lowercase characters",
            policyInEffectNumbers: "Contain one or more numbers",
            policyInEffectSpecial:
              "Contain one or more of the following special characters !@#$%^&*",
            good: "Good",
          }),
        },
      ],
    }),
  ],
} as Meta;

type Story = StoryObj<InputPasswordComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <auth-input-password></auth-input-password>
    `,
  }),
};
