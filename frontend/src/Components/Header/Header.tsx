import React, {FC} from 'react';
import {useStore} from 'Store';
import {AppBar, Typography, Toolbar, useTheme} from '@mui/material';
import {Profile} from 'Components/Profile';
import {observer} from 'mobx-react-lite';
import {useStyles} from './styles';

export const Header: FC = observer(() => {
  const { userStore } = useStore();
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <AppBar position='static'>
      <Toolbar sx={styles.root}>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          3PASS
        </Typography>
        <div>
          { userStore.online && <Profile/> }
        </div>
      </Toolbar>
    </AppBar>
  )
});