// backend/src/controllers/ai.controller.js
import { generateItemDetails } from "../services/ai.service.js";

export async function autoGenerateItem(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Item name required" });
    }

    console.log("🤖 AI AUTO GENERATE ITEM:", name);

    const aiData = await generateItemDetails(name);

    res.json({
      success: true,
      ...aiData,
    });
  } catch (err) {
    console.error("❌ AI CONTROLLER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
}