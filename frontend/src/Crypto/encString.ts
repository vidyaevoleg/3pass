import { Utils, IEncrypted, EncryptionType } from "./utils";

export class EncString implements IEncrypted {
  encryptedString?: string;
  encryptionType?: EncryptionType;
  decryptedValue?: string;
  data?: string;
  iv?: string;
  mac?: string;
//
  constructor(
    encryptedStringOrType: string | EncryptionType,
    data?: string,
    iv?: string,
    mac?: string
  ) {
    if (data != null) {
      this.initFromData(encryptedStringOrType as EncryptionType, data, iv!, mac!);
    } else {
      this.initFromEncryptedString(encryptedStringOrType as string);
    }
  }
//
//   // @ts-ignore
//   // async decrypt(orgId: string, key: SymmetricCryptoKey = null): Promise<string> {
//   //   if (this.decryptedValue != null) {
//   //     return this.decryptedValue;
//   //   }
//   //
//   //   let cryptoService: CryptoService;
//   //   const containerService = Utils.global.bitwardenContainerService;
//   //   if (containerService) {
//   //     cryptoService = containerService.getCryptoService();
//   //   } else {
//   //     throw new Error("global bitwardenContainerService not initialized.");
//   //   }
//   //
//   //   try {
//   //     if (key == null) {
//   //       key = await cryptoService.getOrgKey(orgId);
//   //     }
//   //     this.decryptedValue = await cryptoService.decryptToUtf8(this, key);
//   //   } catch (e) {
//   //     this.decryptedValue = "[error: cannot decrypt]";
//   //   }
//   //   return this.decryptedValue;
//   // }
//
  get ivBytes(): ArrayBuffer {
    // @ts-ignore
    return this.iv == null ? null : Utils.fromB64ToArray(this.iv).buffer;
  }

  get macBytes(): ArrayBuffer {
    // @ts-ignore
    return this.mac == null ? null : Utils.fromB64ToArray(this.mac).buffer;
  }

  get dataBytes(): ArrayBuffer {
    // @ts-ignore
    return this.data == null ? null : Utils.fromB64ToArray(this.data).buffer;
  }

  toJSON() {
    return this.encryptedString;
  }
//
//   // static fromJSON(obj: Jsonify<EncString>): EncString {
//   //   return new EncString(obj);
//   // }
//
  private initFromData(encType: EncryptionType, data: string, iv: string, mac: string) {
    if (iv != null) {
      this.encryptedString = encType + "." + iv + "|" + data;
    } else {
      this.encryptedString = encType + "." + data;
    }

    // mac
    if (mac != null) {
      this.encryptedString += "|" + mac;
    }

    this.encryptionType = encType;
    this.data = data;
    this.iv = iv;
    this.mac = mac;
  }
//
  private initFromEncryptedString(encryptedString: string) {
    this.encryptedString = encryptedString as string;
    if (!this.encryptedString) {
      return;
    }

    const { encType, encPieces } = this.parseEncryptedString(this.encryptedString);
    this.encryptionType = encType;

    switch (encType) {
      case EncryptionType.AesCbc128_HmacSha256_B64:
      case EncryptionType.AesCbc256_HmacSha256_B64:
        if (encPieces.length !== 3) {
          return;
        }

        this.iv = encPieces[0];
        this.data = encPieces[1];
        this.mac = encPieces[2];
        break;
      case EncryptionType.AesCbc256_B64:
        if (encPieces.length !== 2) {
          return;
        }

        this.iv = encPieces[0];
        this.data = encPieces[1];
        break;
      case EncryptionType.Rsa2048_OaepSha256_B64:
      case EncryptionType.Rsa2048_OaepSha1_B64:
        if (encPieces.length !== 1) {
          return;
        }

        this.data = encPieces[0];
        break;
      default:
        return;
    }
  }

  private parseEncryptedString(encryptedString: string): {
    encType: EncryptionType;
    encPieces: string[];
  } {
    const headerPieces = encryptedString.split(".");
    let encType: EncryptionType;
    // @ts-ignore
    let encPieces: string[] = null;

    if (headerPieces.length === 2) {
      try {
        // @ts-ignore
        encType = parseInt(headerPieces[0], null);
        encPieces = headerPieces[1].split("|");
      } catch (e) {
        // @ts-ignore
        return;
      }
    } else {
      encPieces = encryptedString.split("|");
      encType =
        encPieces.length === 3
          ? EncryptionType.AesCbc128_HmacSha256_B64
          : EncryptionType.AesCbc256_B64;
    }

    return {
      encType,
      encPieces,
    };
  }
}
