import React, {FC} from 'react';
import {useStore} from 'Store';
import {AppBar, Toolbar, useTheme, InputAdornment} from '@mui/material';
import {Profile} from 'Components/Profile';
import {observer} from 'mobx-react-lite';
import {useStyles} from './styles';
import Box from '@mui/material/Box';
import {TextInput} from 'Components/UI/TextInput';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import logo3Pass from './logo3pass.svg';

export const Header: FC = observer(() => {
  const { userStore } = useStore();
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <AppBar position='static' sx={ styles.appHeaderBar }>
      <Toolbar sx={ styles.toolbar }>
        <Grid container spacing={0} sx = { styles.gridContainer }>
          <Grid item xs={2}>
            <Box sx={ styles.boxLogo }>
              <img src={ logo3Pass } alt='logo 3Pass'/>
            </Box>
          </Grid>
          <Grid item xs={8}>
            { userStore.online && 
              <Box justifyContent='left'>
                <TextInput
                  fullWidth
                  placeholder={'Login, card, wallet'}
                  sx={ styles.boxSearch }
                  InputProps={{
                    startAdornment: 
                    <InputAdornment position='start'>
                      <SearchIcon></SearchIcon>
                    </InputAdornment>
                  }}
                />
              </Box>
            }
          </Grid>
          <Grid item xs={2}>
            { userStore.isReadyForFastSignIn &&
              <Box 
                display='flex'
                justifyContent='center'
                alignItems='center'
                sx = { styles.boxNear }>
                <Box sx={ styles.boxProfile }>
                  <Profile/>
                </Box>
              </Box>
            }
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
});