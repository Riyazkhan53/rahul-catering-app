import EventDate from "../models/EventDate.js";

/* GET all event dates */
export const getAllEventDates = async (req, res) => {
  const records = await EventDate.find({});
  res.json(records);
};

/* GET events by date */
export const getEventsByDate = async (req, res) => {
  const { date } = req.params;

  const record = await EventDate.findOne({ date });
  res.json(record || { date, events: [] });
};

/* UPSERT events for a date (add / edit) */
export const saveEventsByDate = async (req, res) => {
  const { date } = req.params;
  const { events } = req.body;

  const record = await EventDate.findOneAndUpdate(
    { date },
    { events },
    { upsert: true, new: true }
  );

  res.json(record);
};

/* DELETE single event */
export const deleteEventById = async (req, res) => {
  const { date, eventId } = req.params;

  await EventDate.updateOne(
    { date },
    { $pull: { events: { _id: eventId } } }
  );

  res.json({ success: true });
};