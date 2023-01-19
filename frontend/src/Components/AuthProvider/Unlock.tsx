import React, {FC, useCallback, useState} from 'react';
import Box from '@mui/material/Box';
import { Card, CardActions, CardContent, Typography, useTheme} from '@mui/material';
import {TextInput} from 'Components/UI/TextInput';
import {Button} from 'Components/UI/Button';
import {useStore} from 'Store';
import {App} from 'Services/AppService';

interface IProps {
  onSuccess: () => void;
}
export const Unlock: FC<IProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { userStore } = useStore();

  const submitHandler = useCallback(async () => {
    const { fastSignIn } = App.instance;
    const result = await fastSignIn(userStore.accountId!, password);

    if (result) {
      onSuccess();
    } else {
      setError('Invalid password')
    }
  }, [password, userStore]);

  return (
    <Card sx={{ p: theme.spacing(2) }}>
      <CardContent>
        <Typography variant={'body1'}>
          Please type your master password
        </Typography>
        <Box mt={2}>
          <TextInput
            fullWidth
            placeholder={'Your strong password'}
            error={!!error}
            value={password}
            onChange={setPassword}
            helperText={error}
          />
        </Box>
      </CardContent>
      <CardActions disableSpacing sx={{ p: theme.spacing(2) }}>
        <Button onClick={submitHandler}>
          Unlock
        </Button>
      </CardActions>
    </Card>
  );
};