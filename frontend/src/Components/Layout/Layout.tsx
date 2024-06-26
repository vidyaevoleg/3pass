import React, { FC, ReactNode } from 'react';
import Container from '@mui/material/Container';
import {observer} from 'mobx-react-lite';
import {Header} from 'Components/Header';
import Box from '@mui/material/Box';

interface IProps {
  children: ReactNode,
}

export const Layout: FC<IProps> = observer(({ children}) => {
  return (
    <Container 
      component='main' 
      maxWidth='xl'
      sx={{
        '@media (min-width: 600px)': {
          padding: 0
        }
      }}>
      <Header/>
      <Box mt={1}>
        { children }
      </Box>
    </Container>
  );
});