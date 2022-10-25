import {FC, ReactNode, useCallback } from 'react';
import { FastLogin } from './FastLogin';
import {Register} from './Register';
import {observer} from 'mobx-react-lite';
import {useStore} from 'Store';
import {Card, List, ListItem, ListItemButton, ListItemText, Typography, useTheme} from '@mui/material';

interface IProps {
  children: ReactNode,
}

export const Auth: FC<IProps> = observer(({ children }) => {
  const { userStore } = useStore();
  const theme = useTheme();
  // const { keysService } = App.instance;

  const onSignSuccess = () => {
    userStore.signInSuccess();
  };

  const onRegisterSuccess = () => {
    userStore.signInSuccess();
  };

  const loginHandler = useCallback(() => {
    userStore.contractSignIn();
  }, []);

  if (userStore.online) {
    return <> {children} </>;
  }

  if (userStore.accountId) {
    if (userStore.readyForFastSignIn) {
      return <FastLogin onSuccess={onSignSuccess} />
    // } else if (store.user.hasContract) { // TODO if user has deployed contract
    //   return <Login/>
    } else {
      return <Register onSuccess={onRegisterSuccess}/>
    }
  } else {
    return <Card sx={{ p: theme.spacing(3)}}>
      <Typography variant={'body2'}>
        Choose wallet to login
      </Typography>
      <List>
        <ListItem disablePadding sx={{bgcolor: theme.palette.grey.A200}}>
          <ListItemButton onClick={loginHandler}>
            <ListItemText primary="Near wallet" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{bgcolor: theme.palette.grey.A200}}>
          <ListItemButton onClick={loginHandler}>
            <ListItemText primary="Metamask" />
          </ListItemButton>
        </ListItem>
      </List>
    </Card>
  }
})

