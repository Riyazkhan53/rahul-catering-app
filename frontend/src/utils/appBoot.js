import { openDB } from "../db/indexedDB";

export async function appBoot() {
  // 1. Wait for DOM paint
  await new Promise(requestAnimationFrame);

  // 2. Wait for fonts
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  // 3. Wait for IndexedDB
  await openDB();

  // 4. Extra frame to ensure layout painted
  await new Promise(requestAnimationFrame);
}