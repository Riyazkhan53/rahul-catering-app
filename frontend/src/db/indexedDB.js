const DB_NAME = "rahul_catering_db";
const DB_VERSION = 8;

const LIST_STORE = "generated_lists";
const ITEM_STORE = "items_master";
const AUTH_STORE = "auth_cache";
const GENERATED_LIST_STORE = "generated_lists";
const EVENT_DATES = "event_dates";
const QUOTATION_STORE = "quotations";
const MENU_PLAN_STORE = "menu_plans";
const PICKLIST_CACHE_STORE = "picklist_cache";
const DISH_STORE = "dishes_master";
const ORDER_STORE = "orders_master";

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

      // AUTH STORE
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE, {
          keyPath: "username",
        });
      }

      if (!db.objectStoreNames.contains(EVENT_DATES)) {
        db.createObjectStore(EVENT_DATES, {
          keyPath: "date", // YYYY-MM-DD
        });
      }

      if (!db.objectStoreNames.contains(QUOTATION_STORE)) {
        db.createObjectStore(QUOTATION_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(MENU_PLAN_STORE)) {
        db.createObjectStore(MENU_PLAN_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(PICKLIST_CACHE_STORE)) {
        db.createObjectStore(PICKLIST_CACHE_STORE, { keyPath: "type" });
      }

      if (!db.objectStoreNames.contains(DISH_STORE)) {
        db.createObjectStore(DISH_STORE, { keyPath: "dishId" });
      }

      if (!db.objectStoreNames.contains(ORDER_STORE)) {
        db.createObjectStore(ORDER_STORE, { keyPath: "orderId" });
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

export async function getListById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("generated_lists", "readonly");
    const store = tx.objectStore("generated_lists");
    const req = store.get(id);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingGeneratedLists() {
  const db = await openDB();
  return db.generatedLists
    .where("syncStatus")
    .equals("pending")
    .toArray();
}

export async function saveGeneratedList(list, options = {}) {
  const db = await openDB();
  const tx = db.transaction(GENERATED_LIST_STORE, "readwrite");
  const store = tx.objectStore(GENERATED_LIST_STORE);
  const record = {
    ...list,
    syncStatus: options.fromServer ? "synced" : "pending",
    updatedAt: list.updatedAt || Date.now(),
  };

  await store.put(record);
}

export async function updateGeneratedList(list) {
  const db = await openDB();
  const tx = db.transaction(GENERATED_LIST_STORE, "readwrite");
  const store = tx.objectStore(GENERATED_LIST_STORE);
  await store.put(list);
}

export async function getAllGeneratedListsLocal() {
  const db = await openDB();
  return db.generatedLists.toArray();
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


export async function clearIndexedDB(dbName) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(dbName);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}


//Orders Calender Events

export async function saveEventsForDate(date, events) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readwrite");
    const store = tx.objectStore(EVENT_DATES);

    store.put({ date, events });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}


export async function getEventsByDate(date) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readonly");
    const store = tx.objectStore(EVENT_DATES);
    const req = store.get(date);

    req.onsuccess = () => resolve(req.result?.events || []);
    req.onerror = () => reject(req.error);
  });
}


export async function getAllEventDates() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readonly");
    const store = tx.objectStore(EVENT_DATES);
    const req = store.getAll();

    req.onsuccess = () => {
      const result = {};
      req.result.forEach((r) => {
        result[r.date] = r.events;
      });
      resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getAllEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readonly");
    const store = tx.objectStore(EVENT_DATES);
    const req = store.getAll();

    req.onsuccess = () => {
      const result = {};
      req.result.forEach((r) => {
        result[r.date] = r.events;
      });
      resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}

/* Save events for a date */
export async function saveEventsByDate(date, events) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readwrite");
    const store = tx.objectStore(EVENT_DATES);

    store.put({ date, events });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}


export async function deleteEventsByDate(date) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readwrite");
    const store = tx.objectStore(EVENT_DATES);

    store.delete(date);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteEventById(date, eventId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EVENT_DATES, "readwrite");
    const store = tx.objectStore(EVENT_DATES);
    const req = store.get(date);

    req.onsuccess = () => {
      if (!req.result) return resolve();
      const updated = req.result.events.filter(e => e.id !== eventId);
      store.put({ date, events: updated });
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

/* ---------- QUOTATIONS ---------- */

export async function saveQuotation(quotation) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUOTATION_STORE, "readwrite");
    const store = tx.objectStore(QUOTATION_STORE);
    store.put(quotation);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllQuotations() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUOTATION_STORE, "readonly");
    const store = tx.objectStore(QUOTATION_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getQuotationById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUOTATION_STORE, "readonly");
    const store = tx.objectStore(QUOTATION_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteQuotation(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUOTATION_STORE, "readwrite");
    const store = tx.objectStore(QUOTATION_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------- MENU PLANS ---------- */

export async function saveMenuPlan(menuPlan) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MENU_PLAN_STORE, "readwrite");
    const store = tx.objectStore(MENU_PLAN_STORE);
    store.put(menuPlan);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllMenuPlans() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MENU_PLAN_STORE, "readonly");
    const store = tx.objectStore(MENU_PLAN_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getMenuPlanById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MENU_PLAN_STORE, "readonly");
    const store = tx.objectStore(MENU_PLAN_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMenuPlan(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MENU_PLAN_STORE, "readwrite");
    const store = tx.objectStore(MENU_PLAN_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------- PICKLIST CACHE ---------- */

export async function savePicklistCache(type, items) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PICKLIST_CACHE_STORE, "readwrite");
    const store = tx.objectStore(PICKLIST_CACHE_STORE);
    store.put({ type, items, updatedAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPicklistCache(type) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PICKLIST_CACHE_STORE, "readonly");
    const store = tx.objectStore(PICKLIST_CACHE_STORE);
    const req = store.get(type);
    req.onsuccess = () => resolve(req.result?.items || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPicklistCache() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PICKLIST_CACHE_STORE, "readonly");
    const store = tx.objectStore(PICKLIST_CACHE_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const map = {};
      req.result.forEach((r) => {
        map[r.type] = r.items || [];
      });
      resolve(map);
    };
    req.onerror = () => reject(req.error);
  });
}

/* ---------- ITEM LISTS ---------- */

export async function saveItemList(itemList) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GENERATED_LIST_STORE, "readwrite");
    const store = tx.objectStore(GENERATED_LIST_STORE);
    store.put(itemList);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllItemLists() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GENERATED_LIST_STORE, "readonly");
    const store = tx.objectStore(GENERATED_LIST_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getItemListById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GENERATED_LIST_STORE, "readonly");
    const store = tx.objectStore(GENERATED_LIST_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteItemList(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GENERATED_LIST_STORE, "readwrite");
    const store = tx.objectStore(GENERATED_LIST_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------- DISHES MASTER ---------- */

export async function saveDish(dish) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DISH_STORE, "readwrite");
    const store = tx.objectStore(DISH_STORE);
    store.put(dish);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllDishes() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DISH_STORE, "readonly");
    const store = tx.objectStore(DISH_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getDishesByCategory(category) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DISH_STORE, "readonly");
    const store = tx.objectStore(DISH_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const filtered = (req.result || []).filter((d) => d.category === category);
      resolve(filtered);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDish(dishId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DISH_STORE, "readwrite");
    const store = tx.objectStore(DISH_STORE);
    store.delete(dishId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------- ORDERS MASTER ---------- */

export async function saveOrder(order) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ORDER_STORE, "readwrite");
    const store = tx.objectStore(ORDER_STORE);
    store.put(order);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllOrders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ORDER_STORE, "readonly");
    const store = tx.objectStore(ORDER_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getOrderById(orderId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ORDER_STORE, "readonly");
    const store = tx.objectStore(ORDER_STORE);
    const req = store.get(orderId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteOrder(orderId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ORDER_STORE, "readwrite");
    const store = tx.objectStore(ORDER_STORE);
    store.delete(orderId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
