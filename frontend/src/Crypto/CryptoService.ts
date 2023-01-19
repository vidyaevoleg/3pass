import {EncryptedObject, IEncrypted, Utils} from './utils';
import { EncArrayBuffer } from './encArrayBuffer';
import { SymmetricCryptoKey } from './symmetricCryptoKey';
import { EncString } from './encString';
import { DEFAULT_KDF_ITERATIONS, DEFAULT_KDF_TYPE, HashPurpose, KdfType } from './consts';

export class CryptoService {
  async makeKey(
    password: string,
    salt: string,
    kdf: KdfType = DEFAULT_KDF_TYPE,
    kdfIterations: number = DEFAULT_KDF_ITERATIONS,
  ): Promise<SymmetricCryptoKey> {
    // @ts-ignore
    let key: ArrayBuffer = null;
    if (kdf == null || kdf === KdfType.PBKDF2_SHA256) {
      if (kdfIterations == null) {
        kdfIterations = 5000;
      } else if (kdfIterations < 5000) {
        throw new Error('PBKDF2 iteration minimum is 5000.');
      }
      key = await Utils.pbkdf2(password, salt, 'sha256', kdfIterations);
    } else {
      throw new Error('Unknown Kdf.');
    }
    return new SymmetricCryptoKey(key);
  }

  async hashPassword(
    password: string,
    key: SymmetricCryptoKey,
    hashPurpose?: HashPurpose
  ): Promise<string> {
    if (password == null || key == null) {
      throw new Error('Invalid parameters.');
    }

    const iterations = hashPurpose === HashPurpose.LocalAuthorization ? 2 : 1;
    const hash = await Utils.pbkdf2(key.key, password, 'sha256', iterations);
    return Utils.fromBufferToB64(hash);
  }

  async makeEncKey(key: SymmetricCryptoKey): Promise<[SymmetricCryptoKey, EncString]> {
    const encKey = await Utils.randomBytes(64);
    return this.buildEncKey(key, encKey);
  }

  // async validateKey(key: SymmetricCryptoKey) {
  //   try {
  //     const encPrivateKey = await this.stateService.getEncryptedPrivateKey();
  //     const encKey = await this.getEncKeyHelper(key);
  //     if (encPrivateKey == null || encKey == null) {
  //       return false;
  //     }
  //
  //     const privateKey = await this.decryptToBytes(new EncString(encPrivateKey), encKey);
  //     await Utils.rsaExtractPublicKey(privateKey);
  //   } catch (e) {
  //     return false;
  //   }
  //
  //   return true;
  // }

  // ---HELPERS---


  private async stretchKey(key: SymmetricCryptoKey): Promise<SymmetricCryptoKey> {
    const newKey = new Uint8Array(64);
    const encKey = await Utils.hkdfExpand(key.key, 'enc', 32, 'sha256');
    const macKey = await Utils.hkdfExpand(key.key, 'mac', 32, 'sha256');
    newKey.set(new Uint8Array(encKey));
    newKey.set(new Uint8Array(macKey), 32);
    return new SymmetricCryptoKey(newKey.buffer);
  }

  // private async hashPhrase(hash: ArrayBuffer, minimumEntropy = 64) {
  //   const entropyPerWord = Math.log(EEFLongWordList.length) / Math.log(2);
  //   let numWords = Math.ceil(minimumEntropy / entropyPerWord);
  //
  //   const hashArr = Array.from(new Uint8Array(hash));
  //   const entropyAvailable = hashArr.length * 4;
  //   if (numWords * entropyPerWord > entropyAvailable) {
  //     throw new Error('Output entropy of hash function is too small');
  //   }
  //
  //   const phrase: string[] = [];
  //   let hashNumber = bigInt.fromArray(hashArr, 256);
  //   while (numWords--) {
  //     const remainder = hashNumber.mod(EEFLongWordList.length);
  //     hashNumber = hashNumber.divide(EEFLongWordList.length);
  //     phrase.push(EEFLongWordList[remainder as any]);
  //   }
  //   return phrase;
  // }

  private async buildEncKey(
    key: SymmetricCryptoKey,
    encKey: ArrayBuffer
  ): Promise<[SymmetricCryptoKey, EncString]> {
    let encKeyEnc;

    if (key.key.byteLength === 32) {
      const newKey = await this.stretchKey(key);
      encKeyEnc = await this.encrypt(encKey, newKey);
    } else if (key.key.byteLength === 64) {
      encKeyEnc = await this.encrypt(encKey, key);
    } else {
      throw new Error('Invalid key size.');
    }

    return [new SymmetricCryptoKey(encKey), encKeyEnc];
  }

  // ENCRYPTION
  async encrypt(plainValue: string | ArrayBuffer, key: SymmetricCryptoKey): Promise<EncString> {
    if (key == null) {
      throw new Error('No encryption key provided.');
    }

    if (plainValue == null) {
      throw new Error('No value provided');
    }

    let plainBuf: ArrayBuffer;
    if (typeof plainValue === 'string') {
      plainBuf = Utils.fromUtf8ToArray(plainValue).buffer;
    } else {
      plainBuf = plainValue;
    }

    const encObj = await this.aesEncrypt(plainBuf, key);
    const iv = Utils.fromBufferToB64(encObj.iv!);
    const data = Utils.fromBufferToB64(encObj.data!);
    const mac = encObj.mac != null ? Utils.fromBufferToB64(encObj.mac) : null;
    // @ts-ignore
    return new EncString(encObj.key.encType, data, iv, mac);
  }

  async encryptToBytes(plainValue: ArrayBuffer, key: SymmetricCryptoKey): Promise<EncArrayBuffer> {
    if (key == null) {
      throw new Error('No encryption key provided.');
    }

    const encValue = await this.aesEncrypt(plainValue, key);
    let macLen = 0;
    if (encValue.mac != null) {
      macLen = encValue.mac.byteLength;
    }

    const encBytes = new Uint8Array(1 + encValue.iv!.byteLength + macLen + encValue.data!.byteLength);
    encBytes.set([encValue.key!.encType]);
    encBytes.set(new Uint8Array(encValue.iv!), 1);
    if (encValue.mac != null) {
      encBytes.set(new Uint8Array(encValue.mac), 1 + encValue.iv!.byteLength);
    }

    encBytes.set(new Uint8Array(encValue.data!), 1 + encValue.iv!.byteLength + macLen);
    return new EncArrayBuffer(encBytes.buffer);
  }

  async decryptToUtf8(encString: EncString, key: SymmetricCryptoKey): Promise<string> {
    if (key.macKey != null && encString?.mac == null) {
      throw('ERROR while decrypting');
    }

    if (key.encType !== encString.encryptionType) {
      throw('ERROR while decrypting');
    }

    const fastParams = Utils.aesDecryptFastParameters(
      // @ts-ignore
      encString.data,
      encString.iv,
      encString.mac,
      key
    );
    if (fastParams.macKey != null && fastParams.mac != null) {
      const computedMac = await Utils.hmacFast(
        // @ts-ignore
        fastParams.macData,
        fastParams.macKey,
        'sha256'
      );
      const macsEqual = await Utils.compareFast(fastParams.mac, computedMac);
      if (!macsEqual) {
        // @ts-ignore
        return null;
      }
    }

    return Utils.aesDecryptFast(fastParams);
  }



  async decryptToBytes(encThing: IEncrypted, key: SymmetricCryptoKey): Promise<ArrayBuffer> {
    if (key == null) {
      throw new Error('No encryption key provided.');
    }

    if (encThing == null) {
      throw new Error('Nothing provided for decryption.');
    }

    if (key.macKey != null && encThing.macBytes == null) {
      // @ts-ignore
      return null;
    }

    if (key.encType !== encThing.encryptionType) {
      // @ts-ignore
      return null;
    }

    if (key.macKey != null && encThing.macBytes != null) {
      const macData = new Uint8Array(encThing.ivBytes.byteLength + encThing.dataBytes.byteLength);
      macData.set(new Uint8Array(encThing.ivBytes), 0);
      macData.set(new Uint8Array(encThing.dataBytes), encThing.ivBytes.byteLength);
      const computedMac = await Utils.hmac(
        macData.buffer,
        key.macKey,
        'sha256'
      );
      if (computedMac === null) {
        // @ts-ignore
        return null;
      }

      const macsMatch = await Utils.compare(encThing.macBytes, computedMac);
      if (!macsMatch) {
        // @ts-ignore
        return null;
      }
    }

    const result = await Utils.aesDecrypt(
      encThing.dataBytes,
      encThing.ivBytes,
      // @ts-ignore
      key.encKey
    );

    return result ?? null;
  }

  private async aesEncrypt(data: ArrayBuffer, key: SymmetricCryptoKey): Promise<EncryptedObject> {
    const obj = new EncryptedObject();
    obj.key = key;
    obj.iv = await Utils.randomBytes(16);
    obj.data = await Utils.aesEncrypt(data, obj.iv, obj.key.encKey!);

    if (obj.key.macKey != null) {
      const macData = new Uint8Array(obj.iv.byteLength + obj.data.byteLength);
      macData.set(new Uint8Array(obj.iv), 0);
      macData.set(new Uint8Array(obj.data), obj.iv.byteLength);
      obj.mac = await Utils.hmac(macData.buffer, obj.key.macKey, 'sha256');
    }

    return obj;
  }
}
