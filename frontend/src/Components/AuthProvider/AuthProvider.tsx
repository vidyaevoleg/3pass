import React, {FC, ReactNode, useCallback, useEffect, useState} from 'react';
import {Register} from './Register';
import {observer} from 'mobx-react-lite';
import {useStore} from 'Store';
import {WalletLogin} from 'Components/AuthProvider/WalletLogin';
import {Unlock} from 'Components/AuthProvider/Unlock';
import {Skeleton} from 'Components/UI/Skeleton';
import {App} from 'Services/AppService';

interface IProps {
  children: ReactNode,
}

export const AuthProvider: FC<IProps> = observer(({ children }) => {
  const { userStore } = useStore();
  const { accountId, online } = userStore;
  const [loading, setLoading] = useState(false);

  const onUnlockSuccess = () => {
    userStore.signInSuccess();
  };

  const onRegisterSuccess = () => {
    userStore.signInSuccess();
  };

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
      return <Unlock onSuccess={onUnlockSuccess} />
      // } else if (store.user.hasContract) { // TODO if user has deployed contract
      //   return <Login/>
    } else {
      return <Register onSuccess={onRegisterSuccess}/>
    }
  } else {
    return <WalletLogin/>
  }
})