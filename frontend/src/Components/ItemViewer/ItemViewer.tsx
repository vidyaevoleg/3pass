import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import Grid from '@mui/material/Grid';
import { Button } from 'Components/UI/Button';
import {Typography} from '@mui/material';
import {ItemAction, Item, useStore} from 'Store';
import {TextInput} from 'Components/UI/TextInput';
import {Instance} from 'mobx-state-tree';

interface IViewerProps {
  item: Instance<typeof Item>,
}

export const ItemViewer: FC<IViewerProps> = observer(({ item }) => {
  const { itemsStore } = useStore();
  const [loading, setLoading] = useState(false);

  const onEditHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    itemsStore.setAction(ItemAction.Update);
  };

  const onDeleteHandler = () => {
    setLoading(true);
    itemsStore.remove(item.id!);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Typography variant={'h4'}>
          { item.url }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextInput
          disabled
          value={item.username}
          label="Username (or email)"
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          disabled
          // type={'password'}
          value={item.password}
          label="Password"
        />
      </Grid>
      <Grid item xs={3}>
        <Button color={'secondary'} onClick={onEditHandler}>
          Edit
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button loading={loading} color={'error'} onClick={onDeleteHandler}>
          Delete
        </Button>
      </Grid>
    </Grid>
  )
});