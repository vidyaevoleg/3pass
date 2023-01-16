import {
  IVaultContract,
  IGetAllResponse,
  INearState,
  IDeployerContract,
  VAULT_CHANGE_METHODS,
  DEPLOYER_CONTRACT_ID,
  VAULT_CONTRACT_CONFIG,
  DEPLOYER_CONTRACT_CONFIG,
  DEPLOYER_CHANGE_METHODS
} from 'Api';
import {Near as Connection} from 'near-api-js/lib/near';
import {WalletConnection, utils} from 'near-api-js';
import {Contract as NearContract} from 'near-api-js/lib/contract';

export class ContractService {
  public vaultContract?: IVaultContract;
  public readonly deployerContract: IDeployerContract;
  private readonly connection: Connection;
  private readonly walletConnection: WalletConnection;

  constructor(state: INearState) {
    const { walletConnection, connection } = state;
    this.deployerContract = new NearContract(walletConnection.account(), DEPLOYER_CONTRACT_ID!, DEPLOYER_CONTRACT_CONFIG) as IDeployerContract;
    this.connection = connection;
    this.walletConnection = walletConnection;
  }

  setVaultContract(vaultContractId: string) {
    this.vaultContract = new NearContract(this.walletConnection.account(), vaultContractId, VAULT_CONTRACT_CONFIG) as IVaultContract;
  }

  async signIn () {
    await this.walletConnection.requestSignIn({
      contractId: this.deployerContract.contractId,
      methodNames: DEPLOYER_CHANGE_METHODS
    });
  }

  async signInVault () {
    await this.walletConnection.requestSignIn({
      contractId: this.vaultContract!.contractId,
      methodNames: VAULT_CHANGE_METHODS
    });
  }

  async signOut () {
    await this.walletConnection.signOut();
  }

  async addItem(id: number, content: string) {
    return this.vaultContract!.add_item({
      args: { id, hashed_content: content }
    });
  }

  async updateItem(id: number, content: string) {
    return this.vaultContract!.update_item({
      args: { id, hashed_content: content }
    })
  }

  async deleteItem(id: number) {
    return this.vaultContract!.delete_item({
      args: { id }
    })
  }

  async getItem(id: number) {
    return this.vaultContract!.get_item({
      args: { id }
    });
  }

  async getHash(): Promise<string> {
    return this.vaultContract!.get_hash();
  }

  async getAll(): Promise<IGetAllResponse> {
    return this.vaultContract!.get_all();
  }

  async getVault(accountId: string): Promise<string> {
    return this.deployerContract.get_vault(
      { account_id: accountId }
    );
  }

  async deleteVault(): Promise<void> {
    return this.deployerContract.delete_vault();
  }

  async deployVault(prefix: string, hash: string): Promise<void> {
    // near doesn't like dots in contract names
    const fixedPrefix = prefix.replace(".", "_");

    return this.deployerContract.deploy_vault({
      args: { prefix: fixedPrefix, hash },
      amount: utils.format.parseNearAmount("2")
    });
  }
}