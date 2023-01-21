import { SymmetricKey } from './SymmetricKey';
import {DecryptParameters} from 'Crypto/types';
import Utils from 'Utils';

const forge = require('node-forge');

const toWebCryptoAlgorithm = (algorithm: 'sha1' | 'sha256' | 'sha512'): string => {
  if (algorithm === 'sha1') {
    return 'SHA-1';
  } else if (algorithm === 'sha256') {
    return 'SHA-256';
  } else {
    return 'SHA-512';
  }
}

export class Algo {
  static crypto = window.crypto;
  static subtle = window.crypto.subtle;

  static async pbkdf2(
    password: string | ArrayBuffer,
    salt: string | ArrayBuffer,
    algorithm: 'sha256' | 'sha512',
    iterations: number
  ): Promise<ArrayBuffer> {
    const wcLen = algorithm === 'sha256' ? 256 : 512;
    const passwordBuf = Utils.string.toBuf(password);
    const saltBuf = Utils.string.toBuf(salt);

    const pbkdf2Params: Pbkdf2Params = {
      name: 'PBKDF2',
      salt: saltBuf,
      iterations: iterations,
      hash: { name: toWebCryptoAlgorithm(algorithm) },
    };

    const impKey = await this.subtle.importKey(
      'raw',
      passwordBuf,
      { name: 'PBKDF2' } as HmacImportParams,
      false,
      ['deriveBits']
    );

    return await Algo.subtle.deriveBits(pbkdf2Params, impKey, wcLen);
  }

  // ref: https://tools.ietf.org/html/rfc5869
  static async hkdfExpand(
    prk: ArrayBuffer,
    info: string | ArrayBuffer,
    outputByteSize: number,
    algorithm: 'sha256' | 'sha512'
  ): Promise<ArrayBuffer> {
    const hashLen = algorithm === 'sha256' ? 32 : 64;
    if (outputByteSize > 255 * hashLen) {
      throw new Error('outputByteSize is too large.');
    }
    const prkArr = new Uint8Array(prk);
    if (prkArr.length < hashLen) {
      throw new Error('prk is too small.');
    }
    const infoBuf = Utils.string.toBuf(info);
    const infoArr = new Uint8Array(infoBuf);
    let runningOkmLength = 0;
    let previousT = new Uint8Array(0);
    const n = Math.ceil(outputByteSize / hashLen);
    const okm = new Uint8Array(n * hashLen);
    for (let i = 0; i < n; i++) {
      const t = new Uint8Array(previousT.length + infoArr.length + 1);
      t.set(previousT);
      t.set(infoArr, previousT.length);
      t.set([i + 1], t.length - 1);
      previousT = new Uint8Array(await this.hmac(t.buffer, prk, algorithm));
      okm.set(previousT, runningOkmLength);
      runningOkmLength += previousT.length;
      if (runningOkmLength >= outputByteSize) {
        break;
      }
    }
    return okm.slice(0, outputByteSize).buffer;
  }

  static async hash(
    value: string | ArrayBuffer,
    algorithm: 'sha1' | 'sha256' | 'sha512' | 'md5'
  ): Promise<ArrayBuffer> {
    if (algorithm === 'md5') {
      const md = algorithm === 'md5' ? forge.md.md5.create() : forge.md.sha1.create();
      const valueBytes = Utils.string.toByteString(value);
      md.update(valueBytes, 'raw');
      return Utils.string.fromByteStringToArray(md.digest().data).buffer;
    }

    const valueBuf = Utils.string.toBuf(value);
    return await Algo.subtle.digest({ name: toWebCryptoAlgorithm(algorithm) }, valueBuf);
  }

  static async hmac(
    value: ArrayBuffer,
    key: ArrayBuffer,
    algorithm: 'sha1' | 'sha256' | 'sha512'
  ): Promise<ArrayBuffer> {
    const signingAlgorithm = {
      name: 'HMAC',
      hash: { name: toWebCryptoAlgorithm(algorithm) },
    };

    const impKey = await Algo.subtle.importKey('raw', key, signingAlgorithm, false, ['sign']);
    return await Algo.subtle.sign(signingAlgorithm, impKey, value);
  }

  // Safely compare two values in a way that protects against timing attacks (Double HMAC Verification).
  // ref: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/
  // ref: https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy
  static async compare(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> {
    const macKey = await Algo.randomBytes(32);
    const signingAlgorithm = {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    };
    const impKey = await Algo.subtle.importKey('raw', macKey, signingAlgorithm, false, ['sign']);
    const mac1 = await Algo.subtle.sign(signingAlgorithm, impKey, a);
    const mac2 = await Algo.subtle.sign(signingAlgorithm, impKey, b);

    if (mac1.byteLength !== mac2.byteLength) {
      return false;
    }

    const arr1 = new Uint8Array(mac1);
    const arr2 = new Uint8Array(mac2);
    for (let i = 0; i < arr2.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  static hmacFast(value: string, key: string, algorithm: 'sha1' | 'sha256' | 'sha512'): Promise<string> {
    const hmac = forge.hmac.create();
    hmac.start(algorithm, key);
    hmac.update(value);
    const bytes = hmac.digest().getBytes();
    return Promise.resolve(bytes);
  }

  static async compareFast(a: string, b: string): Promise<boolean> {
    const rand = await Algo.randomBytes(32);
    const bytes = new Uint32Array(rand);
    const buffer = forge.util.createBuffer();
    for (let i = 0; i < bytes.length; i++) {
      buffer.putInt32(bytes[i]);
    }
    const macKey = buffer.getBytes();

    const hmac = forge.hmac.create();
    hmac.start('sha256', macKey);
    hmac.update(a);
    const mac1 = hmac.digest().getBytes();

    hmac.start(null, null);
    hmac.update(b);
    const mac2 = hmac.digest().getBytes();

    const equals = mac1 === mac2;
    return equals;
  }

  static async aesEncrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer> {
    const impKey = await Algo.subtle.importKey('raw', key, { name: 'AES-CBC' } as HmacImportParams, false, [
      'encrypt',
    ]);
    return await Algo.subtle.encrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
  }

  static aesDecryptFastParameters(
    data: string,
    iv: string,
    mac: string,
    key: SymmetricKey
  ): DecryptParameters<string> {
    const p = new DecryptParameters<string>();

    if (key.meta != null) {
      p.encKey = key.meta.encKeyByteString;
      p.macKey = key.meta.macKeyByteString;
    }

    if (p.encKey == null) {
      p.encKey = forge.util.decode64(key.encKeyB64);
    }

    p.data = forge.util.decode64(data) as string;
    p.iv = forge.util.decode64(iv) as string;
    p.macData = p.iv + p.data;

    if (p.macKey == null && key.macKeyB64 != null) {
      p.macKey = forge.util.decode64(key.macKeyB64);
    }

    if (mac != null) {
      p.mac = forge.util.decode64(mac) as string;
    }

    // cache byte string keys for later
    if (key.meta == null) {
      key.meta = {};
    }
    if (key.meta.encKeyByteString == null) {
      key.meta.encKeyByteString = p.encKey!;
    }

    if (p.macKey != null && key.meta.macKeyByteString == null) {
      key.meta.macKeyByteString = p.macKey;
    }

    return p;
  }

  static aesDecryptFast(parameters: DecryptParameters<string>): Promise<string> {
    const dataBuffer = forge.util.createBuffer(parameters.data);
    const decipher = forge.cipher.createDecipher('AES-CBC', parameters.encKey);
    decipher.start({ iv: parameters.iv });
    decipher.update(dataBuffer);
    decipher.finish();
    const val = decipher.output.toString();
    return Promise.resolve(val);
  }

  static randomBytes(length: number): Promise<ArrayBuffer> {
    const arr = new Uint8Array(length);
    Algo.crypto.getRandomValues(arr);
    return Promise.resolve(arr.buffer);
  }
}
