import { types } from 'mobx-state-tree'
import {App} from 'Services/AppService';
import {HashPurpose} from 'Crypto';

export const UserStore = types.model({
  accountId: types.maybeNull(types.string),
  vaultAccountId: types.maybeNull(types.string),
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
      keysService.setCryptoKey(undefined);
      self.online = false;
    };

    const fastSignIn = async (password: string): Promise<boolean> => {
      const { cryptoService, keysService, accountId } = App.instance;
      const storedKeyHash = keysService.keyHash;
      const cryptoKey = await cryptoService.makeKey(password, accountId!);
      const keyHashToCheck = await cryptoService.hashPassword(password, cryptoKey, HashPurpose.LocalAuthorization);
      const result = storedKeyHash === keyHashToCheck;
      if (result) keysService.setCryptoKey(cryptoKey);
      return result;
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
      fastSignIn,
      signInSuccess,
      contractSignIn,
      setVaultContractId,
    }
  })
  .views((self) => ({
  get IsReadyForFastSignIn () {
    return !!self.keyHash;
  },
  get IsReadyForRegister () {
    return !!self.vaultAccountId;
  }
}));