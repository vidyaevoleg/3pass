import {Account, ConnectConfig, keyStores} from 'near-api-js';
import {connect, Contract as NearContract, WalletConnection } from 'near-api-js';
import {IDeployerContract, INearState, IVaultContract} from './types';

export const DEPLOYER_CONTRACT_ID = process.env.REACT_APP_DEPLOYER_CONTRACT_ID;

export const NETWORK_CONFIG = getConfig(process.env.REACT_APP_NODE_ENV || 'development');
export const VAULT_CHANGE_METHODS = ['add_item', 'update_item', 'delete_item'];
export const VAULT_VIEW_METHODS = ['get_all', 'get_item', 'get_hash'];
export const DEPLOYER_CHANGE_METHODS = ['deploy_vault', 'delete_vault'];
export const DEPLOYER_VIEW_METHODS = ['get_vault'];

export const CONNECTION_CONFIG: ConnectConfig = Object.assign(
  { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, headers: {} },
  NETWORK_CONFIG
);

export const VAULT_CONTRACT_CONFIG = {
  viewMethods: VAULT_VIEW_METHODS,
  changeMethods: VAULT_CHANGE_METHODS,
};

export const DEPLOYER_CONTRACT_CONFIG = {
  viewMethods: DEPLOYER_VIEW_METHODS,
  changeMethods: DEPLOYER_CHANGE_METHODS,
};


export const initNear = (): Promise<INearState> => {
  return new Promise(resolve => {
    connect(CONNECTION_CONFIG).then(connection => {
      const walletConnection = new WalletConnection(connection, null);
      const accountId = walletConnection.getAccountId();

      if (accountId) {
        connection.account(accountId).then(account => {
          account.getAccountDetails().then(info => {
            const authorizedApps = info.authorizedApps.map(app => app.contractId);
            const state: INearState = {
              account,
              accountId,
              connection,
              authorizedApps,
              walletConnection
            }
            resolve(state);
          })
        })
      } else {
        const state: INearState = {
          accountId,
          connection,
          walletConnection,
          account: undefined,
        }
        resolve(state);
      }
    })
  });
}

export function getConfig(env: string) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org',
      };
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
      };
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near',
      };
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        masterAccount: 'test.near',
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
  }
}