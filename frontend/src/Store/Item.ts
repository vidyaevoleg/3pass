import {Instance, types} from 'mobx-state-tree';

export const Item = types.model({
  id: types.identifierNumber,
  url: types.string,
  username: types.string,
  password: types.string,
  type: types.number
}).actions(self => {
  const update = (values: Partial<Instance<typeof self>>) => {
    self.url = values.url!;
    self.username = values.username!;
    self.password = values.password!;
  };

  return {
    update
  }
}).views(self => ({

}));