import {
  getPendingItems,
  updateItem,
  saveItem,
  clearIndexedDB,
  getPendingGeneratedLists,
  saveGeneratedList,
  updateGeneratedList,
  savePicklistCache,
} from "../db/indexedDB";

import { itemService, generatedListService, picklistService } from "../api/service";

/* ---------------- APP SYNC ---------------- */
/* Safe: does NOT delete local data */
export async function appSync() {
  if (!navigator.onLine) {
    throw new Error("You are offline");
  }

  // Items
  await pushPendingItems();
  await pullItemsFromServer();

  // Generated Lists
  await pushPendingGeneratedLists();
  await pullGeneratedListsFromServer();

  // Picklists
  await pullPicklistsFromServer();

  localStorage.setItem("lastAppSync", Date.now());
}

/* ---------------- MASTER SYNC ---------------- */
/* Destructive: clears IndexedDB */

function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

export async function masterSync(setProgress) {
  if (!navigator.onLine) {
    throw new Error("Internet required for Master Sync");
  }

  try {
    setProgress(10);

    // 1️⃣ Clear local DB
    await clearIndexedDB("rahul_catering_db");
    setProgress(20);

    // 2️⃣ Pull from server (with timeout)
    const [items, lists, picklists] = await Promise.all([
      withTimeout(itemService.getItems(), 10000),
      withTimeout(generatedListService.fetchGeneratedLists(), 10000),
      withTimeout(picklistService.getAll(), 10000).catch(() => []),
    ]);

    setProgress(40);

    // 3️⃣ Save ITEMS locally
    let count = 0;
    for (const item of items) {
      await saveItem({
        ...item,
        syncStatus: "synced",
        serverId: item._id,
      });

      count++;
      setProgress(40 + Math.floor((count / items.length) * 30));
    }

    // 4️⃣ Save LISTS locally
    count = 0;
    for (const list of lists) {
      await saveGeneratedList(
        {
          ...list,
          syncStatus: "synced",
        },
        { fromServer: true }
      );

      count++;
      setProgress(70 + Math.floor((count / lists.length) * 25));
    }

    // 5️⃣ Save PICKLISTS locally
    if (picklists.length > 0) {
      const grouped = {};
      picklists.forEach((item) => {
        if (!grouped[item.picklist]) grouped[item.picklist] = [];
        grouped[item.picklist].push(item);
      });
      for (const key of Object.keys(grouped)) {
        await savePicklistCache(key, grouped[key]);
      }
    }

    // 6️⃣ Done
    setProgress(100);
    return true;
  } catch (err) {
    console.error("MASTER SYNC FAILED:", err);

    setProgress(0);

    // 🔴 VERY IMPORTANT: stop execution
    throw new Error(
      err.message === "Request timed out"
        ? "Sync failed: Server not responding"
        : "Sync failed: Please try again"
    );
  }
}

/* ---------------- PUSH ---------------- */
async function pushPendingItems() {
  const pendingItems = await getPendingItems();

  for (const item of pendingItems) {
    const response = await itemService.upsertItem(item);

    // server returns updated item
    const serverUpdatedAt = new Date(response.updatedAt).getTime();

    await updateItem(
      {
        ...item,
        serverId: response._id,
        syncStatus: "synced",
        updatedAt: serverUpdatedAt,
      },
      { fromServer: true }
    );
  }
}

async function pushPendingGeneratedLists() {
  const pendingLists = await getPendingGeneratedLists();

  for (const list of pendingLists) {
    const response = await generatedListService.saveGeneratedList(list);

    await updateGeneratedList({
      ...list,
      syncStatus: "synced",
      updatedAt: Date.now(),
    });
  }
}

/* ---------------- PULL ---------------- */
async function pullItemsFromServer() {
  const serverItems = await itemService.getItems();

  for (const serverItem of serverItems) {
    const serverUpdatedAt = new Date(serverItem.updatedAt).getTime();

    await saveItem({
      ...serverItem,
      serverId: serverItem._id,
      syncStatus: "synced",
      updatedAt: serverUpdatedAt,
    });
  }
}

async function pullGeneratedListsFromServer() {
  const serverLists = await generatedListService.fetchGeneratedLists();

  for (const list of serverLists) {
    await saveGeneratedList(
      {
        ...list,
        syncStatus: "synced",
        updatedAt: Date.now(),
      },
      { fromServer: true }
    );
  }
}

async function pullPicklistsFromServer() {
  const allItems = await picklistService.getAll();
  const arr = Array.isArray(allItems) ? allItems : [];

  const grouped = {};
  arr.forEach((item) => {
    if (!grouped[item.picklist]) grouped[item.picklist] = [];
    grouped[item.picklist].push(item);
  });

  for (const key of Object.keys(grouped)) {
    await savePicklistCache(key, grouped[key]);
  }
}