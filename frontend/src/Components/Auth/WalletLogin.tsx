import {Card, List, ListItem, ListItemButton, ListItemText, Typography, useTheme} from '@mui/material';
import {useCallback} from 'react';
import {useStore} from 'Store';

export const WalletLogin = () => {
  const theme = useTheme();
  const { userStore } = useStore();

  const loginHandler = useCallback(() => {
    userStore.contractSignIn();
  }, []);

  return (
    <Card sx={{ p: theme.spacing(3)}}>
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
  )
}