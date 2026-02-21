import GeneratedMenuPlan from "../models/GeneratedMenuPlan.js";

export async function upsertGeneratedMenuPlan(req, res) {
  try {
    const data = req.body;

    if (!data?.id) {
      return res.status(400).json({ message: "Menu plan id required" });
    }

    const saved = await GeneratedMenuPlan.findOneAndUpdate(
      { id: data.id },
      data,
      { upsert: true, new: true }
    );

    res.json({ success: true, id: saved.id });
  } catch (err) {
    console.error("MENUPLAN UPSERT ERROR:", err);
    res.status(500).json({ message: "Failed to save menu plan" });
  }
}

export async function getGeneratedMenuPlan(req, res) {
  try {
    const { id } = req.params;
    const doc = await GeneratedMenuPlan.findOne({ id });

    if (!doc) {
      return res.status(404).json({ message: "Menu plan not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error("MENUPLAN FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch menu plan" });
  }
}

export async function getAllGeneratedMenuPlans(req, res) {
  try {
    const docs = await GeneratedMenuPlan.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(docs);
  } catch (err) {
    console.error("GET MENUPLANS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch menu plans" });
  }
}
