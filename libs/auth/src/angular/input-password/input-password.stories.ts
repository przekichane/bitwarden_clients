import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";

import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

import { I18nMockService } from "../../../../components/src/utils/i18n-mock.service";

import { InputPasswordComponent } from "./input-password.component";

export default {
  title: "Auth/Input Password",
  component: InputPasswordComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
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

            // Other
            checkForBreaches: "Check known data breaches for this password",
            createAccount: "Create account",

            // Angular Validators
            required: "required",
            inputMaxLength: (max) => `51/${max} character maximum`,

            inputRequired: "Input is required.", // for BitErrorComponent error message
            toggleVisibility: "Toggle visibility", // for BitPasswordInputToggleDirective
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
