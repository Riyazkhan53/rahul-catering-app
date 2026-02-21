import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    create: { type: Boolean, default: false },
    modify: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    tabs: {
      type: [String],
      default: ["dashboard", "appsettings"],
    },
    permissions: {
      menu: { type: permissionSchema, default: () => ({}) },
      items: { type: permissionSchema, default: () => ({}) },
      billing: { type: permissionSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;
