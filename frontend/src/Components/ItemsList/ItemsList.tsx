import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {ItemAction, useStore} from 'Store';
import {ListItemIcon, ListItemText, MenuItem, MenuList, Paper, useTheme} from '@mui/material';
import {Truncated} from 'Components/UI/Truncated';
import {useStyles} from './styles';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';


export const ItemsList: FC = observer(() => {
  const { itemsStore } = useStore();

  const theme = useTheme();
  const styles = useStyles(theme);

  const addItemHandler = useCallback(() => {
    itemsStore.setAction(ItemAction.Create);
  }, []);

  return <Paper sx={ styles.paper }>
    <MenuList>
      <Button
        fullWidth
        variant="outlined"
        onClick={addItemHandler}
        sx={ styles.button }>
        <AddIcon
          fontSize={'small'} 
          sx={ styles.addIcon }/>
            New Item
      </Button>
      {
        itemsStore.all.map((item, index) => {
          return (
            <MenuItem
              key={index}
              sx={ styles.menuItem }
              onClick={() => itemsStore.setCurrent(item.id, ItemAction.View)}
            >
              <ListItemIcon>
                <Box>
                  <LockIcon 
                    fontSize={'small'} 
                    sx={ styles.lockIcon }
                    />
                </Box>
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
