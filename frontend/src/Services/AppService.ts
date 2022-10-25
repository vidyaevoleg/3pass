import {CryptoService, EncString, SymmetricCryptoKey} from 'Crypto';
import {KeysService} from 'Services/KeysService';
import { INearState } from 'Api';
import {ContractService} from 'Services/ContractService';
import {createStore, RootStoreInstance} from 'Store';

export interface IApp {
  accountId?: string
  cryptoService: CryptoService,
  keysService: KeysService,
  contractService: ContractService,
  encrypt: (value: object) => Promise<string>,
  decrypt: <T>(value: string) => Promise<T>,
  store: RootStoreInstance,
  afterSignUp: (cryptoKey: SymmetricCryptoKey, keyHashValue: string, encryptedCryptoKey: string) => void;
}

export class App implements IApp {
  public readonly accountId?: string
  public cryptoService: CryptoService;
  public keysService: KeysService
  public contractService: ContractService;
  public store: RootStoreInstance;

  static instance: IApp;

  static init(state: INearState) {
    if (!this.instance) {
      this.instance = new App(state);
    }
    return this.instance;
  }

  constructor(state: INearState) {
    this.accountId = state.accountId;
    this.cryptoService = new CryptoService();
    this.keysService = new KeysService();
    this.contractService = new ContractService(state);
    this.store = createStore(state, this);
  }

  async encrypt(value: object): Promise<string> {
    const json = JSON.stringify(value);
    const encString = await this.cryptoService.encrypt(json, this.keysService.cryptoKey!);
    return encString.encryptedString!;
  }

  async decrypt<T>(value: string): Promise<T> {
    const encString = new EncString(value);
    const decString = await this.cryptoService.decryptToUtf8(encString, this.keysService.cryptoKey!);
    return JSON.parse(decString) as T;
  }

  afterSignUp(cryptoKey: SymmetricCryptoKey, keyHashValue: string, encryptedCryptoKey: string) {
    this.keysService.setup(cryptoKey, keyHashValue, encryptedCryptoKey);
  }
}