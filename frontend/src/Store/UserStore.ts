import { types } from 'mobx-state-tree'
import {App} from 'Services/AppService';

export const UserStore = types.model({
  accountId: types.maybeNull(types.string),
  vaultAccountId: types.maybeNull(types.string),
  authorizedApps: types.maybeNull(types.array(types.string)),
  online: types.maybeNull(types.boolean),
  keyHash: types.maybeNull(types.string)
})
  .actions(self => {
    const signOut = async () => {
      const { contractService, keysService } = App.instance;
      await contractService.signOut();
      keysService.clear();
      window.location.replace(window.location.origin + window.location.pathname);
    };

    const contractSignIn = async () => {
      const { contractService } = App.instance;
      await contractService.signIn();
    };

    const lock = () => {
      const { keysService } = App.instance;
      keysService.resetKeys();
      self.online = false;
    };

    const signInSuccess = () => {
      self.online = true;
    };

    const setVaultContractId = (vaultContractId: string) => {
      const app = App.instance;
      self.vaultAccountId = vaultContractId;
      app.contractService.setVaultContract(vaultContractId);
    };

    return {
      lock,
      signOut,
      signInSuccess,
      contractSignIn,
      setVaultContractId,
    }
  })
  .views((self) => ({
  get isReadyForFastSignIn (): boolean {
    return !!self.keyHash;
  },
  get isAuthorizedForLogin(): boolean {
    // here we check that user has authorized the vault contract
    return Boolean(!!self.vaultAccountId && self.authorizedApps?.includes(self.vaultAccountId));
  },
  get hasDeployedVault(): boolean {
    return !!self.vaultAccountId;
  }
}));