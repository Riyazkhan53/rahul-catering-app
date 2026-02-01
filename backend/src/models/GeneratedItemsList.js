import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    id: String,           // item uuid
    name: String,
    tamilName: String,
    quantity: Number,
    unit: String,
    comment: String,
  },
  { _id: false }
);

const GeneratedItemListSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // list.id
    name: { type: String },
    date: { type: Date },
    items: [ItemSchema],

    // meta
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "generated_item_lists", // ✅ REQUIRED
  }
);

export default mongoose.model(
  "GeneratedItemList",
  GeneratedItemListSchema
);