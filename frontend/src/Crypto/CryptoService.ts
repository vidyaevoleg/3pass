import {SymmetricKey} from './SymmetricKey';
import {EncryptedString} from './EncryptedString';
import {EncryptedObject, HashPurpose, KdfIterations, KdfType} from './types';
import {Algo} from 'Crypto/Algo';
import Utils from 'Utils';

export class CryptoService {
  async makeKey(
    password: string,
    salt: string,
    kdf: KdfType = KdfType.PBKDF2_SHA256,
    kdfIterations: number = KdfIterations.default,
  ): Promise<SymmetricKey> {
    if (kdfIterations < KdfIterations.min) {
      throw new Error('PBKDF2 iteration minimum is 5000.');
    }
    const key = await Algo.pbkdf2(password, salt, 'sha256', kdfIterations);
    return new SymmetricKey(key);
  }

  async hashPassword(
    password: string,
    salt: string | ArrayBuffer,
    hashPurpose?: HashPurpose
  ): Promise<string> {
    const iterations = hashPurpose == HashPurpose.LocalAuthorization ? 2 : 1;
    const hashBuff = await Algo.pbkdf2(password, salt, 'sha256', iterations);
    return Utils.string.fromBufferToB64(hashBuff);
  }

  async makeEncKey(key: SymmetricKey): Promise<[SymmetricKey, EncryptedString]> {
    let encKeyEnc;
    const encKey = await Algo.randomBytes(64);

    if (key.key.byteLength === 32) {
      const newKey = await this.stretchKey(key);
      encKeyEnc = await this.encrypt(encKey, newKey);
    } else if (key.key.byteLength === 64) {
      encKeyEnc = await this.encrypt(encKey, key);
    } else {
      throw new Error('Invalid key size.');
    }

    return [new SymmetricKey(encKey), encKeyEnc];
  }

  // ENCRYPTION
  async encrypt(plainValue: string | ArrayBuffer, key: SymmetricKey): Promise<EncryptedString> {
    const plainBuf = (plainValue instanceof ArrayBuffer) ? plainValue : Utils.string.fromUtf8ToArray(plainValue).buffer;
    const obj = await this.aesEncrypt(plainBuf, key);
    const iv = Utils.string.fromBufferToB64(obj.iv);
    const data = Utils.string.fromBufferToB64(obj.data);
    const mac = obj.mac ? Utils.string.fromBufferToB64(obj.mac) : undefined;
    return EncryptedString.fromData(obj.key.encType, data, iv, mac);
  }

  async decrypt(encString: EncryptedString, key: SymmetricKey): Promise<string> {
    if (key.macKey && !encString?.mac) {
      throw('ERROR while decrypting');
    }

    if (key.encType !== encString.encryptionType) {
      throw('ERROR while decrypting');
    }

    const fastParams = Algo.aesDecryptFastParameters(
      encString.data!,
      encString.iv!,
      encString.mac!,
      key
    );
    if (fastParams.macKey != null && fastParams.mac != null) {
      const computedMac = await Algo.hmacFast(
        fastParams.macData!,
        fastParams.macKey,
        'sha256'
      );
      const macsEqual = await Algo.compareFast(fastParams.mac, computedMac);

      if (!macsEqual) {
        throw('ERROR while decrypting');
      }
    }

    return Algo.aesDecryptFast(fastParams);
  }

  // ---HELPERS---

  private async stretchKey(key: SymmetricKey): Promise<SymmetricKey> {
    const newKey = new Uint8Array(64);
    const encKey = await Algo.hkdfExpand(key.key, 'enc', 32, 'sha256');
    const macKey = await Algo.hkdfExpand(key.key, 'mac', 32, 'sha256');
    newKey.set(new Uint8Array(encKey));
    newKey.set(new Uint8Array(macKey), 32);
    return new SymmetricKey(newKey.buffer);
  }

  private async aesEncrypt(buffer: ArrayBuffer, key: SymmetricKey): Promise<EncryptedObject> {
    const iv = await Algo.randomBytes(16);
    const data = await Algo.aesEncrypt(buffer, iv, key.encKey!);
    let mac;

    if (key.macKey) {
      const macData = new Uint8Array(iv.byteLength + data.byteLength);
      macData.set(new Uint8Array(iv), 0);
      macData.set(new Uint8Array(data), iv.byteLength);
      mac = await Algo.hmac(macData.buffer, key.macKey, 'sha256');
    }

    return new EncryptedObject(key, data, iv, mac);
  }
}
