import { importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { action } from "@storybook/addon-actions";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";
import { ZXCVBNResult } from "zxcvbn";

import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { PolicyApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/policy/policy-api.service.abstraction";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { MasterPasswordPolicyOptions } from "@bitwarden/common/admin-console/models/domain/master-password-policy-options";
import { AccountInfo, AccountService } from "@bitwarden/common/auth/abstractions/account.service";
import { KdfConfigService } from "@bitwarden/common/auth/abstractions/kdf-config.service";
import { CryptoService } from "@bitwarden/common/platform/abstractions/crypto.service";
import { KdfType, PBKDF2_ITERATIONS } from "@bitwarden/common/platform/enums";
import { PasswordStrengthServiceAbstraction } from "@bitwarden/common/tools/password-strength";
import { UserId } from "@bitwarden/common/types/guid";
import { DialogService, ToastService } from "@bitwarden/components";

import { PreloadedEnglishI18nModule } from "../../../../../apps/web/src/app/core/tests";

import { InputPasswordComponent } from "./input-password.component";

const mockMasterPasswordPolicyOptions = {
  minComplexity: 3,
  minLength: 10,
  requireUpper: true,
  requireLower: true,
  requireNumbers: true,
  requireSpecial: true,
} as MasterPasswordPolicyOptions;

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
            activeAccount$: of({
              id: "5555-5555-5555",
              email: "jdoe@example.com",
              emailVerified: true,
              name: "John Doe",
            } as { id: UserId } & AccountInfo),
          } as Partial<AccountService>,
        },
        {
          provide: AuditService,
          useValue: {
            passwordLeaked: () => Promise.resolve(1),
          } as Partial<AuditService>,
        },
        {
          provide: CryptoService,
          useValue: {
            makeMasterKey: () => Promise.resolve("example-master-key"),
            hashMasterKey: () => Promise.resolve("example-master-key-hash"),
          },
        },
        {
          provide: DialogService,
          useValue: {
            openSimpleDialog: () => Promise.resolve(true),
          } as Partial<DialogService>,
        },
        {
          provide: KdfConfigService,
          useValue: {
            getKdfConfig: () =>
              Promise.resolve({
                kdfType: KdfType.PBKDF2_SHA256,
                iterations: PBKDF2_ITERATIONS.defaultValue,
              }),
          },
        },
        {
          provide: PolicyApiServiceAbstraction,
          useValue: {
            getMasterPasswordPolicyOptsForOrgUser: () => mockMasterPasswordPolicyOptions,
          } as Partial<PolicyService>,
        },
        {
          provide: PolicyService,
          useValue: {
            masterPasswordPolicyOptions$: () => of(mockMasterPasswordPolicyOptions),
            evaluateMasterPassword: () => true,
          } as Partial<PolicyService>,
        },
        {
          provide: PasswordStrengthServiceAbstraction,
          useValue: {
            getPasswordStrength: () => ({ score: null }) as ZXCVBNResult,
          } as Partial<PasswordStrengthServiceAbstraction>,
        },
        {
          provide: ToastService,
          useValue: {
            showToast: action("ToastService.showToast"),
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
