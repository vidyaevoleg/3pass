import React, {FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'Store';
import {WalletLogin} from './WalletLogin';
import {Unlock} from './Unlock';
import {Skeleton} from 'Components/UI/Skeleton';
import {App} from 'Services/AppService';
import {MasterPassword} from './MasterPassword';
import { Login } from './Login';
import {AuthorizeVault} from 'Components/AuthProvider/AuthorizeVault';

interface IProps {
  children: ReactNode,
}

export const AuthProvider: FC<IProps> = observer(({ children }) => {
  const { userStore } = useStore();
  const { accountId, online } = userStore;
  const [loading, setLoading] = useState(false);

  const onLoginSuccess = useCallback(() => {
    userStore.signInSuccess();
  }, [userStore]);

  useEffect(() => {
    if (accountId) {
      setLoading(true)
      App.instance.contractService.getVault(accountId).then((vaultContractId?: string) => {
        if (vaultContractId) {
          userStore.setVaultContractId(vaultContractId)
        }
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [])

  if (loading)
    return <Skeleton />

  if (online)
    return <> {children} </>;

  if (accountId) {
    if (userStore.IsReadyForFastSignIn) {
      return <Unlock onSuccess={onLoginSuccess}/>
    } else if (!userStore.hasDeployedVault) {
      return <MasterPassword />
    } else if (!userStore.isAuthorizedForLogin) {
      return <AuthorizeVault />
    } else if (userStore.hasDeployedVault) {
      return <Login onSuccess={onLoginSuccess}/>
    } else {
      return <></>
    }
  } else {
    return <WalletLogin/>
  }
})