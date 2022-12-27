import React, {FC, useCallback} from 'react';
import {Divider, IconButton, Menu, MenuItem, Box, Typography} from '@mui/material';
import {useStore} from 'Store';
import Tooltip from '@mui/material/Tooltip';
import {Link} from 'Components/UI/Link';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import nearWalletLogo from 'Components/Header/nearWalletLogo.svg';
import {Truncated} from 'Components/UI/Truncated';

export const Profile: FC = () => {
  const { userStore } = useStore();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const closeHandler = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const exitHandler = useCallback(() => {
    setAnchorEl(null);
    userStore.signOut();
  }, [userStore])

  const lockHandler = useCallback(() => {
    setAnchorEl(null);
    userStore.lock();
  }, [userStore])

  return (
    <>
      <Box 
      display='flex'
      alignItems='center'>
        <Box>
          <img src={ nearWalletLogo } alt='near Wallet Logo'/>
        </Box>
        <Box sx={{ pl: '8px', width: '77px' }}>
          <Typography>
            <Truncated title={userStore.accountId!} size={12}/>
          </Typography>
        </Box>
        <Tooltip title={userStore.accountId!}>
          <IconButton
            onClick={e => setAnchorEl(e.currentTarget)}
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            color='inherit'>
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
        <Menu
          keepMounted
          id='menu-appbar'
          anchorEl={anchorEl}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          open={Boolean(anchorEl)}
          onClose={closeHandler}
        >
          <MenuItem>
            <Link to={'/settings'}>
              Settings
            </Link>
          </MenuItem>
          <Divider/>
          <MenuItem onClick={lockHandler}>Lock</MenuItem>
          <Divider/>
          <MenuItem onClick={exitHandler}>Exit</MenuItem>
        </Menu>
      </Box>
    </>
  )
}