import { useEffect, useState } from "react";
import { Shield, Plus, Trash2, X, Pencil, Check, Loader2 } from "lucide-react";
import { getAllUserRoles, saveUserRole, deleteUserRole } from "../../db/indexedDB";
import { apiRequest, isOfflineMode } from "../../api/api";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

// Normalize API role to local format (roleId → id)
function normalizeRole(r) {
  return {
    id: r.roleId || r.id,
    label: r.label,
    description: r.description || "",
    isDefault: !!r.isDefault,
    tabs: r.tabs || [],
    permissions: r.permissions || {},
  };
}

export default function RoleSettings() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newRole, setNewRole] = useState({ label: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ label: "", description: "" });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      let data;
      if (!isOfflineMode()) {
        // Fetch from API (seeds defaults on server side)
        const apiRoles = await apiRequest("/api/roles");
        data = apiRoles.map(normalizeRole);
        // Sync to IndexedDB for offline use
        for (const role of data) {
          await saveUserRole(role);
        }
      } else {
        // Offline: read from IndexedDB
        data = await getAllUserRoles();
      }
      // Sort: defaults first
      data.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      setRoles(data);
    } catch (err) {
      // Fallback to IndexedDB if API fails
      try {
        const local = await getAllUserRoles();
        local.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
        setRoles(local);
      } catch {
        showToast("Failed to load roles", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const label = newRole.label.trim();
    if (!label) {
      showToast("Role name is required", "error");
      return;
    }

    const roleId = label.toLowerCase().replace(/\s+/g, "_");
    if (roles.some((r) => r.id === roleId)) {
      showToast("Role already exists", "error");
      return;
    }

    try {
      setSaving(true);
      if (!isOfflineMode()) {
        // Create via API
        await apiRequest("/api/roles", {
          method: "POST",
          body: { roleId, label, description: newRole.description.trim() },
        });
      } else {
        // Offline: save locally
        await saveUserRole({
          id: roleId,
          label,
          description: newRole.description.trim(),
          isDefault: false,
          tabs: ["dashboard", "appsettings"],
          permissions: {
            menu: { create: false, modify: false, delete: false, approve: false },
            items: { create: false, modify: false, delete: false, approve: false },
            billing: { create: false, modify: false, delete: false, approve: false },
          },
          createdAt: Date.now(),
        });
      }
      showToast(`Role "${label}" added`, "success");
      setNewRole({ label: "", description: "" });
      setShowAdd(false);
      await loadRoles();
    } catch (err) {
      showToast(err.message || "Failed to add role", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role) => {
    if (role.isDefault) {
      showToast("Cannot delete default roles", "error");
      return;
    }
    try {
      if (!isOfflineMode()) {
        await apiRequest(`/api/roles/${role.id}`, { method: "DELETE" });
      }
      await deleteUserRole(role.id);
      showToast(`Role "${role.label}" deleted`, "success");
      await loadRoles();
    } catch (err) {
      showToast(err.message || "Failed to delete role", "error");
    }
  };

  const startEdit = (role) => {
    setEditingId(role.id);
    setEditData({ label: role.label, description: role.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ label: "", description: "" });
  };

  const handleSaveEdit = async (role) => {
    const label = editData.label.trim();
    if (!label) {
      showToast("Role name is required", "error");
      return;
    }
    try {
      setSaving(true);
      if (!isOfflineMode()) {
        await apiRequest(`/api/roles/${role.id}`, {
          method: "PUT",
          body: { label, description: editData.description.trim() },
        });
      } else {
        await saveUserRole({
          ...role,
          label,
          description: editData.description.trim(),
          updatedAt: Date.now(),
        });
      }
      showToast(`Role "${label}" updated`, "success");
      cancelEdit();
      await loadRoles();
    } catch (err) {
      showToast(err.message || "Failed to update role", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3" />
        <p className="text-gray-500 dark:text-gray-400">Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Roles ({roles.length})
          </h3>
        </div>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            cancelEdit();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
            showAdd
              ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? "Cancel" : "Add Role"}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-700 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                New Role
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={newRole.label}
                    onChange={(e) => setNewRole({ ...newRole, label: e.target.value })}
                    placeholder="e.g. Manager, Supervisor..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="Brief description of this role"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAdd}
                  disabled={saving || !newRole.label.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Role
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roles List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 group hover:shadow-sm transition"
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  role.isDefault
                    ? "bg-gradient-to-br from-orange-400 to-amber-500"
                    : "bg-gradient-to-br from-blue-400 to-indigo-500"
                }`}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>

              {/* Content */}
              {editingId === role.id ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editData.label}
                    onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(role)}
                    disabled={role.isDefault}
                  />
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(role)}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveEdit(role)}
                      disabled={saving}
                      className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {role.label}
                      </span>
                      {role.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                          Default
                        </span>
                      )}
                    </div>
                    {role.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {role.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => startEdit(role)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                      title="Edit role"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {!role.isDefault && (
                      <button
                        onClick={() => handleDelete(role)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                        title="Delete role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {roles.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No roles configured yet</p>
        </div>
      )}
    </div>
  );
}
