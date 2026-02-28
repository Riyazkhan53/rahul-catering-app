import { getAllUserRoles } from "../db/indexedDB";

// Cache roles in memory after first load
let cachedRoles = null;

export async function loadRoleLabels() {
  try {
    cachedRoles = await getAllUserRoles();
  } catch {
    cachedRoles = [];
  }
  return cachedRoles;
}

/**
 * Get a human-readable label for a role ID.
 * Uses cached roles from IndexedDB, falls back to formatting the ID.
 * e.g. "list_creator" → "List Creator", "event_manager" → "Event Manager"
 */
export function getRoleLabel(roleId) {
  if (!roleId) return "User";

  // Check cached roles first
  if (cachedRoles) {
    const match = cachedRoles.find(
      (r) => (r.id || r.roleId) === roleId
    );
    if (match?.label) return match.label;
  }

  // Fallback: format the ID nicely
  return roleId
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
