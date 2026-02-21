import { useEffect, useState } from "react";
import {
  Shield, ChevronRight, ChevronLeft, Check, Loader2,
  LayoutDashboard, UtensilsCrossed, ClipboardList, PlusCircle,
  FileText, Receipt, Settings, Wrench, Sparkles,
} from "lucide-react";
import { getAllUserRoles, saveUserRole } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

// All available sidebar tabs
const ALL_TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Home dashboard with overview" },
  { key: "orders", label: "Orders Management", icon: ClipboardList, description: "View and manage all orders" },
  { key: "menu", label: "Menu & Items Catalogue", icon: UtensilsCrossed, description: "Browse menu items and dishes" },
  { key: "add-order", label: "New Order", icon: PlusCircle, description: "Create new orders" },
  { key: "listcreator", label: "Item/Menu List Creator", icon: FileText, description: "Create item and menu lists" },
  { key: "invoice", label: "Invoice & Billing", icon: Receipt, description: "Manage invoices and billing" },
  { key: "settings", label: "Users/Roles Settings", icon: Settings, description: "User and role management" },
  { key: "setup", label: "Setup", icon: Wrench, description: "App setup and configuration" },
  { key: "appsettings", label: "App Settings", icon: Sparkles, description: "Theme, sync and preferences" },
];

// Default tab config per built-in role
const DEFAULT_TAB_CONFIG = {
  admin: ["dashboard", "orders", "menu", "settings", "setup", "appsettings"],
  chef: ["dashboard", "menu", "orders", "add-order", "listcreator", "invoice", "appsettings"],
};

// Permission sections — each has Create, Modify, Delete, Approve
const PERMISSION_SECTIONS = [
  { key: "menu", label: "Menu", icon: UtensilsCrossed, color: "from-emerald-400 to-green-500" },
  { key: "items", label: "Items", icon: ClipboardList, color: "from-blue-400 to-indigo-500" },
  { key: "billing", label: "Billing", icon: Receipt, color: "from-purple-400 to-violet-500" },
];

const PERMISSION_ACTIONS = [
  { key: "create", label: "Create" },
  { key: "modify", label: "Modify" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
];

// Setup tabs inside role detail
const SETUP_TABS = [
  { key: "general", label: "General Setup" },
  { key: "menu", label: "Menu" },
  { key: "items", label: "Items" },
  { key: "billing", label: "Billing" },
];

// Default permissions for built-in roles
const DEFAULT_PERMISSIONS = {
  admin: {
    menu: { create: true, modify: true, delete: true, approve: true },
    items: { create: true, modify: true, delete: true, approve: true },
    billing: { create: true, modify: true, delete: true, approve: true },
  },
  chef: {
    menu: { create: true, modify: true, delete: false, approve: false },
    items: { create: true, modify: true, delete: false, approve: false },
    billing: { create: false, modify: false, delete: false, approve: false },
  },
};

function buildDefaultPerms(roleId) {
  return DEFAULT_PERMISSIONS[roleId] || {
    menu: { create: false, modify: false, delete: false, approve: false },
    items: { create: false, modify: false, delete: false, approve: false },
    billing: { create: false, modify: false, delete: false, approve: false },
  };
}

export default function RoleSetup() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [tabConfig, setTabConfig] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [activeSetupTab, setActiveSetupTab] = useState("general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getAllUserRoles();
      const defaults = [
        { id: "admin", label: "Admin", description: "Full access to all features", isDefault: true },
        { id: "chef", label: "Chef", description: "Kitchen & order management", isDefault: true },
      ];
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
    setActiveSetupTab("general");
    setTabConfig([...(role.tabs || DEFAULT_TAB_CONFIG[role.id] || ["dashboard", "appsettings"])]);
    // Deep clone permissions
    const existingPerms = role.permissions || buildDefaultPerms(role.id);
    setPermissions(JSON.parse(JSON.stringify(existingPerms)));
  };

  const handleToggleTab = (tabKey) => {
    setTabConfig((prev) =>
      prev.includes(tabKey) ? prev.filter((k) => k !== tabKey) : [...prev, tabKey]
    );
  };

  const handleTogglePermission = (section, action) => {
    setPermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [action]: !prev[section]?.[action],
      },
    }));
  };

  const handleToggleAllSection = (section, value) => {
    setPermissions((prev) => ({
      ...prev,
      [section]: PERMISSION_ACTIONS.reduce((acc, a) => ({ ...acc, [a.key]: value }), {}),
    }));
  };

  const hasChanges = () => {
    const origTabs = selectedRole.tabs || DEFAULT_TAB_CONFIG[selectedRole.id] || ["dashboard", "appsettings"];
    const origPerms = selectedRole.permissions || buildDefaultPerms(selectedRole.id);
    return (
      JSON.stringify([...tabConfig].sort()) !== JSON.stringify([...origTabs].sort()) ||
      JSON.stringify(permissions) !== JSON.stringify(origPerms)
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      setSaving(true);
      const updated = {
        ...selectedRole,
        tabs: tabConfig,
        permissions,
        updatedAt: Date.now(),
      };
      await saveUserRole(updated);
      showToast(`Configuration saved for "${selectedRole.label}"`, "success");
      setRoles((prev) => prev.map((r) => (r.id === selectedRole.id ? { ...r, tabs: tabConfig, permissions } : r)));
      setSelectedRole((prev) => ({ ...prev, tabs: tabConfig, permissions }));
    } catch (err) {
      showToast("Failed to save config", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setTabConfig([]);
    setPermissions({});
    setActiveSetupTab("general");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3" />
        <p className="text-gray-500 dark:text-gray-400">Loading roles...</p>
      </div>
    );
  }

  /* ==================== DETAIL VIEW ==================== */
  if (selectedRole) {
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
                Configure tabs & permissions
              </p>
            </div>
          </div>
        </div>

        {/* Setup Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
          {SETUP_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSetupTab(tab.key)}
              className={`flex-1 min-w-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeSetupTab === tab.key
                  ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSetupTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeSetupTab === "general" ? (
              /* ---- GENERAL SETUP: Tab visibility ---- */
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Select which sidebar tabs are visible for this role.
                </p>
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
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          isChecked ? "bg-orange-500 border-orange-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                      <Icon className={`w-4 h-4 shrink-0 ${isChecked ? "text-orange-500" : "text-gray-400 dark:text-gray-500"}`} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium ${isChecked ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}>
                          {tab.label}
                        </span>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{tab.description}</p>
                      </div>
                      <input type="checkbox" checked={isChecked} onChange={() => handleToggleTab(tab.key)} className="sr-only" />
                    </motion.label>
                  );
                })}
                <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
                  {tabConfig.length} of {ALL_TABS.length} tabs enabled
                </p>
              </div>
            ) : (
              /* ---- PERMISSION SECTION (Menu / Items / Billing) ---- */
              (() => {
                const section = PERMISSION_SECTIONS.find((s) => s.key === activeSetupTab);
                if (!section) return null;
                const Icon = section.icon;
                const sectionPerms = permissions[section.key] || {};
                const allChecked = PERMISSION_ACTIONS.every((a) => sectionPerms[a.key]);
                const noneChecked = PERMISSION_ACTIONS.every((a) => !sectionPerms[a.key]);

                return (
                  <div className="space-y-4">
                    {/* Section header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${section.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{section.label} Permissions</h4>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            Manage what this role can do with {section.label.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleAllSection(section.key, !allChecked)}
                        className="text-xs font-medium text-orange-500 hover:text-orange-600 transition"
                      >
                        {allChecked ? "Uncheck All" : "Check All"}
                      </button>
                    </div>

                    {/* Permission checkboxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PERMISSION_ACTIONS.map((action) => {
                        const isChecked = !!sectionPerms[action.key];
                        return (
                          <motion.label
                            key={action.key}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? "bg-orange-50 dark:bg-orange-900/10 border-orange-300 dark:border-orange-700"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                isChecked ? "bg-orange-500 border-orange-500" : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm font-medium ${isChecked ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}>
                              {action.label}
                            </span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(section.key, action.key)}
                              className="sr-only"
                            />
                          </motion.label>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {PERMISSION_ACTIONS.filter((a) => sectionPerms[a.key]).length} of {PERMISSION_ACTIONS.length} permissions enabled
                    </p>
                  </div>
                );
              })()
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save button */}
        <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>
      </div>
    );
  }

  /* ==================== LIST VIEW ==================== */
  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Roles ({roles.length})
        </h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 -mt-3">
        Click a role to configure tabs & permissions.
      </p>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {roles.map((role) => {
            const perms = role.permissions || buildDefaultPerms(role.id);
            const totalPerms = PERMISSION_SECTIONS.reduce(
              (sum, s) => sum + PERMISSION_ACTIONS.filter((a) => perms[s.key]?.[a.key]).length, 0
            );
            const maxPerms = PERMISSION_SECTIONS.length * PERMISSION_ACTIONS.length;

            return (
              <motion.div
                key={role.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleSelectRole(role)}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    role.isDefault
                      ? "bg-gradient-to-br from-orange-400 to-amber-500"
                      : "bg-gradient-to-br from-blue-400 to-indigo-500"
                  }`}
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>

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
                  <div className="flex gap-3 mt-1">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      {(role.tabs || DEFAULT_TAB_CONFIG[role.id] || []).length} tabs
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      {totalPerms}/{maxPerms} permissions
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition shrink-0" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {roles.length === 0 && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No roles found. Add roles from Users/Roles Settings first.</p>
        </div>
      )}
    </div>
  );
}
