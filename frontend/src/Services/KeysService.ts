import { SymmetricKey } from 'Crypto';

export class KeysService {
  public keyHash?: string;
  public cryptoKey?: SymmetricKey;
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

  setup (cryptoKeyValue: SymmetricKey, keyHashValue: string, encryptedCryptoKeyValue: string) {
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