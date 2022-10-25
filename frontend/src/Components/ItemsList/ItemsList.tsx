import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {ItemAction, useStore} from 'Store';
import {ListItemIcon, ListItemText, MenuItem, MenuList, Paper} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Truncated} from 'Components/UI/Truncated';

export const ItemsList: FC = observer(() => {
  const { itemsStore } = useStore();

  const addItemHandler = useCallback(() => {
    itemsStore.setAction(ItemAction.Create);
  }, []);

  return <Paper>
    <MenuList>
      <MenuItem
        onClick={addItemHandler}
      >
        <ListItemIcon>
          <AddCircleIcon fontSize={'small'}/>
        </ListItemIcon>
        <ListItemText primary={'Add new'} />
      </MenuItem>
      {
        itemsStore.all.map((item, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => itemsStore.setCurrent(item.id, ItemAction.View)}
            >
              <ListItemIcon>
                <PersonIcon fontSize={'small'}/>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Truncated title={item.url} size={12}/>
                }
                secondary={item.username}
              />
            </MenuItem>
          )
        })
      }
    </MenuList>
  </Paper>
});
