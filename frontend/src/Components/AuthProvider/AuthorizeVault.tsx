import React, {FC, useState} from 'react';
import {Card, CardActions, CardContent, Typography, useTheme} from '@mui/material';
import {useStore} from 'Store';
import {App} from 'Services/AppService';
import {HashPurpose} from 'Crypto';
import Box from '@mui/material/Box';
import {TextInput} from 'Components/UI/TextInput';
import {Button} from 'Components/UI/Button';
import Tooltip from '@mui/material/Tooltip';

export const AuthorizeVault: FC = () => {
  const [loading, setLoading] = useState(false);
  const { userStore } = useStore();
  const theme = useTheme();

  const submitHandler = async (): Promise<void> => {
    setLoading(true);
    const { authorizeVault } = App.instance;
    await authorizeVault();
  };

  return <Box mt={2}>
    <Card sx={{ p: theme.spacing(2) }}>
      <CardContent>
        <Typography variant={'body1'}>
          We've just deployed your vault contract.
        </Typography>
        <Typography variant={'body1'}>
          Now you need to authorize it
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ p: theme.spacing(2) }}>
        <Button loading={loading} onClick={submitHandler}>
          Authorize
        </Button>
      </CardActions>
    </Card>
  </Box>
}