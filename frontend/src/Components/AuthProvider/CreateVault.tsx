import React, {FC, useState} from 'react';
import {Card, CardActions, CardContent, Typography, useTheme} from '@mui/material';
import {useStore} from 'Store';
import {App} from 'Services/AppService';
import Box from '@mui/material/Box';
import {FormikForm} from 'Components/Formik/FormikForm';
import {FormikTextInput} from 'Components/Formik/FormikTextInput';
import {FormikSubmit} from 'Components/Formik/FormikSubmit';
import {observer} from 'mobx-react-lite';

export const CreateVault: FC = observer(() => {
  const theme = useTheme();
  const { userStore } = useStore();

  const submitHandler = (values: any): Promise<void> => {
    return App.instance.contractService.deployVault(values.vaultName).then(() => {
      App.instance.contractService.getVault(userStore.accountId!).then(vaultContractId => {
        userStore.setVaultContractId(vaultContractId);
      })
    }).catch(console.error);
  };

  return (
    <Box mt={2}>
      <Card sx={{ p: theme.spacing(2) }}>
        <FormikForm
          initialValues={{ vaultName: userStore.accountId!.replace('.', '_') }}
          onSubmit={submitHandler}
        >
          <CardContent>
            <Typography variant={'body1'}>
              Please specify contract name you'd like to use for storing your data. By default we'll use your accountId.
            </Typography>
            <Box mt={2}>
              <FormikTextInput name={'vaultName'}/>
            </Box>
          </CardContent>
          <CardActions disableSpacing sx={{ p: theme.spacing(2) }}>
            <FormikSubmit>
              Deploy my vault
            </FormikSubmit>
          </CardActions>
        </FormikForm>
      </Card>
    </Box>
  )
});

