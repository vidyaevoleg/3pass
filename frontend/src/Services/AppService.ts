import {CryptoService, EncryptedString, HashPurpose, SymmetricKey} from 'Crypto';
import {KeysService} from 'Services/KeysService';
import {INearState} from 'Api';
import {ContractService} from 'Services/ContractService';
import {createStore, RootStoreInstance} from 'Store';

interface IKeys {
  cryptoKey: SymmetricKey,
  keyHash: string,
  encryptedCryptoKey: string
}

export interface IApp {
  store: RootStoreInstance,
  accountId?: string
  cryptoService: CryptoService,
  keysService: KeysService,
  contractService: ContractService,
  encrypt: (value: object) => Promise<string>,
  decrypt: <T>(value: string) => Promise<T>,
  authorizeVault: () => Promise<void>;
  fastSignIn: (login: string, password: string) => Promise<boolean>,
  vaultSignIn: (login: string, password: string) => Promise<boolean>,
  deployVault: (login: string, password: string) => Promise<void>;
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
    return encString.encryptedString;
  }

  async decrypt<T>(value: string): Promise<T> {
    const encString = EncryptedString.fromString(value);
    const decString = await this.cryptoService.decrypt(encString, this.keysService.cryptoKey!);
    return JSON.parse(decString) as T;
  }

  fastSignIn = async (login: string, password: string): Promise<boolean> =>  {
    const { keyHash: userHash } = await this.makeKeys(login, password, HashPurpose.LocalAuthorization);
    const result = this.keysService.keyHash === userHash;
    if (result) await this.afterSignIn(login, password);
    return result;
  };

  vaultSignIn = async (login: string, password: string): Promise<boolean> => {
    const { keyHash: userHash } = await this.makeKeys(login, password, HashPurpose.VaultAuthorization);
    const vaultHash = await this.contractService.getHash();
    const result = vaultHash === userHash;
    if (result) await this.afterSignIn(login, password);
    return result;
  };

  authorizeVault = async (): Promise<void> => {
    // here we close the current near connection with the deployer contract
    await this.contractService.signOut();
    // and create new near connection with the vault contract
    // near can have only one active contract connection
    await this.contractService.signInVault();
  }

  afterSignIn = async (login: string, password: string): Promise<void> => {
    const { cryptoKey, keyHash, encryptedCryptoKey } = await this.makeKeys(login, password);
    this.keysService.setup(cryptoKey, keyHash, encryptedCryptoKey);
  }

  makeKeys = async (login: string, password: string, purpose: HashPurpose = HashPurpose.LocalAuthorization): Promise<IKeys> => {
    const cryptoKey = await this.cryptoService.makeKey(password, this.accountId!);
    const keyHash = await this.cryptoService.hashPassword(password, cryptoKey.key, purpose);
    const [_, { encryptedString: encryptedCryptoKey }] = await this.cryptoService.makeEncKey(cryptoKey);
    return { cryptoKey, keyHash, encryptedCryptoKey: encryptedCryptoKey! }
  }

  deployVault = async (login: string, password: string): Promise<void> => {
    const { keyHash: userHash } = await this.makeKeys(login, password, HashPurpose.VaultAuthorization);
    await this.contractService.deployVault(login, userHash);
  }
}