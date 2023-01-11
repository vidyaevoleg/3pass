import {FC, useCallback, useMemo} from 'react';
import {FormikForm} from 'Components/Formik/FormikForm';
import {FormikTextInput} from 'Components/Formik/FormikTextInput';
import {FormikSubmit} from 'Components/Formik/FormikSubmit';
import {Instance} from 'mobx-state-tree';
import {Item, ItemType, useStore} from 'Store';
import {Typography} from '@mui/material';
import { colors } from 'theme';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';

interface IProps {
  item?: Instance<typeof Item>
}

const initialValues = {
  Website: '',
  username: '',
  password: '',
  type: ItemType.Login
};

const initFormValues = (item: Instance<typeof Item>): any=> {
  const values = {...initialValues};
  Object.keys(initialValues).forEach((key: string) => {
    // TODO FIX ME
    // @ts-ignore
    values[key] = item[key];
  });
  return values;
};

export const ItemForm: FC<IProps> = ({ item }) => {
  const { itemsStore } = useStore();

  const formValues = useMemo(() => (
    item ? initFormValues(item) : initialValues
  ), [item]);

  const saveHandler = useCallback(async (itemToSave: Partial<Instance<typeof Item>>) => {
    if (item) {
      await itemsStore.update(item.id, itemToSave);
    } else {
      await itemsStore.add(itemToSave);
    }
  }, [itemsStore]);

  console.log(formValues);

  return (
    <FormikForm onSubmit={saveHandler} initialValues={formValues}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <LockIcon sx={{ pt: '14px', color: `${colors.blue6}` }}></LockIcon>
        <FormikTextInput placeholder={'Website'} name={'website'} sx={{ width: '568px', pl: '12px' }}/>
      </Box>
      
      
      <Typography sx={{ color: `${colors.gray4}`, fontSize: '14px', }}>Username</Typography>
      <FormikTextInput placeholder={'Username'} name={'username'} sx={{ width: '600px' }}/>
      <Typography sx={{ color: `${colors.gray4}`, fontSize: '14px', }}>Password</Typography>
      <FormikTextInput placeholder={'Password'} name={'password'} sx={{ width: '600px' }}/>
      <FormikSubmit>
        Save
      </FormikSubmit>
    </FormikForm>
  )
}