import {EncryptionType, IEncrypted} from 'Crypto/types';

const ENC_TYPE_LENGTH = 1;
const IV_LENGTH = 16;
const MAC_LENGTH = 32;
const MIN_DATA_LENGTH = 1;

export class EncryptedArrayBuffer implements IEncrypted {
  readonly encryptionType: EncryptionType;
  readonly dataBytes: ArrayBuffer;
  readonly ivBytes: ArrayBuffer;
  readonly macBytes: ArrayBuffer;

  constructor(readonly buffer: ArrayBuffer) {
    const encryptionBytes = new Uint8Array(buffer);
    this.encryptionType = encryptionBytes[0];
    const { ivBytes, dataBytes, macBytes } = this.buildBytes(encryptionBytes, this.encryptionType)

    this.ivBytes = ivBytes;
    this.dataBytes = dataBytes;
    this.macBytes = macBytes!;
  }

  private buildBytes(encBytes: Uint8Array, encType: EncryptionType): { ivBytes: ArrayBuffer, dataBytes: ArrayBuffer, macBytes?: ArrayBuffer } {
    switch (encType) {
      case EncryptionType.AesCbc128_HmacSha256_B64:
      case EncryptionType.AesCbc256_HmacSha256_B64: {
        this.validateLength(encBytes, encType);
        const ivBytes = encBytes.slice(ENC_TYPE_LENGTH, ENC_TYPE_LENGTH + IV_LENGTH).buffer;
        const macBytes = encBytes.slice(ENC_TYPE_LENGTH + IV_LENGTH, ENC_TYPE_LENGTH + IV_LENGTH + MAC_LENGTH).buffer;
        const dataBytes = encBytes.slice(ENC_TYPE_LENGTH + IV_LENGTH + MAC_LENGTH).buffer;
        return { ivBytes, dataBytes, macBytes };
      }
      case EncryptionType.AesCbc256_B64: {
        this.validateLength(encBytes, encType);
        const ivBytes = encBytes.slice(ENC_TYPE_LENGTH, ENC_TYPE_LENGTH + IV_LENGTH).buffer;
        const dataBytes = encBytes.slice(ENC_TYPE_LENGTH + IV_LENGTH).buffer;
        return { ivBytes, dataBytes }
      }
      default:
        throw new Error(
          "Error parsing encrypted ArrayBuffer: data is corrupted or has an invalid format."
        );
    }
  }

  private validateLength(encBytes: Uint8Array, encType: EncryptionType) {
    const errorMessage = "Error parsing encrypted ArrayBuffer: data is corrupted or has an invalid format.";
    switch (encType) {
      case EncryptionType.AesCbc128_HmacSha256_B64:
      case EncryptionType.AesCbc256_HmacSha256_B64: {
        const minimumLength = ENC_TYPE_LENGTH + IV_LENGTH + MAC_LENGTH + MIN_DATA_LENGTH;
        if (encBytes.length < minimumLength) throw new Error(errorMessage);
        break;
      }
      case EncryptionType.AesCbc256_B64: {
        const minimumLength = ENC_TYPE_LENGTH + IV_LENGTH + MIN_DATA_LENGTH;
        if (encBytes.length < minimumLength) throw new Error(errorMessage);
        break;
      }
      default:
        break;
    }
  }
}
