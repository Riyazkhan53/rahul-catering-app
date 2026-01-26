import {
  getPendingItems,
  markItemSynced,
  saveItem,getItemByCode,updateItem
} from "../db/indexedDB";
import { itemService } from "../../src/api/service";

/**
 * Push local → server
 */
export async function syncPendingItems() {
  if (!navigator.onLine) return;

  const pendingItems = await getPendingItems();

  for (const item of pendingItems) {
    try {
      const res = await itemService.upsertItem(item)

      await markItemSynced(item.itemId, res.id);
    } catch (err) {
      console.error("Item sync failed:", item.name);
    }
  }
}

/**
 * Pull server → local
 */
export async function pullItemsFromServer() {
  if (!navigator.onLine) return;

  try {
    const serverItems = await itemService.getItems();

    for (const serverItem of serverItems) {
      const serverUpdatedAt = new Date(serverItem.updatedAt).getTime();

      // 1️⃣ Check if item exists locally
      const localItem = await getItemByCode(serverItem.itemId);

      // 2️⃣ If not exists → insert
      if (!localItem) {
        await saveItem({
          ...serverItem,
          syncStatus: "synced",
          serverId: serverItem._id,
          updatedAt: serverUpdatedAt,
        });
        continue;
      }

      const localUpdatedAt = localItem.updatedAt || 0;

      // 3️⃣ Compare timestamps
      if (serverUpdatedAt > localUpdatedAt) {
        await updateItem({
          ...localItem,        // preserve local-only fields
          ...serverItem,       // overwrite with newer server data
          syncStatus: "synced",
          serverId: serverItem._id,
          updatedAt: serverUpdatedAt,
        });
      }

      // else: local is newer → DO NOTHING
    }
  } catch (err) {
    console.error("Pull items failed", err);
  }
}