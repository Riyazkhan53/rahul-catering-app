import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MiniLoader from "../../Components/MiniLoader";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  Search,
  ListFilter,
  RefreshCw,
} from "lucide-react";
import { picklistService } from "../../api/service";
import { useToast } from "../../context/ToastContext";
import {
  savePicklistCache,
  getPicklistCache,
  getAllPicklistCache,
} from "../../db/indexedDB";

const PICKLIST_TYPES = [
  {
    key: "item_category",
    label: "Item Category",
    description: "Raw material categories (Vegetables, Spices, etc.)",
  },
  {
    key: "unit",
    label: "Units",
    description: "Measurement units (kg, litre, piece, etc.)",
  },
  {
    key: "event_type",
    label: "Event Type",
    description: "Types of events (Wedding, Birthday, etc.)",
  },
  {
    key: "dish_category",
    label: "Dish Category",
    description: "Food categories (Starter, Main Course, etc.)",
  },
  {
    key: "service_type",
    label: "Service Type",
    description: "Additional services (Decoration, Tent, etc.)",
  },
  {
    key: "payment_mode",
    label: "Payment Mode",
    description: "Payment methods (Cash, UPI, Bank Transfer, etc.)",
  },
];

export default function PicklistManager() {
  const { showToast } = useToast();
  const [activeType, setActiveType] = useState(PICKLIST_TYPES[0].key);
  const [allData, setAllData] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ code: "", label: "", value: "" });
  const [addLoading, setAddLoading] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ code: "", label: "", value: "" });
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Sync status
  const [syncing, setSyncing] = useState(false);

  // On mount: load from IDB only (no API call)
  useEffect(() => {
    loadAllFromIDB();
  }, []);

  const loadAllFromIDB = async () => {
    try {
      const cached = await getAllPicklistCache();
      if (Object.keys(cached).length > 0) {
        setAllData(cached);
      }
    } catch (err) {
      console.error("Failed to load from IDB:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const syncAllFromAPI = async () => {
    setSyncing(true);
    try {
      const allItems = await picklistService.getAll();
      const arr = Array.isArray(allItems) ? allItems : [];

      // Group items by their picklist type
      const grouped = {};
      PICKLIST_TYPES.forEach((t) => (grouped[t.key] = []));
      arr.forEach((item) => {
        if (grouped[item.picklist]) {
          grouped[item.picklist].push(item);
        } else {
          grouped[item.picklist] = [item];
        }
      });

      // Save each type to IDB cache
      for (const key of Object.keys(grouped)) {
        await savePicklistCache(key, grouped[key]);
      }

      setAllData(grouped);
      showToast("Synced from server", "success");
    } catch (err) {
      console.error("API sync failed:", err);
      showToast("Sync failed — using local data", "error");
    } finally {
      setSyncing(false);
    }
  };

  const items = allData[activeType] || [];

  const updateLocalData = (type, updater) => {
    setAllData((prev) => {
      const updated = updater(prev[type] || []);
      // Also update IDB in background
      savePicklistCache(type, updated).catch(console.error);
      return { ...prev, [type]: updated };
    });
  };

  const handleAdd = async () => {
    if (!addForm.code.trim() || !addForm.label.trim()) {
      showToast("Code and Label are required", "error");
      return;
    }

    setAddLoading(true);
    try {
      const newItem = await picklistService.add(activeType, {
        code: addForm.code.trim().toUpperCase(),
        label: addForm.label.trim(),
        value: addForm.value.trim() || addForm.label.trim().toLowerCase().replace(/\s+/g, "_"),
        order: items.length,
      });
      updateLocalData(activeType, (prev) => [...prev, newItem]);
      setAddForm({ code: "", label: "", value: "" });
      setShowAdd(false);
      showToast("Item added", "success");
    } catch (err) {
      console.error("Add failed:", err);
      showToast("Failed to add item", "error");
    } finally {
      setAddLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setEditForm({ code: item.code, label: item.label, value: item.value });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ code: "", label: "", value: "" });
  };

  const handleUpdate = async (id) => {
    if (!editForm.code.trim() || !editForm.label.trim()) {
      showToast("Code and Label are required", "error");
      return;
    }

    setEditLoading(true);
    try {
      const updated = await picklistService.update(activeType, id, {
        code: editForm.code.trim().toUpperCase(),
        label: editForm.label.trim(),
        value: editForm.value.trim() || editForm.label.trim().toLowerCase().replace(/\s+/g, "_"),
      });
      updateLocalData(activeType, (prev) =>
        prev.map((i) => (i._id === id ? updated : i))
      );
      cancelEdit();
      showToast("Item updated", "success");
    } catch (err) {
      console.error("Update failed:", err);
      showToast("Failed to update item", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;

    setDeleteLoading(id);
    try {
      await picklistService.delete(activeType, id);
      updateLocalData(activeType, (prev) =>
        prev.filter((i) => i._id !== id)
      );
      showToast("Item deleted", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete item", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const activeLabel = PICKLIST_TYPES.find((t) => t.key === activeType)?.label || "";

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Picklist Type Tabs - horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {PICKLIST_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => {
              setActiveType(type.key);
              setShowAdd(false);
              cancelEdit();
              setSearch("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeType === type.key
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Header + Search + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ListFilter className="w-5 h-5 text-orange-500 shrink-0" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {activeLabel}
          </h3>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
          {syncing && (
            <span className="flex items-center gap-1 text-xs text-orange-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              Syncing...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-40 sm:w-48 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 outline-none"
            />
          </div>
          <button
            onClick={() => syncAllFromAPI()}
            disabled={syncing}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
            title="Refresh from server"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setShowAdd(!showAdd);
              cancelEdit();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-3">
                Add New {activeLabel}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Code (e.g. VE)"
                  value={addForm.code}
                  onChange={(e) =>
                    setAddForm({ ...addForm, code: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Vegetables)"
                  value={addForm.label}
                  onChange={(e) =>
                    setAddForm({ ...addForm, label: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Value (auto-generated if empty)"
                  value={addForm.value}
                  onChange={(e) =>
                    setAddForm({ ...addForm, value: e.target.value })
                  }
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={addLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {addLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      {initialLoading ? (
        <MiniLoader variant="section" message="Loading..." />
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-16 border-dashed border-4 border-gray-200 dark:border-gray-700 rounded-xl">
          {search
            ? "No matching items found."
            : `No ${activeLabel.toLowerCase()} items yet. Click "Add" to create one.`}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-2">Code</div>
            <div className="col-span-4">Label</div>
            <div className="col-span-4">Value</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filtered.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {editId === item._id ? (
                /* Edit Mode */
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      value={editForm.code}
                      onChange={(e) =>
                        setEditForm({ ...editForm, code: e.target.value })
                      }
                      className="sm:col-span-2 border border-orange-300 dark:border-orange-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Code"
                    />
                    <input
                      type="text"
                      value={editForm.label}
                      onChange={(e) =>
                        setEditForm({ ...editForm, label: e.target.value })
                      }
                      className="sm:col-span-4 border border-orange-300 dark:border-orange-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={editForm.value}
                      onChange={(e) =>
                        setEditForm({ ...editForm, value: e.target.value })
                      }
                      className="sm:col-span-4 border border-orange-300 dark:border-orange-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Value"
                    />
                    <div className="sm:col-span-2 flex justify-end gap-1">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        disabled={editLoading}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                        title="Save"
                      >
                        {editLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="grid grid-cols-12 gap-3 items-center p-3 sm:p-4">
                  <div className="col-span-12 sm:col-span-2">
                    <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-1 rounded-md">
                      {item.code}
                    </span>
                  </div>
                  <div className="col-span-6 sm:col-span-4 font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {item.label}
                  </div>
                  <div className="col-span-6 sm:col-span-4 text-gray-500 dark:text-gray-400 text-sm truncate">
                    {item.value}
                  </div>
                  <div className="col-span-12 sm:col-span-2 flex justify-end gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleteLoading === item._id}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteLoading === item._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
