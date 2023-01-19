export enum KdfType {
  PBKDF2_SHA256 = 0,
}

export enum HashPurpose {
  LocalAuthorization = 2,
  VaultAuthorization = 1,
}

export const DEFAULT_KDF_TYPE = KdfType.PBKDF2_SHA256;
export const DEFAULT_KDF_ITERATIONS = 100000;
export const SEND_KDF_ITERATIONS = 100000;

export enum KeySuffixOptions {
  Auto = "auto",
  Biometric = "biometric",
}
