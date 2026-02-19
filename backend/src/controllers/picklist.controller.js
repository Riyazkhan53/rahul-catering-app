import Picklist from "../models/Picklist.js";

/* ---------------- GET ALL ------------ */
export async function getAllPicklists(req, res) {
  try {
    const items = await Picklist.find({ active: true }).sort({ picklist: 1, order: 1 });
    res.json(items);
  } catch (err) {
    console.error("getAllPicklists error:", err);
    res.status(500).json({ message: "Failed to fetch picklists" });
  }
}

/* ---------------- GET ---------------- */
export async function getPicklist(req, res) {
  try {
    const { picklist } = req.params;
    const { category } = req.query;

    const filter = { picklist, active: true };
    if (category) filter.category = category;

    const items = await Picklist.find(filter).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    console.error("getPicklist error:", err);
    res.status(500).json({ message: "Failed to fetch picklist" });
  }
}

/* ---------------- ADD ---------------- */
export async function addPicklistItem(req, res) {
  try {
    const { picklist } = req.params;

    const item = await Picklist.create({
      ...req.body,
      picklist,
    });

    res.json(item);
  } catch (err) {
    console.error("addPicklistItem error:", err);
    res.status(500).json({ message: "Failed to add picklist item" });
  }
}

/* ---------------- UPDATE ---------------- */
export async function updatePicklistItem(req, res) {
  try {
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
  } catch (err) {
    console.error("updatePicklistItem error:", err);
    res.status(500).json({ message: "Failed to update picklist item" });
  }
}

/* ---------------- DELETE ---------------- */
export async function deletePicklistItem(req, res) {
  try {
    const { picklist, id } = req.params;

    const result = await Picklist.findOneAndDelete({
      _id: id,
      picklist,
    });

    if (!result) {
      return res.status(404).json({ message: "Item not found in picklist" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deletePicklistItem error:", err);
    res.status(500).json({ message: "Failed to delete picklist item" });
  }
}