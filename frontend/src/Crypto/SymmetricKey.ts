import {EncryptionType} from 'Crypto/types';
import Utils from 'Utils';

export class SymmetricKey {
  encType: EncryptionType;

  key: ArrayBuffer;
  encKey: ArrayBuffer;
  macKey?: ArrayBuffer;

  keyB64: string;
  encKeyB64: string;
  macKeyB64?: string;

  meta: Record<string, string>;

  constructor(key: ArrayBuffer, encType?: EncryptionType) {
    if (!key) {
      throw new Error("Must provide key");
    }

    if (!encType) {
      if (key.byteLength === 32) {
        encType = EncryptionType.AesCbc256_B64;
      } else if (key.byteLength === 64) {
        encType = EncryptionType.AesCbc256_HmacSha256_B64;
      } else {
        throw new Error("Unable to determine encType.");
      }
    }

    this.key = key;
    this.encType = encType;
    this.meta = {};

    if (encType === EncryptionType.AesCbc256_B64 && key.byteLength === 32) {
      this.encKey = key;
      this.macKey = undefined;
    } else if (encType === EncryptionType.AesCbc128_HmacSha256_B64 && key.byteLength === 32) {
      this.encKey = key.slice(0, 16);
      this.macKey = key.slice(16, 32);
    } else if (encType === EncryptionType.AesCbc256_HmacSha256_B64 && key.byteLength === 64) {
      this.encKey = key.slice(0, 32);
      this.macKey = key.slice(32, 64);
    } else {
      throw new Error("Unsupported encType/key length.");
    }

    this.keyB64 = Utils.string.fromBufferToB64(this.key);
    this.encKeyB64 = Utils.string.fromBufferToB64(this.encKey);
    if (this.macKey != null)
      this.macKeyB64 = Utils.string.fromBufferToB64(this.macKey);
  }
}
