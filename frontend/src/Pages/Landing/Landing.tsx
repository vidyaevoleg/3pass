import React, {FC} from 'react';
import Container from '@mui/material/Container';
import {AppBar, Toolbar, Typography} from '@mui/material';
import {Button} from 'Components/UI/Button';
import {Link} from 'Components/UI/Link';
import Box from '@mui/material/Box';

export const Landing: FC = () => {
  return <Container>
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          <Link to={'/'}>
            3PASS
          </Link>
        </Typography>
        <div>
          <Link to={'/application'}>
            <Button>
              Go to the app
            </Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
    <Box>
      <Typography>
        Landing
      </Typography>
    </Box>
  </Container>
}