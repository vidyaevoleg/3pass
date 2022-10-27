import {FC, ReactNode, useCallback } from 'react';
import {Register} from './Register';
import {observer} from 'mobx-react-lite';
import {useStore} from 'Store';
import {WalletLogin} from 'Components/Auth/WalletLogin';
import {Unlock} from 'Components/Auth/Unlock';

interface IProps {
  children: ReactNode,
}

export const Auth: FC<IProps> = observer(({ children }) => {
  const { userStore } = useStore();

  const onUnlockSuccess = () => {
    userStore.signInSuccess();
  };

  const onRegisterSuccess = () => {
    userStore.signInSuccess();
  };

  if (userStore.online) {
    return <> {children} </>;
  }

  if (userStore.accountId) {
    if (userStore.readyForFastSignIn) {
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