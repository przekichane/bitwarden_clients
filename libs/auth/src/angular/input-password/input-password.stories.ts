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
            masterPassword: "Master password",
            confirmMasterPassword: "Confirm master password",
            masterPassHintLabel: "Master password hint",
            masterPassHintText:
              "If you forget your password, the password hint can be sent to your email. 0/50 character maximum.",
            checkForBreaches: "Check known data breaches for this password",
            createAccount: "Create account",
            required: "required", // for Validators.required
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
