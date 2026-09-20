// IndexedDB 얇은 래퍼. 라이브러리 없음.
export const DB_NAME = 'meonji-collect';
export const DB_VERSION = 1;
export const STORES = { cards: 'cards', files: 'files', criteria: 'criteria', settings: 'settings', queue: 'queue', cache: 'cache' };

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('IndexedDB 없음')); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('cards')) {
        const s = db.createObjectStore('cards', { keyPath: 'id' });
        s.createIndex('updated_at', 'updated_at');
      }
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('criteria')) db.createObjectStore('criteria', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('queue')) db.createObjectStore('queue', { keyPath: 'seq', autoIncrement: true });
      if (!db.objectStoreNames.contains('cache')) db.createObjectStore('cache', { keyPath: 'key' });
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

export function reqP(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function run(storeName, mode, fn) {
  const db = await openDB();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  const done = new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('abort'));
  });
  const out = await fn(store, tx);
  await done;
  return out;
}

export const getAll = (store) => run(store, 'readonly', (s) => reqP(s.getAll()));
export const getOne = (store, key) => run(store, 'readonly', (s) => reqP(s.get(key)));
export const putOne = (store, value) => run(store, 'readwrite', (s) => reqP(s.put(value)));
export const delOne = (store, key) => run(store, 'readwrite', (s) => reqP(s.delete(key)));
export const clearStore = (store) => run(store, 'readwrite', (s) => reqP(s.clear()));
export async function putMany(store, values) {
  return run(store, 'readwrite', async (s) => { for (const v of values) s.put(v); });
}

export async function deleteDatabase() {
  const db = dbPromise ? await dbPromise.catch(() => null) : null;
  if (db) db.close();
  dbPromise = null;
  await new Promise((resolve) => {
    const r = indexedDB.deleteDatabase(DB_NAME);
    r.onsuccess = r.onerror = r.onblocked = () => resolve();
  });
}
