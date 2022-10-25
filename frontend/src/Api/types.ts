import {Account, Contract as NearContract, Near, WalletConnection } from 'near-api-js';

export interface IVaultItemValue {
  content: string,
  created: number,
  updated: number
}

export interface IVaultItem extends IVaultItemValue {
  id: string,
}

export interface IGetAllResponse {
  [key: number]: IVaultItemValue
}

export interface IContract extends NearContract {
  add_item: (args: any) => void;
  update_item: (args: any) => void;
  delete_item: (args: any) => void;
  get_item: (args: any) => Promise<IVaultItemValue>;
  get_all: () => Promise<IGetAllResponse>;
}

export interface INearState {
  accountId?: string,
  account?: Account,
  contract: IContract,
  connection: Near,
  walletConnection: WalletConnection
}