export const kk = '';
// import { types } from 'mobx-state-tree';
// import {CryptoService, EncString, SymmetricCryptoKey} from 'Crypto';
//
// export const Keys = types.model({
//   keyHash: types.maybe(types.string),
//   encryptedCryptoKey: types.maybe(types.string),
//   decryptedCryptoKey: types.maybe(types.string),
//   cryptoKey: types.frozen<SymmetricCryptoKey>(),
//   cryptoService: types.frozen<CryptoService>()
// }).actions(self => {
//   const afterCreate = () => {
//     if (localStorage.getItem('keyHash')) {
//       self.keyHash = localStorage.getItem('keyHash')!;
//     }
//     self.cryptoService = new CryptoService()
//   };
//
//   const setCryptoKey = (cryptoKeyValue: SymmetricCryptoKey) => {
//     self.cryptoKey = cryptoKeyValue;
//   };
//
//   const getCryptoKey = (): SymmetricCryptoKey => {
//     return self.cryptoKey;
//   };
//
//   const setup = (cryptoKeyValue: SymmetricCryptoKey, keyHashValue: string, encryptedCryptoKeyValue: string) => {
//     self.encryptedCryptoKey = encryptedCryptoKeyValue;
//     self.keyHash = keyHashValue;
//     self.cryptoKey = cryptoKeyValue;
//     localStorage.setItem('keyHash', keyHashValue);
//   };
//
//   return {
//     afterCreate,
//     setCryptoKey,
//     getCryptoKey,
//     setup
//   };
// }).views(self => ({
//   get readyForFastLogin (): boolean {
//     return !!self.keyHash;
//   },
//   async encrypt(value: string): Promise<string> {
//     const encString = await self.cryptoService.encrypt(value, self.cryptoKey);
//     return encString.encryptedString!;
//   },
//   async decrypt(value: string): Promise<string> {
//     const encString = new EncString(value);
//     const decString = await self.cryptoService.decryptToUtf8(encString, self.cryptoKey);
//     return decString;
//   }
// }));
