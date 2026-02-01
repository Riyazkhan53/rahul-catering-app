import GeneratedItemList from "../models/GeneratedItemsList.js";

/**
 * Create or update a generated list
 * Called BEFORE print/download
 */
export async function upsertGeneratedList(req, res) {
  try {
    const list = req.body;

    if (!list?.id) {
      return res.status(400).json({ message: "List id required" });
    }

    const saved = await GeneratedItemList.findOneAndUpdate(
      { id: list.id },
      list,
      { upsert: true, new: true }
    );

    res.json({ success: true, id: saved.id });
  } catch (err) {
    console.error("LIST UPSERT ERROR:", err);
    res.status(500).json({ message: "Failed to save list" });
  }
}

/**
 * Fetch list for PDF generation
 */
export async function getGeneratedList(req, res) {
  try {
    const { id } = req.params;

    const list = await GeneratedItemList.findOne({ id });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json(list);
  } catch (err) {
    console.error("LIST FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch list" });
  }
}


export async function getAllGeneratedLists(req, res) {
  try {
    const lists = await GeneratedItemList.find({})
      .sort({ createdAt: -1 }) // latest first
      .lean();

    res.json(lists);
  } catch (err) {
    console.error("GET GENERATED LISTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch generated lists" });
  }
}