import {FC, ReactNode, useEffect, useState} from 'react';
import {Skeleton} from '@mui/material';
import {initNear} from 'Api';
import {StoreProvider} from 'Store';
import { App } from 'Services/AppService';

export const StateLoader: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initNear().then(state => {
      App.init(state);
      // const xx = App;
      setLoading(false);
    })
  }, []);


  if (loading) {
    return <Skeleton
      sx={{ bgcolor: 'grey.900' }}
      variant='rectangular'
      width={'100%'}
      height={'100%'}
    />
  }

  return <StoreProvider value={App.instance.store}>
    { children }
  </StoreProvider>
};