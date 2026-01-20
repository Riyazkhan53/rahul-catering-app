const DB_NAME = "rahul_catering_db";
const DB_VERSION = 2;
const LIST_STORE = "generated_lists";
const ITEM_STORE = "items_master";

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(LIST_STORE)) {
        db.createObjectStore(LIST_STORE, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(ITEM_STORE)) {
        db.createObjectStore(ITEM_STORE, {
          keyPath: "itemId",
          autoIncrement: true
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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