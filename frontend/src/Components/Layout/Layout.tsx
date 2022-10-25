import React, { FC, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Account } from 'near-api-js';
import Fab from '@mui/material/Fab';
import {StateLoader} from 'Components/StateLoader';
import {observer} from 'mobx-react-lite';
import {Header} from 'Components/Header';
import Box from '@mui/material/Box';

const theme = createTheme();

interface IProps {
  // contract: Contract,
  children: ReactNode,
}

export const Layout: FC<IProps> = observer(({ children}) => {
  return (
    <StateLoader>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <Header/>
          <Box mt={1}>
            { children }
          </Box>
        </Container>
      </ThemeProvider>
    </StateLoader>
  );
});