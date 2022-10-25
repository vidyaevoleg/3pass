import { Utils, EncryptionType } from './utils';

export class SymmetricCryptoKey {
  key: ArrayBuffer;
  encKey?: ArrayBuffer;
  macKey?: ArrayBuffer;
  encType: EncryptionType;

  // @ts-ignore
  keyB64: string;
  // @ts-ignore
  encKeyB64: string;
  // @ts-ignore
  macKeyB64: string;

  meta: any;

  constructor(key: ArrayBuffer, encType?: EncryptionType) {
    if (key == null) {
      throw new Error("Must provide key");
    }

    if (encType == null) {
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

    if (this.key != null) {
      this.keyB64 = Utils.fromBufferToB64(this.key);
    }
    if (this.encKey != null) {
      this.encKeyB64 = Utils.fromBufferToB64(this.encKey);
    }
    if (this.macKey != null) {
      this.macKeyB64 = Utils.fromBufferToB64(this.macKey);
    }
  }

  toJSON() {
    // The whole object is constructed from the initial key, so just store the B64 key
    return { keyB64: this.keyB64 };
  }

  // static fromJSON(obj: Jsonify<SymmetricCryptoKey>): SymmetricCryptoKey {
  //   if (obj == null) {
  //     return null;
  //   }
  //
  //   const arrayBuffer = Utils.fromB64ToArray(obj.keyB64).buffer;
  //   return new SymmetricCryptoKey(arrayBuffer);
  // }
}
