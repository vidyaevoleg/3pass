import {Account, Contract as NearContract, Near, WalletConnection } from 'near-api-js';

export interface IVaultItemValue {
  content: string,
  created: number,
  updated: number
}

export interface IGetAllResponse {
  [key: number]: IVaultItemValue
}

export interface IVaultContract extends NearContract {
  add_item: (args: unknown) => void;
  update_item: (args: unknown) => void;
  delete_item: (args: unknown) => void;
  get_item: (args: unknown) => Promise<IVaultItemValue>;
  get_all: () => Promise<IGetAllResponse>;
  get_hash: () => Promise<string>;
}

export interface IDeployerContract extends NearContract {
  get_vault: (args: unknown) => Promise<string>;
  delete_vault: () => Promise<void>;
  deploy_vault: (args: unknown) => Promise<void>;
}

export interface INearState {
  connection: Near,
  walletConnection: WalletConnection,
  accountId?: string,
  account?: Account,
  authorizedApps?: string[]
}