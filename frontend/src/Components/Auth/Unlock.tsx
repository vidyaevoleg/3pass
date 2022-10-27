import React, {FC, useCallback, useState} from 'react';
import Box from '@mui/material/Box';
import { Card, CardActions, CardContent, Typography, useTheme} from '@mui/material';
import {TextInput} from 'Components/UI/TextInput';
import {Button} from 'Components/UI/Button';
import {useStore} from 'Store';

interface IProps {
  onSuccess: () => void;
}
export const Unlock: FC<IProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { userStore } = useStore();

  const submitHandler = useCallback(async () => {
    const result = await userStore.fastSignIn(password);
    result ? onSuccess() : setError('Invalid password');
  }, [password, userStore]);

  return (
    <Card sx={{ p: theme.spacing(2) }}>
      <CardContent>
        <Typography variant={'body1'}>
          Please give us a sign that it's you
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
          Login
        </Button>
      </CardActions>
    </Card>
  );
};