import {EncryptionType, IEncrypted} from 'Crypto/types';
import Utils from 'Utils';

export class EncryptedString implements IEncrypted {
  encryptedString: string;
  encryptionType: EncryptionType;
  data: string;
  iv: string;
  mac?: string;

  constructor(
    encryptionType: EncryptionType,
    encryptedString: string,
    data: string,
    iv: string,
    mac?: string
  ) {
    this.encryptedString = encryptedString;
    this.encryptionType = encryptionType;
    this.data = data;
    this.iv = iv;
    this.mac = mac;
  }

  static fromData(encryptionType: EncryptionType, data: string, iv: string, mac?: string): EncryptedString {
    let encryptedString: string;

    if (iv) {
      encryptedString = encryptionType + "." + iv + "|" + data;
    } else {
      encryptedString = encryptionType + "." + data;
    }

    if (mac) {
      encryptedString += "|" + mac;
    }

    return new EncryptedString(encryptionType, encryptedString, data, iv, mac)
  }


  static fromString(encryptedString: string) {
    let data, mac, iv;
    const { encryptionType, encPieces } = this.parseEncryptedString(encryptedString);

    switch (encryptionType) {
      case EncryptionType.AesCbc128_HmacSha256_B64:
      case EncryptionType.AesCbc256_HmacSha256_B64:
        if (encPieces.length !== 3) {
          throw new Error('Unknown encryption type');
        }
        iv = encPieces[0];
        data = encPieces[1];
        mac = encPieces[2];
        break;
      case EncryptionType.AesCbc256_B64:
        if (encPieces.length !== 2) {
          throw new Error('Unknown encryption type');
        }
        iv = encPieces[0];
        data = encPieces[1];
        break;
      default:
        throw new Error('Unknown encryption type');
    }

    return new EncryptedString(encryptionType, encryptedString, data, iv, mac);
  }

  get ivBytes(): ArrayBuffer {
    return Utils.string.fromB64ToArray(this.iv).buffer;
  }

  get macBytes(): ArrayBuffer  {
    return Utils.string.fromB64ToArray(this.mac || '').buffer;
  }

  get dataBytes(): ArrayBuffer {
    return Utils.string.fromB64ToArray(this.data).buffer;
  }

  static parseEncryptedString(encryptedString: string): {
    encryptionType: EncryptionType;
    encPieces: string[];
  } {
    let encryptionType: EncryptionType;
    let encPieces: string[];

    const headerPieces = encryptedString.split(".");

    if (headerPieces.length === 2) {
      encryptionType = parseInt(headerPieces[0]);
      encPieces = headerPieces[1].split("|");
    } else {
      encPieces = encryptedString.split("|");
      encryptionType = encPieces.length === 3 ? EncryptionType.AesCbc128_HmacSha256_B64 : EncryptionType.AesCbc256_B64;
    }

    return {
      encryptionType,
      encPieces,
    };
  }
}
