import { importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";

import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { AccountService } from "@bitwarden/common/auth/abstractions/account.service";
import { KdfConfigService } from "@bitwarden/common/auth/abstractions/kdf-config.service";
import { CryptoService } from "@bitwarden/common/platform/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { KdfType, PBKDF2_ITERATIONS } from "@bitwarden/common/platform/enums";
import { PasswordStrengthServiceAbstraction } from "@bitwarden/common/tools/password-strength";
import { DialogService, ToastService, I18nMockService } from "@bitwarden/components";

import { PreloadedEnglishI18nModule } from "../../../../../apps/web/src/app/core/tests";

import {
  mockZXCVBNResult,
  mockMasterPasswordPolicyOptions$,
  mockActiveAccount$,
} from "./input-password-mocks";
import { InputPasswordComponent } from "./input-password.component";

export default {
  title: "Auth/Input Password",
  component: InputPasswordComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(PreloadedEnglishI18nModule),
        {
          provide: AccountService,
          useValue: {
            activeAccount$: mockActiveAccount$,
          } as Partial<AccountService>,
        },
        {
          provide: AuditService,
          useValue: {
            passwordLeaked: () => Promise.resolve(1),
          } as Partial<AuditService>,
        },
        // {
        //   provide: CryptoService,
        //   useValue: {
        //     makeMasterKey: () => Promise.resolve("example-master-key"),
        //     hashMasterKey: () => Promise.resolve("example-master-key-hash"),
        //   },
        // },
        {
          provide: DialogService,
          useValue: {
            openSimpleDialog: () => Promise.resolve(true),
          } as Partial<DialogService>,
        },
        // {
        //   provide: KdfConfigService,
        //   useValue: {
        //     getKdfConfig: () =>
        //       Promise.resolve({
        //         kdfType: KdfType.PBKDF2_SHA256,
        //         iterations: PBKDF2_ITERATIONS.defaultValue,
        //       }),
        //   },
        // },
        {
          provide: PolicyService,
          useValue: {
            masterPasswordPolicyOptions$: () => mockMasterPasswordPolicyOptions$,
          } as Partial<PolicyService>,
        },
        {
          provide: PasswordStrengthServiceAbstraction,
          useValue: {
            getPasswordStrength: () => mockZXCVBNResult,
          } as Partial<PasswordStrengthServiceAbstraction>,
        },
        {
          provide: ToastService,
          useValue: {
            showToast: () => undefined,
          } as Partial<ToastService>,
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
