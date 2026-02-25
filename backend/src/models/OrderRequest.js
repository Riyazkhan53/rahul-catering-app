import mongoose from "mongoose";

const OrderRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    functionType: { type: String, required: true },
    paxCount: { type: Number, required: true },
    dishes: [String],
    services: [String],
    status: {
      type: String,
      enum: ["new", "viewed", "accepted", "rejected"],
      default: "new",
    },
    notes: String,
  },
  {
    timestamps: true,
    collection: "order_requests",
  }
);

export default mongoose.model("OrderRequest", OrderRequestSchema);
