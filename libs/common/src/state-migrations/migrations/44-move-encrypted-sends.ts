import { KeyDefinitionLike, MigrationHelper } from "../migration-helper";
import { Migrator } from "../migrator";

export enum SendType {
  Text = 0,
  File = 1,
}

type SendData = {
  id: string;
  accessId: string;
};

type ExpectedSendState = {
  data?: {
    sends?: {
      encrypted?: Record<string, SendData>;
    };
  };
};

const ENCRYPTED_SENDS: KeyDefinitionLike = {
  stateDefinition: {
    name: "send",
  },
  key: "sends",
};

export class SendMigrator extends Migrator<43, 44> {
  async migrate(helper: MigrationHelper): Promise<void> {
    const accounts = await helper.getAccounts<ExpectedSendState>();

    async function migrateAccount(userId: string, account: ExpectedSendState): Promise<void> {
      const value = account?.data?.sends?.encrypted;
      if (value != null) {
        await helper.setToUser(userId, ENCRYPTED_SENDS, value);
        delete account.data.sends;
        await helper.set(userId, account);
      }
    }

    await Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
  }

  async rollback(helper: MigrationHelper): Promise<void> {
    const accounts = await helper.getAccounts<ExpectedSendState>();

    async function rollbackAccount(userId: string, account: ExpectedSendState): Promise<void> {
      const value = await helper.getFromUser(userId, ENCRYPTED_SENDS);
      if (account) {
        account.data = Object.assign(account.data ?? {}, {
          sends: {
            encrypted: value,
          },
        });

        await helper.set(userId, account);
      }
      await helper.setToUser(userId, ENCRYPTED_SENDS, null);
    }
    await Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
  }
}
