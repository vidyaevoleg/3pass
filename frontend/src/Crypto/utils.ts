import { SymmetricCryptoKey } from "./symmetricCryptoKey";
var forge = require('node-forge');

export class DecryptParameters<T> {
  public encKey?: T;
  public data?: T;
  public iv?: T;
  public macKey?: T;
  public mac?: T;
  public macData?: T;
}

export class EncryptedObject {
  public iv?: ArrayBuffer;
  public data?: ArrayBuffer;
  public mac?: ArrayBuffer;
  public key?: SymmetricCryptoKey;
}

export enum EncryptionType {
  AesCbc256_B64 = 0,
  AesCbc128_HmacSha256_B64 = 1,
  AesCbc256_HmacSha256_B64 = 2,
  Rsa2048_OaepSha256_B64 = 3,
  Rsa2048_OaepSha1_B64 = 4,
  Rsa2048_OaepSha256_HmacSha256_B64 = 5,
  Rsa2048_OaepSha1_HmacSha256_B64 = 6,
}

export interface IEncrypted {
  encryptionType?: EncryptionType;
  dataBytes: ArrayBuffer;
  macBytes: ArrayBuffer;
  ivBytes: ArrayBuffer;
}


export class Utils {
  static tldEndingRegex =
    /.*\.(com|net|org|edu|uk|gov|ca|de|jp|fr|au|ru|ch|io|es|us|co|xyz|info|ly|mil)$/;
  // Transpiled version of /\p{Emoji_Presentation}/gu using https://mothereff.in/regexpu. Used for compatability in older browsers.
  static regexpEmojiPresentation =
    /(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])/g;

  static crypto = window.crypto;
  static subtle = window.crypto.subtle;

  static fromB64ToArray(str: string): Uint8Array {
    const binaryString = window.atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  static fromUrlB64ToArray(str: string): Uint8Array {
    return Utils.fromB64ToArray(Utils.fromUrlB64ToB64(str));
  }

  static fromHexToArray(str: string): Uint8Array {
    const bytes = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length; i += 2) {
      bytes[i / 2] = parseInt(str.substr(i, 2), 16);
    }
    return bytes;
  }

  static fromUtf8ToArray(str: string): Uint8Array {
    const strUtf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(strUtf8.length);
    for (let i = 0; i < strUtf8.length; i++) {
      arr[i] = strUtf8.charCodeAt(i);
    }
    return arr;
  }

  static fromByteStringToArray(str: string): Uint8Array {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  }

  static fromBufferToB64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  static fromBufferToUrlB64(buffer: ArrayBuffer): string {
    return Utils.fromB64toUrlB64(Utils.fromBufferToB64(buffer));
  }

  static fromB64toUrlB64(b64Str: string) {
    return b64Str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  static fromBufferToUtf8(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    // @ts-ignore
    const encodedString = String.fromCharCode.apply(null, bytes);
    return decodeURIComponent(escape(encodedString));
  }

  static fromBufferToByteString(buffer: ArrayBuffer): string {
    // @ts-ignore
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  // ref: https://stackoverflow.com/a/40031979/1090359
  static fromBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.prototype.map
      .call(bytes, (x: number) => ("00" + x.toString(16)).slice(-2))
      .join("");
  }

  static fromUrlB64ToB64(urlB64Str: string): string {
    let output = urlB64Str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw new Error("Illegal base64url string!");
    }

    return output;
  }

  static fromUrlB64ToUtf8(urlB64Str: string): string {
    return Utils.fromB64ToUtf8(Utils.fromUrlB64ToB64(urlB64Str));
  }

  static fromUtf8ToB64(utfStr: string): string {
    return decodeURIComponent(escape(window.btoa(utfStr)));
  }

  static fromUtf8ToUrlB64(utfStr: string): string {
    return Utils.fromBufferToUrlB64(Utils.fromUtf8ToArray(utfStr));
  }

  static fromB64ToUtf8(b64Str: string): string {
    return decodeURIComponent(escape(window.atob(b64Str)));
  }

  // ref: http://stackoverflow.com/a/2117523/1090359
  static newGuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static isGuid(id: string) {
    return RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      "i"
    ).test(id);
  }

  // static getHostname(uriString: string): string {
  //   const url = Utils.getUrl(uriString);
  //   try {
  //     return url != null && url.hostname !== "" ? url.hostname : null;
  //   } catch {
  //     return null;
  //   }
  // }

  // static getHost(uriString: string): string {
  //   const url = Utils.getUrl(uriString);
  //   try {
  //     return url != null && url.host !== "" ? url.host : null;
  //   } catch {
  //     return null;
  //   }
  // }

  // static getDomain(uriString: string): string {
  //   if (uriString == null) {
  //     return null;
  //   }
  //
  //   uriString = uriString.trim();
  //   if (uriString === "") {
  //     return null;
  //   }
  //
  //   if (uriString.startsWith("data:")) {
  //     return null;
  //   }
  //
  //   let httpUrl = uriString.startsWith("http://") || uriString.startsWith("https://");
  //   if (
  //     !httpUrl &&
  //     uriString.indexOf("://") < 0 &&
  //     Utils.tldEndingRegex.test(uriString) &&
  //     uriString.indexOf("@") < 0
  //   ) {
  //     uriString = "http://" + uriString;
  //     httpUrl = true;
  //   }
  //
  //   if (httpUrl) {
  //     try {
  //       const url = Utils.getUrlObject(uriString);
  //       const validHostname = tldjs?.isValid != null ? tldjs.isValid(url.hostname) : true;
  //       if (!validHostname) {
  //         return null;
  //       }
  //
  //       if (url.hostname === "localhost" || Utils.validIpAddress(url.hostname)) {
  //         return url.hostname;
  //       }
  //
  //       const urlDomain =
  //         tldjs != null && tldjs.getDomain != null ? tldjs.getDomain(url.hostname) : null;
  //       return urlDomain != null ? urlDomain : url.hostname;
  //     } catch (e) {
  //       // Invalid domain, try another approach below.
  //     }
  //   }
  //
  //   try {
  //     const domain = tldjs != null && tldjs.getDomain != null ? tldjs.getDomain(uriString) : null;
  //
  //     if (domain != null) {
  //       return domain;
  //     }
  //   } catch {
  //     return null;
  //   }
  //
  //   return null;
  // }

  // static getQueryParams(uriString: string): Map<string, string> {
  //   const url = Utils.getUrl(uriString);
  //   if (url == null || url.search == null || url.search === "") {
  //     return null;
  //   }
  //   const map = new Map<string, string>();
  //   const pairs = (url.search[0] === "?" ? url.search.substr(1) : url.search).split("&");
  //   pairs.forEach((pair) => {
  //     const parts = pair.split("=");
  //     if (parts.length < 1) {
  //       return;
  //     }
  //     map.set(
  //       decodeURIComponent(parts[0]).toLowerCase(),
  //       parts[1] == null ? "" : decodeURIComponent(parts[1])
  //     );
  //   });
  //   return map;
  // }

  // static getSortFunction(i18nService: I18nService, prop: string) {
  //   return (a: any, b: any) => {
  //     if (a[prop] == null && b[prop] != null) {
  //       return -1;
  //     }
  //     if (a[prop] != null && b[prop] == null) {
  //       return 1;
  //     }
  //     if (a[prop] == null && b[prop] == null) {
  //       return 0;
  //     }
  //
  //     return i18nService.collator
  //       ? i18nService.collator.compare(a[prop], b[prop])
  //       : a[prop].localeCompare(b[prop]);
  //   };
  // }

  static isNullOrWhitespace(str: string): boolean {
    return str === null || typeof str !== "string" || str.trim() === "";
  }

  static isNullOrEmpty(str: string): boolean {
    return str === null || typeof str !== "string" || str === "";
  }

  static nameOf<T>(name: string & keyof T) {
    return name;
  }

  // @ts-ignore
  static assign<T>(target: T, source: Partial<T>): T {
    // @ts-ignore
    return Object.assign(target, source);
  }

  static iterateEnum<O extends object, K extends keyof O = keyof O>(obj: O) {
    return (Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[]).map((k) => obj[k]);
  }

  static async pbkdf2(
    password: string | ArrayBuffer,
    salt: string | ArrayBuffer,
    algorithm: "sha256" | "sha512",
    iterations: number
  ): Promise<ArrayBuffer> {
    const wcLen = algorithm === "sha256" ? 256 : 512;
    const passwordBuf = this.toBuf(password);
    const saltBuf = this.toBuf(salt);

    const pbkdf2Params: Pbkdf2Params = {
      name: "PBKDF2",
      salt: saltBuf,
      iterations: iterations,
      hash: { name: this.toWebCryptoAlgorithm(algorithm) },
    };

    const impKey = await this.subtle.importKey(
      "raw",
      passwordBuf,
      { name: "PBKDF2" } as any,
      false,
      ["deriveBits"]
    );

    return await Utils.subtle.deriveBits(pbkdf2Params, impKey, wcLen);
  }

  static async hkdf(
    ikm: ArrayBuffer,
    salt: string | ArrayBuffer,
    info: string | ArrayBuffer,
    outputByteSize: number,
    algorithm: "sha256" | "sha512"
  ): Promise<ArrayBuffer> {
    const saltBuf = Utils.toBuf(salt);
    const infoBuf = Utils.toBuf(info);

    const hkdfParams: HkdfParams = {
      name: "HKDF",
      salt: saltBuf,
      info: infoBuf,
      hash: { name: this.toWebCryptoAlgorithm(algorithm) },
    };

    const impKey = await this.subtle.importKey("raw", ikm, { name: "HKDF" } as any, false, [
      "deriveBits",
    ]);
    return await Utils.subtle.deriveBits(hkdfParams as any, impKey, outputByteSize * 8);
  }

  // ref: https://tools.ietf.org/html/rfc5869
  static async hkdfExpand(
    prk: ArrayBuffer,
    info: string | ArrayBuffer,
    outputByteSize: number,
    algorithm: "sha256" | "sha512"
  ): Promise<ArrayBuffer> {
    const hashLen = algorithm === "sha256" ? 32 : 64;
    if (outputByteSize > 255 * hashLen) {
      throw new Error("outputByteSize is too large.");
    }
    const prkArr = new Uint8Array(prk);
    if (prkArr.length < hashLen) {
      throw new Error("prk is too small.");
    }
    const infoBuf = this.toBuf(info);
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
    algorithm: "sha1" | "sha256" | "sha512" | "md5"
  ): Promise<ArrayBuffer> {
    if (algorithm === "md5") {
      const md = algorithm === "md5" ? forge.md.md5.create() : forge.md.sha1.create();
      const valueBytes = this.toByteString(value);
      md.update(valueBytes, "raw");
      return Utils.fromByteStringToArray(md.digest().data).buffer;
    }

    const valueBuf = Utils.toBuf(value);
    return await Utils.subtle.digest({ name: this.toWebCryptoAlgorithm(algorithm) }, valueBuf);
  }

  static async hmac(
    value: ArrayBuffer,
    key: ArrayBuffer,
    algorithm: "sha1" | "sha256" | "sha512"
  ): Promise<ArrayBuffer> {
    const signingAlgorithm = {
      name: "HMAC",
      hash: { name: this.toWebCryptoAlgorithm(algorithm) },
    };

    const impKey = await Utils.subtle.importKey("raw", key, signingAlgorithm, false, ["sign"]);
    return await Utils.subtle.sign(signingAlgorithm, impKey, value);
  }

  // Safely compare two values in a way that protects against timing attacks (Double HMAC Verification).
  // ref: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/
  // ref: https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy
  static async compare(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean> {
    const macKey = await Utils.randomBytes(32);
    const signingAlgorithm = {
      name: "HMAC",
      hash: { name: "SHA-256" },
    };
    const impKey = await Utils.subtle.importKey("raw", macKey, signingAlgorithm, false, ["sign"]);
    const mac1 = await Utils.subtle.sign(signingAlgorithm, impKey, a);
    const mac2 = await Utils.subtle.sign(signingAlgorithm, impKey, b);

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

  static hmacFast(value: string, key: string, algorithm: "sha1" | "sha256" | "sha512"): Promise<string> {
    const hmac = forge.hmac.create();
    hmac.start(algorithm, key);
    hmac.update(value);
    const bytes = hmac.digest().getBytes();
    return Promise.resolve(bytes);
  }

  static async compareFast(a: string, b: string): Promise<boolean> {
    const rand = await Utils.randomBytes(32);
    const bytes = new Uint32Array(rand);
    const buffer = forge.util.createBuffer();
    for (let i = 0; i < bytes.length; i++) {
      buffer.putInt32(bytes[i]);
    }
    const macKey = buffer.getBytes();

    const hmac = forge.hmac.create();
    hmac.start("sha256", macKey);
    hmac.update(a);
    const mac1 = hmac.digest().getBytes();

    hmac.start(null, null);
    hmac.update(b);
    const mac2 = hmac.digest().getBytes();

    const equals = mac1 === mac2;
    return equals;
  }

  static async aesEncrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer> {
    const impKey = await Utils.subtle.importKey("raw", key, { name: "AES-CBC" } as any, false, [
      "encrypt",
    ]);
    return await Utils.subtle.encrypt({ name: "AES-CBC", iv: iv }, impKey, data);
  }

  static aesDecryptFastParameters(
    data: string,
    iv: string,
    mac: string,
    key: SymmetricCryptoKey
  ): DecryptParameters<string> {
    const p = new DecryptParameters<string>();
    if (key.meta != null) {
      p.encKey = key.meta.encKeyByteString;
      p.macKey = key.meta.macKeyByteString;
    }

    if (p.encKey === null) {
      p.encKey = forge.util.decode64(key.encKeyB64);
    }
    p.data = forge.util.decode64(data);
    p.iv = forge.util.decode64(iv);
    // @ts-ignore
    p.macData = p.iv + p.data;
    if (p.macKey === null && key.macKeyB64 != null) {
      p.macKey = forge.util.decode64(key.macKeyB64);
    }
    if (mac != null) {
      p.mac = forge.util.decode64(mac);
    }

    // cache byte string keys for later
    if (key.meta === null) {
      key.meta = {};
    }
    if (key.meta.encKeyByteString === null) {
      key.meta.encKeyByteString = p.encKey;
    }
    if (p.macKey != null && key.meta.macKeyByteString === null) {
      key.meta.macKeyByteString = p.macKey;
    }

    return p;
  }

  static aesDecryptFast(parameters: DecryptParameters<string>): Promise<string> {
    const dataBuffer = forge.util.createBuffer(parameters.data);
    const decipher = forge.cipher.createDecipher("AES-CBC", parameters.encKey);
    decipher.start({ iv: parameters.iv });
    decipher.update(dataBuffer);
    decipher.finish();
    const val = decipher.output.toString();
    return Promise.resolve(val);
  }

  static async aesDecrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer> {
    const impKey = await Utils.subtle.importKey("raw", key, { name: "AES-CBC" } as any, false, [
      "decrypt",
    ]);
    return await Utils.subtle.decrypt({ name: "AES-CBC", iv: iv }, impKey, data);
  }

  static async rsaEncrypt(
    data: ArrayBuffer,
    publicKey: ArrayBuffer,
    algorithm: "sha1" | "sha256"
  ): Promise<ArrayBuffer> {
    // Note: Edge browser requires that we specify name and hash for both key import and decrypt.
    // We cannot use the proper types here.
    const rsaParams = {
      name: "RSA-OAEP",
      hash: { name: Utils.toWebCryptoAlgorithm(algorithm) },
    };
    const impKey = await Utils.subtle.importKey("spki", publicKey, rsaParams, false, ["encrypt"]);
    return await Utils.subtle.encrypt(rsaParams, impKey, data);
  }

  static async rsaDecrypt(
    data: ArrayBuffer,
    privateKey: ArrayBuffer,
    algorithm: "sha1" | "sha256"
  ): Promise<ArrayBuffer> {
    // Note: Edge browser requires that we specify name and hash for both key import and decrypt.
    // We cannot use the proper types here.
    const rsaParams = {
      name: "RSA-OAEP",
      hash: { name: Utils.toWebCryptoAlgorithm(algorithm) },
    };
    const impKey = await Utils.subtle.importKey("pkcs8", privateKey, rsaParams, false, ["decrypt"]);
    return await Utils.subtle.decrypt(rsaParams, impKey, data);
  }

  static async rsaExtractPublicKey(privateKey: ArrayBuffer): Promise<ArrayBuffer> {
    const rsaParams = {
      name: "RSA-OAEP",
      // Have to specify some algorithm
      hash: { name: Utils.toWebCryptoAlgorithm("sha1") },
    };
    const impPrivateKey = await Utils.subtle.importKey("pkcs8", privateKey, rsaParams, true, [
      "decrypt",
    ]);
    const jwkPrivateKey = await Utils.subtle.exportKey("jwk", impPrivateKey);
    const jwkPublicKeyParams = {
      kty: "RSA",
      e: jwkPrivateKey.e,
      n: jwkPrivateKey.n,
      alg: "RSA-OAEP",
      ext: true,
    };
    const impPublicKey = await Utils.subtle.importKey("jwk", jwkPublicKeyParams, rsaParams, true, [
      "encrypt",
    ]);
    return await Utils.subtle.exportKey("spki", impPublicKey);
  }

  static async rsaGenerateKeyPair(length: 1024 | 2048 | 4096): Promise<[ArrayBuffer, ArrayBuffer]> {
    const rsaParams = {
      name: "RSA-OAEP",
      modulusLength: length,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      // Have to specify some algorithm
      hash: { name: Utils.toWebCryptoAlgorithm("sha1") },
    };
    const keyPair = (await Utils.subtle.generateKey(rsaParams, true, [
      "encrypt",
      "decrypt",
    ])) as CryptoKeyPair;
    const publicKey = await Utils.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await Utils.subtle.exportKey("pkcs8", keyPair.privateKey);
    return [publicKey, privateKey];
  }

  static randomBytes(length: number): Promise<ArrayBuffer> {
    const arr = new Uint8Array(length);
    Utils.crypto.getRandomValues(arr);
    return Promise.resolve(arr.buffer);
  }

  static toBuf(value: string | ArrayBuffer): ArrayBuffer {
    let buf: ArrayBuffer;
    if (typeof value === "string") {
      buf = Utils.fromUtf8ToArray(value).buffer;
    } else {
      buf = value;
    }
    return buf;
  }

  static toByteString(value: string | ArrayBuffer): string {
    let bytes: string;
    if (typeof value === "string") {
      bytes = forge.util.encodeUtf8(value);
    } else {
      bytes = Utils.fromBufferToByteString(value);
    }
    return bytes;
  }

  static toWebCryptoAlgorithm(algorithm: "sha1" | "sha256" | "sha512" | "md5"): string {
    if (algorithm === "md5") {
      throw new Error("MD5 is not supported in WebCrypto.");
    }
    return algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : "SHA-512";
  }

  // static getUrl(uriString: string): URL {
  //   if (uriString == null) {
  //     return null;
  //   }
  //
  //   uriString = uriString.trim();
  //   if (uriString === "") {
  //     return null;
  //   }
  //
  //   let url = Utils.getUrlObject(uriString);
  //   if (url == null) {
  //     const hasHttpProtocol =
  //       uriString.indexOf("http://") === 0 || uriString.indexOf("https://") === 0;
  //     if (!hasHttpProtocol && uriString.indexOf(".") > -1) {
  //       url = Utils.getUrlObject("http://" + uriString);
  //     }
  //   }
  //   return url;
  // }

  // static camelToPascalCase(s: string) {
  //   return s.charAt(0).toUpperCase() + s.slice(1);
  // }
  //
  // private static validIpAddress(ipString: string): boolean {
  //   const ipRegex =
  //     /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  //   return ipRegex.test(ipString);
  // }

  // private static isMobile(win: Window) {
  //   let mobile = false;
  //   ((a) => {
  //     if (
  //       /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
  //         a
  //       ) ||
  //       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
  //         a.substr(0, 4)
  //       )
  //     ) {
  //       mobile = true;
  //     }
  //   })(win.navigator.userAgent || win.navigator.vendor || (win as any).opera);
  //   return mobile || win.navigator.userAgent.match(/iPad/i) != null;
  // }

  // private static isAppleMobile(win: Window) {
  //   return (
  //     win.navigator.userAgent.match(/iPhone/i) != null ||
  //     win.navigator.userAgent.match(/iPad/i) != null
  //   );
  // }

  // private static getUrlObject(uriString: string): URL {
  //   try {
  //     if (nodeURL != null) {
  //       return new nodeURL.URL(uriString);
  //     } else if (typeof URL === "function") {
  //       return new URL(uriString);
  //     } else if (typeof window !== "undefined") {
  //       const hasProtocol = uriString.indexOf("://") > -1;
  //       if (!hasProtocol && uriString.indexOf(".") > -1) {
  //         uriString = "http://" + uriString;
  //       } else if (!hasProtocol) {
  //         return null;
  //       }
  //       const anchor = window.document.createElement("a");
  //       anchor.href = uriString;
  //       return anchor as any;
  //     }
  //   } catch (e) {
  //     // Ignore error
  //   }
  //
  //   return null;
  // }
}
