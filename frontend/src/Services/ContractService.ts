import {CONTRACT_NAME, CONTRACT_REQUIRED_METHODS, IContract, IGetAllResponse, INearState} from 'Api';
import {Near as Connection} from 'near-api-js/lib/near';
import {WalletConnection} from 'near-api-js';

export class ContractService {
  public readonly contract: IContract;
  private readonly connection: Connection;
  private readonly walletConnection: WalletConnection;

  constructor(state: INearState) {
    this.contract = state.contract;
    this.connection = state.connection;
    this.walletConnection = state.walletConnection;
  }

  async signIn () {
    await this.walletConnection.requestSignIn({
      contractId: CONTRACT_NAME,
      methodNames: CONTRACT_REQUIRED_METHODS
    });
  }

  async signOut () {
    await this.walletConnection.signOut();
  }

  async addItem(id: number, content: string) {
    return this.contract.add_item({
      args: { id, hashed_content: content }
    });
  }

  async updateItem(id: number, content: string) {
    return this.contract.update_item({
      args: { id, hashed_content: content }
    })
  }

  async deleteItem(id: number) {
    return this.contract.delete_item({
      args: { id }
    })
  }

  async getItem(id: number) {
    return this.contract.get_item({
      args: { id }
    });
  }

  async getAll(): Promise<IGetAllResponse> {
    return this.contract.get_all();
  }
}