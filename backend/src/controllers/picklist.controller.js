import Picklist from "../models/Picklist.js";

/* ---------------- GET ---------------- */
export async function getPicklist(req, res) {
  const { picklist } = req.params;
  const { category } = req.query;

  const filter = { picklist, active: true };
  if (category) filter.category = category;

  const items = await Picklist.find(filter).sort({ order: 1 });
  res.json(items);
}

/* ---------------- ADD ---------------- */
export async function addPicklistItem(req, res) {
  const { picklist } = req.params;

  const item = await Picklist.create({
    ...req.body,
    picklist,
  });

  res.json(item);
}

/* ---------------- UPDATE ---------------- */
export async function updatePicklistItem(req, res) {
  const { picklist, id } = req.params;

  const item = await Picklist.findOneAndUpdate(
    { _id: id, picklist },
    req.body,
    { new: true, runValidators: true }
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in picklist" });
  }

  res.json(item);
}

/* ---------------- DELETE ---------------- */
export async function deletePicklistItem(req, res) {
  const { picklist, id } = req.params;

  const result = await Picklist.findOneAndDelete({
    _id: id,
    picklist,
  });

  if (!result) {
    return res.status(404).json({ message: "Item not found in picklist" });
  }

  res.json({ success: true });
}