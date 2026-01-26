import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    id : { type:String, required:true, unique:true },
    code: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    tamilName: String,

    category: {
      type: String,
      enum: ["essentials", "veg", "nonveg", "dessert", "service"],
      required: true,
    },

    description: String,
    price: Number,
    unit: String,
    defaultQuantity: Number,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Item", ItemSchema);