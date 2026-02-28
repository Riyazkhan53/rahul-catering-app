import Item from "../models/Item.js";

/* ---------------------------
   CREATE / UPSERT
---------------------------- */
export async function upsertItem(req, res) {
  try {
    const data = req.body;

    if (!data.code) {
      return res.status(400).json({ message: "Item code required" });
    }

    const item = await Item.findOneAndUpdate(
      { code: data.code },
      data,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json(item);
  } catch (err) {
    console.error("upsertItem error:", err);
    res.status(500).json({ message: "Failed to save item" });
  }
}

/* ---------------------------
   UPDATE
---------------------------- */
export async function updateItem(req, res) {
  try {
    const body = req.body;

    const item = await Item.findOneAndUpdate(
      { id: body.id },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({ message: `Item not found ${body.id}`});
    }

    res.json(item);
  } catch (err) {
    console.error("updateItem error:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
}

/* ---------------------------
   HARD DELETE
---------------------------- */
export async function deleteItem(req, res) {
  try {
    const body = req.body;

    const result = await Item.findOneAndDelete({ id: body.id });

    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteItem error:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
}

/* ---------------------------
   GET ALL
---------------------------- */
export async function getItems(req, res) {
  try {
    res.set("Cache-Control", "no-store");
    const items = await Item.find().sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("getItems error:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
}