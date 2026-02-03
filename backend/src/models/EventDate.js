import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: String,
    client: String,
    contact: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const EventDateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    events: [EventSchema]
  },
  { timestamps: true }
);

export default mongoose.model("event_dates", EventDateSchema);