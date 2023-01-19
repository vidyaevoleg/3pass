import {CryptoService, EncString, SymmetricCryptoKey} from 'Crypto';
import {KeysService} from 'Services/KeysService';
import { INearState } from 'Api';
import {ContractService} from 'Services/ContractService';
import {createStore, RootStoreInstance} from 'Store';

export interface IApp {
  store: RootStoreInstance,
  accountId?: string
  cryptoService: CryptoService,
  keysService: KeysService,
  contractService: ContractService,
  encrypt: (value: object) => Promise<string>,
  decrypt: <T>(value: string) => Promise<T>,
  afterSignUp: (cryptoKey: SymmetricCryptoKey, keyHashValue: string, encryptedCryptoKey: string) => Promise<void>;
}

export class App implements IApp {
  public readonly accountId?: string
  public readonly cryptoService: CryptoService;
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

  async afterSignUp(cryptoKey: SymmetricCryptoKey, keyHashValue: string, encryptedCryptoKey: string): Promise<void> {
    this.keysService.setup(cryptoKey, keyHashValue, encryptedCryptoKey);
    // here we close the current near connection with the deployer contract
    await this.contractService.signOut();
    // and create new near connection with the vault contract
    // near can have only one active contract connection
    await this.contractService.signInVault();
  }
}