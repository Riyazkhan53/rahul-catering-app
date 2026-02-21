import mongoose from "mongoose";

const GeneratedQuotationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    quotationNumber: String,
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    customerAddress: String,
    eventDates: mongoose.Schema.Types.Mixed,
    services: mongoose.Schema.Types.Mixed,
    total: Number,
    date: String,
    createdAt: Number,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "generated_quotations",
  }
);

export default mongoose.model("GeneratedQuotation", GeneratedQuotationSchema);
