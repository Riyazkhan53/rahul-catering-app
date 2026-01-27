import {
  getPendingItems,
  updateItem,
  saveItem,
  clearIndexedDB,
} from "../db/indexedDB";

import { itemService } from "../api/service";

/* ---------------- APP SYNC ---------------- */
/* Safe: does NOT delete local data */
export async function appSync() {
  if (!navigator.onLine) {
    throw new Error("You are offline");
  }

  // 1️⃣ Push local pending → server
  await pushPendingItems();

  // 2️⃣ Pull server → local
  await pullItemsFromServer();

  localStorage.setItem("lastAppSync", Date.now());
}

/* ---------------- MASTER SYNC ---------------- */
/* Destructive: clears IndexedDB */
export async function masterSync(setProgress) {
  if (!navigator.onLine) {
    throw new Error("Internet required for Master Sync");
  }

  // 1️⃣ Clear local DB
  setProgress(20);
  await clearIndexedDB("rahul_catering_db");

  // 2️⃣ Pull from server
  setProgress(50);
  const items = await itemService.getItems();

  // 3️⃣ Save locally
  let count = 0;
  for (const item of items) {
    await saveItem({
      ...item,
      syncStatus: "synced",
      serverId: item._id,
    });

    count++;
    const percent = 50 + Math.floor((count / items.length) * 40);
    setProgress(percent);
  }

  // 4️⃣ Done
  setProgress(100);
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