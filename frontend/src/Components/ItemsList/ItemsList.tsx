import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {ItemAction, useStore} from 'Store';
import {ListItemIcon, ListItemText, MenuItem, MenuList, Paper, useTheme} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Truncated} from 'Components/UI/Truncated';
import {useStyles} from './styles';


export const ItemsList: FC = observer(() => {
  const { itemsStore } = useStore();

  const theme = useTheme();
  const styles = useStyles(theme);

  const addItemHandler = useCallback(() => {
    itemsStore.setAction(ItemAction.Create);
  }, []);

  return <Paper sx={ styles.paper }>
    <MenuList>
      <MenuItem
        onClick={addItemHandler}
        sx={ styles.menuItem }
      >
        <ListItemIcon>
          <AddCircleIcon fontSize={'small'}/>
        </ListItemIcon>
        <ListItemText primary={'Add new'} />
      </MenuItem >
      {
        itemsStore.all.map((item, index) => {
          return (
            <MenuItem
              key={index}
              sx={ styles.menuItem }
              onClick={() => itemsStore.setCurrent(item.id, ItemAction.View)}
            >
              <ListItemIcon>
                <PersonIcon fontSize={'small'}/>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Truncated title={item.url} size={12}/>
                }
                secondary={
                  <Truncated title={item.username} size={15}/>
                }
              />
            </MenuItem>
          )
        })
      }
    </MenuList>
  </Paper>
});
