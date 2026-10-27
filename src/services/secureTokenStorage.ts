import type { KeyValueStorageInterface } from 'aws-amplify/utils';
import * as SecureStore from 'expo-secure-store';

const INDEX_KEY = 'pathwise.secureTokenStorage.index';

// SecureStore keys may only contain letters, digits, ".", "-" and "_".
export const toSecureStoreKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, '_');

const readIndex = async (): Promise<string[]> => JSON.parse((await SecureStore.getItemAsync(INDEX_KEY)) ?? '[]');

// SecureStore cannot list its keys, so clear() relies on this index. Updates run one at a time
// because Amplify writes several tokens in parallel.
let pendingIndexUpdate: Promise<void> = Promise.resolve();
const updateIndex = (change: (keys: string[]) => string[]) => {
  pendingIndexUpdate = pendingIndexUpdate.then(async () => {
    await SecureStore.setItemAsync(INDEX_KEY, JSON.stringify(change(await readIndex())));
  });
  return pendingIndexUpdate;
};

export const secureTokenStorage: KeyValueStorageInterface = {
  async setItem(key, value) {
    const secureKey = toSecureStoreKey(key);
    await SecureStore.setItemAsync(secureKey, value);
    await updateIndex((keys) => (keys.includes(secureKey) ? keys : [...keys, secureKey]));
  },
  getItem: (key) => SecureStore.getItemAsync(toSecureStoreKey(key)),
  async removeItem(key) {
    const secureKey = toSecureStoreKey(key);
    await SecureStore.deleteItemAsync(secureKey);
    await updateIndex((keys) => keys.filter((existing) => existing !== secureKey));
  },
  async clear() {
    await pendingIndexUpdate;
    const keys = await readIndex();
    await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    await SecureStore.deleteItemAsync(INDEX_KEY);
  },
};
