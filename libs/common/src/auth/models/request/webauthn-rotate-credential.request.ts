import { EncString } from "@bitwarden/common/platform/models/domain/enc-string";

export class WebauthnRotateCredentialRequest {
  id: string;
  encryptedPublicKey: EncString;
  encryptedUserKey: EncString;

  constructor(id: string, encryptedPublicKey: EncString, encryptedUserKey: EncString) {
    this.id = id;
    this.encryptedPublicKey = encryptedPublicKey;
    this.encryptedUserKey = encryptedUserKey;
  }
}
