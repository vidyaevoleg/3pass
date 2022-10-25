import React, {FC} from 'react';
import {Card, CardActions, CardContent, Typography, useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import {TextInput} from 'Components/UI/TextInput';
import {Button} from 'Components/UI/Button';


export const Login: FC = () => {
  const theme = useTheme();

  return (
    <Card sx={{ p: theme.spacing(2) }}>
      <CardContent>
        <Typography variant={'body1'}>
          Please provide your password
        </Typography>
        <Box mt={2}>
          <TextInput
            fullWidth
            placeholder={'Password'}
          />
        </Box>
      </CardContent>
      <CardActions disableSpacing sx={{ p: theme.spacing(2) }}>
        <Button>
          Login
        </Button>
      </CardActions>
    </Card>
  )
}