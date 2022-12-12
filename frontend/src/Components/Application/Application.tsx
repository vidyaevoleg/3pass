import React, {FC, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {observer} from 'mobx-react-lite';
import {ItemAction, useStore} from 'Store';
import {ItemsList} from 'Components/ItemsList';
import {ItemForm} from 'Components/ItemForm/ItemForm';
import {ItemViewer} from 'Components/ItemViewer';
import {Paper, useTheme} from '@mui/material';
import { HeaderBottomBar } from 'Components/Header/HeaderBottomBar';
import {useStyles} from './styles';


export const Application: FC = observer(() => {
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

  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <>
      <HeaderBottomBar />
      <Grid container spacing={0} sx={ styles.gridContainer }>
        <Grid item xs={2} sx={ styles.gridItemsList }>
          <Box>
            <ItemsList/>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Paper sx={ styles.paper }>
            <Box sx={ styles.box }>
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
    </>
  )
});

