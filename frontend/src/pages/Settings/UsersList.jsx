import { useEffect, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import Modal from "../../Components/Modal";
import { apiRequest } from "../../api/api";
import { useToast } from "../../context/ToastContext";

export default function ChefListModal({ onClose }) {
  const [chefs, setChefs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ password: "", hasAdminRole: false });
  const { showToast } = useToast();

  const fetchChefs = () => {
    apiRequest("/api/users/chefs").then(setChefs).catch(() => {});
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const startEdit = (chef) => {
    setEditingId(chef._id);
    setEditForm({
      password: "",
      hasAdminRole: (chef.additional_roles || []).includes("admin"),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ password: "", hasAdminRole: false });
  };

  const saveEdit = async (chefId) => {
    try {
      const body = {
        additional_roles: editForm.hasAdminRole ? ["admin"] : [],
      };
      if (editForm.password.trim()) {
        body.password = editForm.password;
      }

      await apiRequest(`/api/users/chef/${chefId}`, {
        method: "PUT",
        body,
      });

      showToast("Chef updated successfully", "success");
      cancelEdit();
      fetchChefs();
    } catch (err) {
      showToast(err.message || "Failed to update chef", "error");
    }
  };

  return (
    <Modal
      title="👨‍🍳 Chef Accounts"
      subtitle="All chefs currently registered"
      onClose={onClose}
    >
      <div className="space-y-3 max-h-[400px] overflow-auto">
        {chefs.map((chef) => (
          <div
            key={chef._id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{chef.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{chef.username}</p>
              </div>

              <div className="flex items-center gap-2">
                {(chef.additional_roles || []).includes("admin") && (
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                    ADMIN
                  </span>
                )}
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  CHEF
                </span>
                {editingId !== chef._id && (
                  <button
                    onClick={() => startEdit(chef)}
                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Edit form */}
            {editingId === chef._id && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-3">
                <input
                  type="password"
                  placeholder="New password (leave blank to keep)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500"
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.hasAdminRole}
                    onChange={(e) => setEditForm({ ...editForm, hasAdminRole: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Grant Admin role</span>
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(chef._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {chefs.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No chefs found</p>
        )}
      </div>
    </Modal>
  );
}