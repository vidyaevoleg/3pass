import {FC, ReactNode, useState, createContext, useContext, useEffect} from 'react';
import {initNear} from 'Api';
import {App, IApp} from 'Services/AppService';
import {Skeleton} from '@mui/material';
import {StoreProvider} from 'Store';

interface AppContextType {
  initialize: () => Promise<void>;
  instance?: IApp
}

let AppContext = createContext<AppContextType>(null!);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [instance, setInstance] = useState<IApp | undefined>(undefined);

  let value = {
    instance,
    initialize: async () => {
      setLoading(true);
      const instance = await initNear()
        .then(async state => {
          const app = App.init(state);
          return app;
        });
      setLoading(false);
      setInstance(instance);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

export const WithApp: FC<{ children: ReactNode }> = ({children}) => {
  const { instance, initialize } = useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!instance) {
      setLoading(true);
      initialize().finally(() => setLoading(false));
    }
  }, [])

  if (loading) {
    return <Skeleton
      sx={{ bgcolor: 'grey.900' }}
      variant='rectangular'
      width={'100%'}
      height={'100%'}
    />
  }

  if (instance) {
    return (
      <StoreProvider value={instance.store}>
        {
          children
        }
      </StoreProvider>
    )
  }

  return <></>;
}