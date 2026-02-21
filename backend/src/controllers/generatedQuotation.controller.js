import GeneratedQuotation from "../models/GeneratedQuotation.js";

export async function upsertGeneratedQuotation(req, res) {
  try {
    const data = req.body;

    if (!data?.id) {
      return res.status(400).json({ message: "Quotation id required" });
    }

    const saved = await GeneratedQuotation.findOneAndUpdate(
      { id: data.id },
      data,
      { upsert: true, new: true }
    );

    res.json({ success: true, id: saved.id });
  } catch (err) {
    console.error("QUOTATION UPSERT ERROR:", err);
    res.status(500).json({ message: "Failed to save quotation" });
  }
}

export async function getGeneratedQuotation(req, res) {
  try {
    const { id } = req.params;
    const doc = await GeneratedQuotation.findOne({ id });

    if (!doc) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error("QUOTATION FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch quotation" });
  }
}

export async function getAllGeneratedQuotations(req, res) {
  try {
    const docs = await GeneratedQuotation.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(docs);
  } catch (err) {
    console.error("GET QUOTATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch quotations" });
  }
}
