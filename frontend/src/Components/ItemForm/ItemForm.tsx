import React, {FC, useCallback, useMemo, useState} from 'react';
import {FormikForm} from 'Components/Formik/FormikForm';
import {FormikTextInput} from 'Components/Formik/FormikTextInput';
import {FormikSubmit} from 'Components/Formik/FormikSubmit';
import {Instance} from 'mobx-state-tree';
import {Item, ItemType, useStore} from 'Store';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import { colors } from 'theme';
import {useStyles} from './styles';
import {Typography, useTheme} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { Button as MuiButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button } from 'Components/UI/Button';

interface IProps {
  item?: Instance<typeof Item>
}

const initialValues = {
  url: '',
  username: '',
  password: '',
  type: ItemType.Login,
};

const initFormValues = (item: Instance<typeof Item>): Record<string, unknown>=> {
  return Object.keys(initialValues).reduce((values, key) => {
    values[key] = item[key as keyof Instance<typeof Item>];
    return values;
  }, {...initialValues} as Record<string, unknown>);
};

export const ItemForm: FC<IProps> = ({ item }) => {
  const { itemsStore } = useStore();
  const theme = useTheme();
  const styles = useStyles(theme);

  const formValues = useMemo(() => (
    item ? initFormValues(item) : initialValues
  ), [item]);

  const saveHandler = useCallback(async (itemToSave: Record<string, unknown>) => {
    if (item) {
      await itemsStore.update(item.id, itemToSave);
    } else {
      await itemsStore.add(itemToSave);
    }
  }, [itemsStore]);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const onCancelHandler = () => {
    // TODO: Make Logic of cancel button
  };

  return (
    <FormikForm onSubmit={saveHandler} initialValues={formValues}>
      <Box sx={ styles.boxWebsite }>
        <LockIcon sx={ styles.lockIcon }></LockIcon>
        <FormikTextInput label={'Website'} name={'url'} fullWidth sx={ styles.frameLock }/>
      </Box>

      <Typography sx={ styles.typography }>Username</Typography>
      <FormikTextInput label={'Username at website'} name={'username'} fullWidth sx={ styles.frame }/>

      <Typography sx={ styles.typography }>Password</Typography>
      <Box sx={ styles.boxPassword }>
        <FormikTextInput label={'Enter or generate a password'} name={'password'} fullWidth sx={ styles.framePassword }
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  sx={ styles.eyeIcon }
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <MuiButton
          sx={ styles.keyIconButton }>
          <KeyIcon sx={ styles.keyIcon }></KeyIcon>
        </MuiButton>
      </Box>
      <Button
        onClick={onCancelHandler} // TODO: Make Logic of cancel button
        sx={ styles.cancelButton }>
        Cancel
      </Button>
      <FormikSubmit sx={ styles.saveButton }>
        Save
      </FormikSubmit>
    </FormikForm>
  )
}