import Role from "../models/Role.js";

// Default roles to seed
const DEFAULT_ROLES = [
  {
    roleId: "admin",
    label: "Admin",
    description: "Full access to all features",
    isDefault: true,
    tabs: ["dashboard", "orders", "menu", "settings", "setup", "appsettings"],
    permissions: {
      menu: { create: true, modify: true, delete: true, approve: true },
      items: { create: true, modify: true, delete: true, approve: true },
      billing: { create: true, modify: true, delete: true, approve: true },
    },
  },
  {
    roleId: "chef",
    label: "Chef",
    description: "Kitchen & order management",
    isDefault: true,
    tabs: ["dashboard", "menu", "orders", "add-order", "listcreator", "invoice", "appsettings"],
    permissions: {
      menu: { create: true, modify: true, delete: false, approve: false },
      items: { create: true, modify: true, delete: false, approve: false },
      billing: { create: false, modify: false, delete: false, approve: false },
    },
  },
];

/**
 * Seed default roles if they don't exist
 */
async function seedDefaults() {
  for (const def of DEFAULT_ROLES) {
    const exists = await Role.findOne({ roleId: def.roleId });
    if (!exists) {
      await Role.create(def);
    }
  }
}

/**
 * GET /api/roles — List all roles (seeds defaults first)
 */
export const getRoles = async (req, res) => {
  try {
    await seedDefaults();
    const roles = await Role.find().sort({ isDefault: -1, createdAt: 1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch roles" });
  }
};

/**
 * GET /api/roles/:roleId — Get single role
 */
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ roleId: req.params.roleId });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch role" });
  }
};

/**
 * POST /api/roles — Create a new role
 */
export const createRole = async (req, res) => {
  try {
    const { roleId, label, description, tabs, permissions } = req.body;

    if (!roleId || !label) {
      return res.status(400).json({ message: "roleId and label are required" });
    }

    const exists = await Role.findOne({ roleId });
    if (exists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      roleId,
      label,
      description: description || "",
      isDefault: false,
      tabs: tabs || ["dashboard", "appsettings"],
      permissions: permissions || {
        menu: { create: false, modify: false, delete: false, approve: false },
        items: { create: false, modify: false, delete: false, approve: false },
        billing: { create: false, modify: false, delete: false, approve: false },
      },
    });

    res.json({ message: `Role "${label}" created`, role });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create role" });
  }
};

/**
 * PUT /api/roles/:roleId — Update a role
 */
export const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { label, description, tabs, permissions } = req.body;

    const role = await Role.findOne({ roleId });
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (label !== undefined) role.label = label;
    if (description !== undefined) role.description = description;
    if (tabs !== undefined) role.tabs = tabs;
    if (permissions !== undefined) role.permissions = permissions;

    await role.save();

    res.json({ message: `Role "${role.label}" updated`, role });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update role" });
  }
};

/**
 * DELETE /api/roles/:roleId — Delete a custom role (cannot delete defaults)
 */
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findOne({ roleId: req.params.roleId });
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.isDefault) {
      return res.status(400).json({ message: "Cannot delete default roles" });
    }

    await Role.deleteOne({ roleId: req.params.roleId });
    res.json({ message: `Role "${role.label}" deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete role" });
  }
};
