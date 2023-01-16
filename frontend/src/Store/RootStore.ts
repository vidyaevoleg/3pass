import {castToSnapshot, Instance, onSnapshot, types} from 'mobx-state-tree';
import {UserStore} from './UserStore';
import {ItemsListStore} from './ItemsListStore';
import { INearState } from 'Api';
import {createContext, useContext} from 'react';
import {IApp} from 'Services/AppService';

export const RootStore = types.model({
  userStore: UserStore,
  itemsStore: ItemsListStore
}).actions(self => {
  return {}
})

export const createStore = (state: INearState, app: IApp) => {
  const { accountId = undefined } = state;
  const { keysService } = app;

  const user = UserStore.create({
    accountId,
    keyHash: keysService.keyHash,
    authorizedApps: state.authorizedApps,
  });
  const items = ItemsListStore.create();

  let store: Instance<typeof RootStore> = RootStore.create({
    userStore: castToSnapshot(user) ,
    itemsStore: castToSnapshot(items),
  });

  onSnapshot(store, (snapshot) => {
    console.log("Snapshot: ", snapshot);
    localStorage.setItem("rootState", JSON.stringify(snapshot));
  });

  return store;
}


export type RootStoreInstance = Instance<typeof RootStore>;
const RootStoreContext = createContext<null | RootStoreInstance>(null);

export const StoreProvider = RootStoreContext.Provider;

export const useStore = (): RootStoreInstance => {
  const store = useContext(RootStoreContext);

  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}

