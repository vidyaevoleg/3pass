import {SymmetricKey} from 'Crypto/SymmetricKey';

export enum KdfType {
  PBKDF2_SHA256 = 0,
}

export enum HashPurpose {
  LocalAuthorization = 2,
  VaultAuthorization = 1,
}

export enum KeySuffixOptions {
  Auto = "auto",
  Biometric = "biometric",
}

export enum KdfIterations {
  min = 5000,
  default = 100000
}

export class DecryptParameters<T> {
  public encKey?: T;
  public data?: T;
  public iv?: T;
  public macKey?: T;
  public mac?: T;
  public macData?: T;
}

export class EncryptedObject {
  public key: SymmetricKey;
  public iv: ArrayBuffer;
  public data: ArrayBuffer;
  public mac?: ArrayBuffer;

  constructor(key: SymmetricKey, data: ArrayBuffer, iv: ArrayBuffer, mac?: ArrayBuffer) {
    this.key = key;
    this.data = data;
    this.iv = iv;
    this.mac = mac;
  }
}

export enum EncryptionType {
  AesCbc256_B64 = 0,
  AesCbc128_HmacSha256_B64 = 1,
  AesCbc256_HmacSha256_B64 = 2,
}

export interface IEncrypted {
  encryptionType?: EncryptionType;
  dataBytes: ArrayBuffer;
  macBytes: ArrayBuffer;
  ivBytes: ArrayBuffer;
}
