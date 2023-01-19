import {FC, useCallback, useMemo} from 'react';
import {FormikForm} from 'Components/Formik/FormikForm';
import {FormikTextInput} from 'Components/Formik/FormikTextInput';
import {FormikSubmit} from 'Components/Formik/FormikSubmit';
import {Instance} from 'mobx-state-tree';
import {Item, ItemType, useStore} from 'Store';

interface IProps {
  item?: Instance<typeof Item>
}

const initialValues = {
  url: '',
  username: '',
  password: '',
  type: ItemType.Login
};

const initFormValues = (item: Instance<typeof Item>): Record<string, unknown>=> {
  return Object.keys(initialValues).reduce((values, key) => {
    values[key] = (item as any)[key];
    return values;
  }, {...initialValues} as Record<string, unknown>);
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

  return (
    <FormikForm onSubmit={saveHandler} initialValues={formValues}>
      <FormikTextInput label={'URL'} name={'url'}/>
      <FormikTextInput label={'Email (or username)'} name={'username'}/>
      <FormikTextInput label={'Password'} name={'password'}/>
      <FormikSubmit>
        Save
      </FormikSubmit>
    </FormikForm>
  )
}