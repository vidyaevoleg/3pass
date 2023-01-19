import { FC } from 'react';
import {useStore} from 'Store';
import {MasterPassword} from './MasterPassword';
import {CreateVault} from './CreateVault';
import {observer} from 'mobx-react-lite';

interface IProps {
  onSuccess: () => void;
}

export const Register: FC<IProps> = observer(({ onSuccess }) => {
  const { userStore } = useStore();

  if (userStore.IsReadyForRegister)
    return <MasterPassword />

  return (
    <CreateVault />
  )
});

