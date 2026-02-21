import mongoose from "mongoose";

const GeneratedMenuPlanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    planNumber: String,
    eventName: String,
    eventDate: String,
    eventVenue: String,
    numberOfGuests: mongoose.Schema.Types.Mixed,
    numberOfDays: Number,
    days: mongoose.Schema.Types.Mixed,
    generatedDate: String,
    createdAt: Number,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "generated_menu_plans",
  }
);

export default mongoose.model("GeneratedMenuPlan", GeneratedMenuPlanSchema);
