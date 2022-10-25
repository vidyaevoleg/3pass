import Box from '@mui/material/Box';
import { Button } from 'Components/UI/Button';
import React, { FC, useState } from 'react';
import {CryptoService, HashPurpose} from 'Crypto';
import {Card, CardActions, CardContent, Typography, useTheme} from '@mui/material';
import {useStore} from 'Store';
import {TextInput} from 'Components/UI/TextInput';
import {App} from 'Services/AppService';

interface IProps {
  onSuccess: () => void;
}

export const Register: FC<IProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const { userStore } = useStore();

  const submitHandler = async (): Promise<void> => {
    const { cryptoService } = App.instance;
    const cryptoKey = await cryptoService.makeKey(password, userStore.accountId!);
    const [_, { encryptedString: encryptedCryptoKey }] = await cryptoService.makeEncKey(cryptoKey);
    const keyHash = await cryptoService.hashPassword(password, cryptoKey,HashPurpose.LocalAuthorization);

    App.instance.afterSignUp(cryptoKey, keyHash, encryptedCryptoKey!)
    onSuccess();
  };

  return <Box mt={2}>
    <Card sx={{ p: theme.spacing(2) }}>
      <CardContent>
        <Typography variant={'body1'}>
          Please create you password for security reasons
        </Typography>
        <Box mt={2}>
          <TextInput
            fullWidth
            placeholder={'Very strong password'}
            value={password}
            onChange={setPassword}
          />
        </Box>
      </CardContent>
      <CardActions disableSpacing sx={{ p: theme.spacing(2) }}>
        <Button onClick={submitHandler}>
          Sign up
        </Button>
      </CardActions>
    </Card>
  </Box>
}