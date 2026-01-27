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
export async function masterSync() {
  if (!navigator.onLine) {
    throw new Error("Internet required for Master Sync");
  }

  await clearIndexedDB("rahul_catering_db");

  await pullItemsFromServer();

  localStorage.setItem("lastMasterSync", Date.now());
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