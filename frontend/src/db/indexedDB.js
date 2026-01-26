const DB_NAME = "rahul_catering_db";
const DB_VERSION = 3;

const LIST_STORE = "generated_lists";
const ITEM_STORE = "items_master";
const AUTH_STORE = "auth_cache";

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(LIST_STORE)) {
        db.createObjectStore(LIST_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(ITEM_STORE)) {
        db.createObjectStore(ITEM_STORE, {
          keyPath: "itemId",
          autoIncrement: true,
        });
      }

      // 🔐 AUTH STORE
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE, {
          keyPath: "username",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/// /* ---------- AUTH CACHE ---------- */

export async function saveAuthLogin({ username, token }) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUTH_STORE, "readwrite");
    const store = tx.objectStore(AUTH_STORE);

    store.put({
      username,
      token,
      lastSyncedAt: Date.now(),
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineAuth(username) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUTH_STORE, "readonly");
    const store = tx.objectStore(AUTH_STORE);
    const request = store.get(username);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function isAuthExpired(auth, days = 7) {
  if (!auth?.lastSyncedAt) return true;

  const expiry = days * 24 * 60 * 60 * 1000;
  return Date.now() - auth.lastSyncedAt > expiry;
}

export async function saveListToDB(list) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIST_STORE, "readwrite");
    const store = tx.objectStore(LIST_STORE);

    store.put(list);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/// /* ---------- GENERATED LISTS ---------- */

export async function getAllLists() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIST_STORE, "readonly");
    const store = tx.objectStore(LIST_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* ---------- ITEM MASTER ---------- */

export async function saveItem(item) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readwrite");
    const store = tx.objectStore("items_master");

    store.add(item);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateItem(item) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readwrite");
    const store = tx.objectStore("items_master");

    store.put({
      ...item,
      syncStatus: "pending",
      updatedAt: Date.now(),
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteItem(itemId) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readwrite");
    const store = tx.objectStore("items_master");

    store.delete(itemId);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllItems() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readonly");
    const store = tx.objectStore("items_master");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getItemsByCategory(category) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(ITEM_STORE, "readonly");
    const store = tx.objectStore(ITEM_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const filtered = request.result.filter(
        (item) => item.category === category
      );
      resolve(filtered);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingItems() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readonly");
    const store = tx.objectStore("items_master");
    const req = store.getAll();

    req.onsuccess = () => {
      const pending = req.result.filter(
        (item) => (item.syncStatus === "pending" || !item.syncStatus)
      );
      resolve(pending);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function markItemSynced(itemId, serverId) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readwrite");
    const store = tx.objectStore("items_master");

    const req = store.get(itemId);
    req.onsuccess = () => {
      const item = req.result;
      if (!item) return resolve();

      item.syncStatus = "synced";
      item.serverId = serverId;
      item.updatedAt = Date.now();

      store.put(item);
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getItemByCode(code) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("items_master", "readonly");
    const store = tx.objectStore("items_master");

    const req = store.get(code); // assuming code is keyPath
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}