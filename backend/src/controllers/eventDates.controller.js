import EventDate from "../models/EventDate.js";

/* GET all event dates */
export const getAllEventDates = async (req, res) => {
  try {
    const records = await EventDate.find({});
    res.json(records);
  } catch (err) {
    console.error("getAllEventDates error:", err);
    res.status(500).json({ message: "Failed to fetch event dates" });
  }
};

/* GET events by date */
export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const record = await EventDate.findOne({ date });
    res.json(record || { date, events: [] });
  } catch (err) {
    console.error("getEventsByDate error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/* UPSERT events for a date (add / edit) */
export const saveEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { events } = req.body;

    const record = await EventDate.findOneAndUpdate(
      { date },
      { events },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (err) {
    console.error("saveEventsByDate error:", err);
    res.status(500).json({ message: "Failed to save events" });
  }
};

/* DELETE single event */
export const deleteEventById = async (req, res) => {
  try {
    const { date, eventId } = req.params;

    await EventDate.updateOne(
      { date },
      { $pull: { events: { _id: eventId } } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("deleteEventById error:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};