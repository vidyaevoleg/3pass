import { SymmetricCryptoKey } from 'Crypto';

export class KeysService {
  public keyHash?: string;
  public cryptoKey?: SymmetricCryptoKey;
  private encryptedCryptoKey?: string;

  constructor() {
    if (localStorage.getItem('keyHash')) {
      this.keyHash = localStorage.getItem('keyHash')!;
    }
  }

  clear () {
    // clear local store
    localStorage.clear();
  }

  setup (cryptoKeyValue: SymmetricCryptoKey, keyHashValue: string, encryptedCryptoKeyValue: string) {
    this.keyHash = keyHashValue;
    this.cryptoKey = cryptoKeyValue;
    this.encryptedCryptoKey = encryptedCryptoKeyValue;

    localStorage.setItem('keyHash', keyHashValue);
  }

  // setCryptoKey = (value?: SymmetricCryptoKey) => {
  //   this.cryptoKey = value;
  // }

  resetKeys = () => {
    this.cryptoKey = undefined;
    this.encryptedCryptoKey = undefined;
  }

  get readyForFastLogin (): boolean {
    return !!this.keyHash;
  }
}