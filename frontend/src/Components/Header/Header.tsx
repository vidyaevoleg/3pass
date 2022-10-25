import React, {FC} from 'react';
import {useStore} from 'Store';
import {AppBar, Typography, Toolbar} from '@mui/material';
import {Profile} from 'Components/Profile';

export const Header: FC = () => {
  const { userStore } = useStore();

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          3PASS
        </Typography>
        <div>
          { userStore.readyForFastSignIn && <Profile/> }
        </div>
      </Toolbar>
    </AppBar>
  )
}