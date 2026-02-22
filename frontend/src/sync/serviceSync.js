import {
  getPendingItems,
  updateItem,
  saveItem,
  clearIndexedDB,
  openDB,
  getPendingGeneratedLists,
  saveGeneratedList,
  updateGeneratedList,
  savePicklistCache,
  saveQuotation,
  saveMenuPlan,
} from "../db/indexedDB";

import {
  itemService,
  generatedListService,
  picklistService,
  generatedQuotationService,
  generatedMenuPlanService,
} from "../api/service";

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
/* Destructive: clears IndexedDB, pulls everything fresh from server */

function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timed out")), ms)
    ),
  ]);
}

export async function masterSync(setProgress, setStatus) {
  if (!navigator.onLine) {
    throw new Error("Internet required for Master Sync");
  }

  const failed = [];

  // Helper: run a sync step safely, returns true on success
  const runStep = async (label, fn) => {
    setStatus?.(`Syncing ${label}…`);
    try {
      await withTimeout(fn(), 15000);
      setStatus?.(`${label} synced ✓`);
      return true;
    } catch (err) {
      console.error(`${label} sync failed:`, err);
      failed.push(label);
      setStatus?.(`${label} failed ✗`);
      return false;
    }
  };

  // ── 1. Clear local DB ──
  setStatus?.("Clearing local data…");
  setProgress(5);
  try {
    await clearIndexedDB("rahul_catering_db");
    // Recreate DB + all object stores immediately after delete
    await openDB();
  } catch (err) {
    console.error("Clear DB failed:", err);
    throw new Error("Failed to clear local data");
  }
  setProgress(10);

  // ── 2. Items ──
  await runStep("Items", async () => {
    const items = await itemService.getItems();
    const arr = Array.isArray(items) ? items : [];
    for (const item of arr) {
      await saveItem({
        ...item,
        syncStatus: "synced",
        serverId: item._id,
      });
    }
  });
  setProgress(25);

  // ── 3. Generated Lists ──
  await runStep("Generated Lists", async () => {
    const lists = await generatedListService.fetchGeneratedLists();
    const arr = Array.isArray(lists) ? lists : [];
    for (const list of arr) {
      await saveGeneratedList(
        { ...list, syncStatus: "synced" },
        { fromServer: true }
      );
    }
  });
  setProgress(40);

  // ── 4. Picklists ──
  await runStep("Picklists", async () => {
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
  });
  setProgress(55);

  // ── 5. Quotations ──
  await runStep("Quotations", async () => {
    const quotations = await generatedQuotationService.fetchGeneratedQuotations();
    const arr = Array.isArray(quotations) ? quotations : [];
    for (const q of arr) {
      await saveQuotation({ ...q, id: q.id || q.quotationNumber });
    }
  });
  setProgress(70);

  // ── 6. Menu Plans ──
  await runStep("Menu Plans", async () => {
    const plans = await generatedMenuPlanService.fetchGeneratedMenuPlans();
    const arr = Array.isArray(plans) ? plans : [];
    for (const p of arr) {
      await saveMenuPlan({ ...p, id: p.id || p.planNumber });
    }
  });
  setProgress(90);

  // ── 7. Result ──
  if (failed.length > 0) {
    setStatus?.(`Failed: ${failed.join(", ")}`);
    throw new Error(`Sync failed for: ${failed.join(", ")}`);
  }

  setProgress(100);
  setStatus?.("All collections synced ✓");
  return true;
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
    await generatedListService.saveGeneratedList(list);

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