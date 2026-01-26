import mongoose from "mongoose";

const PicklistSchema = new mongoose.Schema(
  {
    picklist: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      default: null,
      index: true,
    },

    code: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 Uniqueness scoped by picklist
PicklistSchema.index(
  { picklist: 1, code: 1 },
  { unique: true }
);

export default mongoose.model("Picklist", PicklistSchema);