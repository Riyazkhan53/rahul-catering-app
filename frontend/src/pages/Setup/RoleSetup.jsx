import { useEffect, useState } from "react";
import { Shield, ChevronRight, ChevronLeft, Check, Loader2, LayoutDashboard, UtensilsCrossed, ClipboardList, PlusCircle, FileText, Receipt, Settings, Wrench, Sparkles } from "lucide-react";
import { getAllUserRoles, saveUserRole } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

// All available tabs in the app with their metadata
const ALL_TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Home dashboard with overview" },
  { key: "orders", label: "Orders Management", icon: ClipboardList, description: "View and manage all orders" },
  { key: "menu", label: "Menu & Items Catalogue", icon: UtensilsCrossed, description: "Browse menu items and dishes" },
  { key: "add-order", label: "New Order", icon: PlusCircle, description: "Create new orders" },
  { key: "listcreator", label: "Item/Menu List Creator", icon: FileText, description: "Create item and menu lists" },
  { key: "invoice", label: "Invoice & Billing", icon: Receipt, description: "Manage invoices and billing" },
  { key: "settings", label: "Role Settings", icon: Settings, description: "User and role management" },
  { key: "setup", label: "Setup", icon: Wrench, description: "App setup and configuration" },
  { key: "appsettings", label: "App Settings", icon: Sparkles, description: "Theme, sync and preferences" },
];

// Default tab config per built-in role
const DEFAULT_TAB_CONFIG = {
  admin: ["dashboard", "orders", "menu", "settings", "setup", "appsettings"],
  chef: ["dashboard", "menu", "orders", "add-order", "listcreator", "invoice", "appsettings"],
};

export default function RoleSetup() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [tabConfig, setTabConfig] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getAllUserRoles();
      // Merge with defaults
      const defaults = [
        { id: "admin", label: "Admin", description: "Full access to all features", isDefault: true },
        { id: "chef", label: "Chef", description: "Kitchen & order management", isDefault: true },
      ];
      const savedIds = new Set(data.map((r) => r.id));
      const merged = [
        ...defaults.map((d) => {
          const saved = data.find((r) => r.id === d.id);
          return saved ? { ...d, ...saved, isDefault: true } : d;
        }),
        ...data.filter((r) => !defaults.some((d) => d.id === r.id)),
      ];
      setRoles(merged);
    } catch (err) {
      showToast("Failed to load roles", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    // Load existing tab config or use defaults
    const existing = role.tabs || DEFAULT_TAB_CONFIG[role.id] || ["dashboard", "appsettings"];
    setTabConfig([...existing]);
  };

  const handleToggleTab = (tabKey) => {
    setTabConfig((prev) =>
      prev.includes(tabKey)
        ? prev.filter((k) => k !== tabKey)
        : [...prev, tabKey]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      setSaving(true);
      await saveUserRole({
        ...selectedRole,
        tabs: tabConfig,
        updatedAt: Date.now(),
      });
      showToast(`Tab config saved for "${selectedRole.label}"`, "success");
      // Update local state
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRole.id ? { ...r, tabs: tabConfig } : r))
      );
      setSelectedRole((prev) => ({ ...prev, tabs: tabConfig }));
    } catch (err) {
      showToast("Failed to save config", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setTabConfig([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3" />
        <p className="text-gray-500 dark:text-gray-400">Loading roles...</p>
      </div>
    );
  }

  // Detail view — tab checkboxes for selected role
  if (selectedRole) {
    const hasChanges =
      JSON.stringify([...tabConfig].sort()) !==
      JSON.stringify([...(selectedRole.tabs || DEFAULT_TAB_CONFIG[selectedRole.id] || ["dashboard", "appsettings"])].sort());

    return (
      <div className="w-full space-y-5">
        {/* Back + Role name */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                selectedRole.isDefault
                  ? "bg-gradient-to-br from-orange-400 to-amber-500"
                  : "bg-gradient-to-br from-blue-400 to-indigo-500"
              }`}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {selectedRole.label}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                General Setup — Configure visible tabs
              </p>
            </div>
          </div>
        </div>

        {/* Tab checkboxes */}
        <div className="space-y-2">
          {ALL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isChecked = tabConfig.includes(tab.key);

            return (
              <motion.label
                key={tab.key}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "bg-orange-50 dark:bg-orange-900/10 border-orange-300 dark:border-orange-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isChecked
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>

                {/* Icon */}
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isChecked ? "text-orange-500" : "text-gray-400 dark:text-gray-500"
                  }`}
                />

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm font-medium ${
                      isChecked
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                    {tab.description}
                  </p>
                </div>

                {/* Input hidden */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleTab(tab.key)}
                  className="sr-only"
                />
              </motion.label>
            );
          })}
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {tabConfig.length} of {ALL_TABS.length} tabs enabled
          </p>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </div>
      </div>
    );
  }

  // List view — show all roles
  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Roles ({roles.length})
        </h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 -mt-3">
        Click a role to configure which tabs are visible for that role.
      </p>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => handleSelectRole(role)}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  role.isDefault
                    ? "bg-gradient-to-br from-orange-400 to-amber-500"
                    : "bg-gradient-to-br from-blue-400 to-indigo-500"
                }`}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>

              {/* Info */}
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
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {(role.tabs || DEFAULT_TAB_CONFIG[role.id] || []).length} tabs enabled
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition shrink-0" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {roles.length === 0 && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No roles found. Add roles from Role Settings first.</p>
        </div>
      )}
    </div>
  );
}
