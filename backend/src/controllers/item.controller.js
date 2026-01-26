import Item from "../models/Item.js";

/* ---------------------------
   CREATE / UPSERT
---------------------------- */
export async function upsertItem(req, res) {
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
}

/* ---------------------------
   UPDATE
---------------------------- */
export async function updateItem(req, res) {
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
}

/* ---------------------------
   HARD DELETE
---------------------------- */
export async function deleteItem(req, res) {
  const body = req.body;

  const result = await Item.findOneAndDelete({ id: body.id });

  if (!result) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json({ success: true });
}

/* ---------------------------
   GET ALL
---------------------------- */
export async function getItems(req, res) {
  res.set("Cache-Control", "no-store");
  const items = await Item.find().sort({ updatedAt: -1 });
  res.json(items);
}