import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Plus, MessageSquare, Save, Search } from "lucide-react";
import { Input, Button, Textarea } from "../../Components/BasicComponents";
import { getAllItems, saveListToDB } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import Modal from "../../Components/BasicComponents/Modal";
import ModalCard from "../../Components/BasicComponents/ModalCard";

export default function EditListModal({ list, onClose, onSaved }) {
  const [editItems, setEditItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [showAddItems, setShowAddItems] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [commentFor, setCommentFor] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setEditItems(list.items.map((item) => ({ ...item })));
    getAllItems().then((data) => setAllItems(data || []));
  }, [list]);

  const updateField = (index, field, value) => {
    setEditItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeItem = (index) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = (item) => {
    const alreadyExists = editItems.some((e) => e.itemId === item.itemId);
    if (alreadyExists) {
      showToast("Item already in list", "error");
      return;
    }
    setEditItems((prev) => [
      ...prev,
      {
        itemId: item.itemId,
        name: item.name,
        tamilName: item.tamilName || "",
        quantity: item.defaultQuantity || "",
        unit: item.unit || "",
        comment: "",
        ordNo: prev.length + 1,
      },
    ]);
    showToast(`Added ${item.name}`, "success");
  };

  const handleSave = async () => {
    if (editItems.length === 0) {
      showToast("List must have at least one item", "error");
      return;
    }
    setSaving(true);
    try {
      const updated = {
        ...list,
        items: editItems.map((item, i) => ({ ...item, ordNo: i + 1 })),
      };
      await saveListToDB(updated);
      showToast("List updated successfully", "success");
      onSaved?.();
      onClose();
    } catch (err) {
      showToast("Failed to update list", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredAddItems = allItems.filter((item) => {
    if (!addSearch) return true;
    const q = addSearch.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.tamilName?.toLowerCase().includes(q)
    );
  });

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Edit List
            </h3>
            <p className="text-xs text-gray-400">{list.name} &middot; {list.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {editItems.length === 0 && (
            <p className="text-center text-gray-400 py-8">No items in list. Add some below.</p>
          )}

          {editItems.map((item, index) => (
            <div
              key={item.itemId || index}
              className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
              {/* Item name */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                  {item.name}
                </p>
                {item.tamilName && (
                  <p className="text-xs text-gray-400 truncate">{item.tamilName}</p>
                )}
              </div>

              {/* Qty + Unit */}
              <div className="flex items-center gap-2 shrink-0">
                <Input
                  type="text"
                  value={item.quantity || ""}
                  onChange={(e) => updateField(index, "quantity", e.target.value)}
                  placeholder="qty"
                  className="w-20 px-2 py-1.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Input
                  type="text"
                  value={item.unit || ""}
                  onChange={(e) => updateField(index, "unit", e.target.value)}
                  placeholder="unit"
                  className="w-20 px-2 py-1.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                {/* Comment button */}
                <button
                  type="button"
                  onClick={() => {
                    setCommentFor(index);
                    setCommentText(item.comment || "");
                  }}
                  className={`p-1.5 rounded-lg transition ${item.comment ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  title={item.comment || "Add comment"}
                >
                  <MessageSquare size={16} />
                </button>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setShowAddItems(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition"
          >
            <Plus size={16} />
            Add Items
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Items Picker */}
      {showAddItems && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-lg max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Add Items</h4>
              <button onClick={() => { setShowAddItems(false); setAddSearch(""); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1">
              {filteredAddItems.map((item) => {
                const alreadyAdded = editItems.some((e) => e.itemId === item.itemId);
                return (
                  <button
                    key={item.itemId}
                    onClick={() => !alreadyAdded && addItem(item)}
                    disabled={alreadyAdded}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition ${
                      alreadyAdded
                        ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                        : "hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                      {item.tamilName && <p className="text-xs text-gray-400">{item.tamilName}</p>}
                    </div>
                    {alreadyAdded ? (
                      <span className="text-xs text-gray-400">Added</span>
                    ) : (
                      <Plus size={16} className="text-orange-500 shrink-0" />
                    )}
                  </button>
                );
              })}
              {filteredAddItems.length === 0 && (
                <p className="text-center text-gray-400 py-6 text-sm">No items found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {commentFor !== null && (
        <Modal onClose={() => setCommentFor(null)}>
          <ModalCard
            onClose={() => setCommentFor(null)}
            title="Edit Comment"
            footer={
              <Button
                onClick={() => {
                  updateField(commentFor, "comment", commentText);
                  setCommentFor(null);
                  setCommentText("");
                }}
              >
                Save
              </Button>
            }
          >
            <Textarea
              autoFocus
              rows={3}
              placeholder="Comment for this item"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </ModalCard>
        </Modal>
      )}
    </div>,
    document.body
  );
}
