import {flow, Instance, types} from 'mobx-state-tree';
import { Item } from './Item';
import {IGetAllResponse } from 'Api';
import {App} from 'Services/AppService';

export enum ItemAction {
  Create = 'create',
  Update = 'update',
  View = 'view'
}

const responseToModel = async (itemsMap: IGetAllResponse): Promise<Instance<typeof Item>[]> => {
  return await Promise.all(Object.keys(itemsMap).map(async (id) => {
    const key = parseInt(id);
    const {content} = itemsMap[key];
    const item = await App.instance.decrypt<Omit<Instance<typeof Item>, 'id'>>(content);
    return Item.create({id: key, ...item});
  }))
}

export const ItemsListStore = types.model({
  list: types.map(types.late( () => Item)),
  loading: types.optional(types.boolean, false),
  loaded: types.optional(types.boolean, false),
  current: types.maybeNull(types.reference(Item)),
  action: types.maybeNull(types.enumeration([ItemAction.Create, ItemAction.Update, ItemAction.View]))
}).actions(self => {
  // TODO Think how to improve
  const generateId = () => {
    const items = Array.from(self.list.values()).sort(a => a.id)
    const lastItem = items[items.length - 1];
    return lastItem ? (lastItem.id + 1) : 1;
  }

  const load = flow(function* (){
    const {contractService} = App.instance;
    self.loading = true;
    const items: Instance<typeof Item>[] = yield contractService.getAll().then(responseToModel);
    const itemsMap = items.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {} as {[key: string]: Instance<typeof Item>});
    self.list.merge(itemsMap);
    self.loaded = true;
  });

  const add = flow(function* (item: Partial<Instance<typeof Item>>) {
    const {contractService} = App.instance;
    const id = generateId();
    const encrypted = yield App.instance.encrypt(item);
    yield contractService.addItem(generateId(), encrypted);
    self.list.put({ id, ...item} as Instance<typeof Item>)
  });

  const remove = flow(function*(id: number) {
    const {contractService} = App.instance;
    yield contractService.deleteItem(id);
    self.action = null;
    self.current = null;
    self.list.delete(id.toString());
  });

  const update = flow(function* (id: number, item: Partial<Instance<typeof Item>>) {
    const {contractService} = App.instance;
    const encrypted = yield App.instance.encrypt(item);
    yield contractService.updateItem(id, encrypted);
    self.list.get(id.toString())!.update(item);
  });

  const setAction = (action: ItemAction): void => {
    self.action = action;
  };

  const setCurrent = (id?: number, action?: ItemAction): void => {
    if (id) {
      self.current = self.list.get(id.toString())!;
    } else {
      throw('Invalid item ID');
    }
    if (action) self.action = action;
  };
  return {
    add,
    load,
    update,
    remove,
    setAction,
    setCurrent,
  }
}).views(self => ({
    get all(): Instance<typeof Item>[] {
      return Array.from(self.list.values());
    }
  }));