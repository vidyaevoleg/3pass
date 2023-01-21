const forge = require('node-forge');

export class StringUtils {
  static isNullOrWhitespace(str: string): boolean {
    return str == null || typeof str !== "string" || str.trim() === "";
  }

  static toByteString(value: string | ArrayBuffer): string {
    let bytes: string;
    if (typeof value === "string") {
      bytes = forge.util.encodeUtf8(value);
    } else {
      bytes = this.fromBufferToByteString(value);
    }
    return bytes;
  }


  static toBuf(value: string | ArrayBuffer): ArrayBuffer {
    let buf: ArrayBuffer;
    if (typeof value === "string") {
      buf = this.fromUtf8ToArray(value).buffer;
    } else {
      buf = value;
    }
    return buf;
  }


  static fromB64ToArray(str: string): Uint8Array {
    const binaryString = window.atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  static fromUrlB64ToArray(str: string): Uint8Array {
    return this.fromB64ToArray(this.fromUrlB64ToB64(str));
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
    return this.fromB64toUrlB64(this.fromBufferToB64(buffer));
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
    return this.fromB64ToUtf8(this.fromUrlB64ToB64(urlB64Str));
  }

  static fromUtf8ToB64(utfStr: string): string {
    return decodeURIComponent(escape(window.btoa(utfStr)));
  }

  static fromUtf8ToUrlB64(utfStr: string): string {
    return this.fromBufferToUrlB64(this.fromUtf8ToArray(utfStr));
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
}