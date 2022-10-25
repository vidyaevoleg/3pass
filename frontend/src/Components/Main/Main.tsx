import React, {FC, useCallback, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {IVaultItem} from 'Api';
import Grid from '@mui/material/Grid';
import {observer} from 'mobx-react-lite';
import {ItemAction, RootStoreInstance, useStore} from 'Store';
import {ItemsList} from 'Components/ItemsList';
import {ItemForm} from 'Components/ItemForm/ItemForm';
import {ItemViewer} from 'Components/ItemViewer';
import {Paper} from '@mui/material';

export const Main: FC = observer(() => {
  const { itemsStore } = useStore();

  useEffect(() => {
    if (!itemsStore.loaded) {
      itemsStore.load();
    }
  }, []);

  useEffect(() => {
    if (!itemsStore.loaded) {
      itemsStore.load();
    }
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <ItemsList/>
      </Grid>
      <Grid item xs={8}>
        <Paper>
          <Box sx={{ p: 2 }}>
            {
              (itemsStore.action == ItemAction.Create && (
                <ItemForm />
              ))
            }
            {
              (itemsStore.action == ItemAction.Update && (
                <ItemForm item={ itemsStore.current! }/>
              ))
            }
            {
              itemsStore.action == ItemAction.View && (
                <ItemViewer item={ itemsStore.current! }/>
              )
            }
            {
              !itemsStore.action && (
                <Alert severity={'info'}>
                  No item selected
                </Alert>
              )
            }
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
});

