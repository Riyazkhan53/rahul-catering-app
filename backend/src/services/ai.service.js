// backend/src/services/ai.service.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

let openai = null;
function getOpenAI() {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY not configured");
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

/* ---------- HELPERS ---------- */
function safeJsonParse(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

// Very simple Tamil detector
function containsTamil(text = "") {
  return /[\u0B80-\u0BFF]/.test(text);
}

/* ---------- MAIN ---------- */
export async function generateItemDetails(name) {
  try {
    const systemPrompt = `You are a Tamil translation API for a South Indian catering & grocery management app.
Your job is to return the correct Tamil name for food items, ingredients, spices, vegetables, utensils, and catering supplies.

CRITICAL RULES:
1. tamilName MUST be the real Tamil word written in Tamil script (Unicode). NOT English transliteration.
2. For food/grocery items use the commonly known Tamil name that a Tamil-speaking cook or caterer would use.
3. description must be in English only — a short 1-line description of the item in catering context.
4. category must be in English only — one of: Vegetables, Fruits, Spices, Grains, Pulses, Dairy, Oils, Meat, Seafood, Sweeteners, Flours, Beverages, Utensils, Services, General.
5. Return ONLY valid JSON. No markdown, no explanation, no extra text.

EXAMPLES:
- "Onion" → {"tamilName":"வெங்காயம்","description":"Essential base vegetable for curries and gravies","category":"Vegetables"}
- "Turmeric Powder" → {"tamilName":"மஞ்சள் தூள்","description":"Yellow spice powder used in all South Indian cooking","category":"Spices"}
- "Ghee" → {"tamilName":"நெய்","description":"Clarified butter used in rice, sweets and cooking","category":"Oils"}
- "Chicken" → {"tamilName":"கோழி","description":"Poultry meat used in biryani, curry and fry","category":"Meat"}
- "Coconut" → {"tamilName":"தேங்காய்","description":"Used in chutneys, gravies and sweets","category":"Fruits"}
- "Sambar Powder" → {"tamilName":"சாம்பார் பொடி","description":"Spice mix for preparing sambar","category":"Spices"}`;

    const userPrompt = `Item name: "${name}"`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content;
    const data = safeJsonParse(raw);

    /* ---------- HARD VALIDATION ---------- */

    // If description accidentally comes in Tamil → wipe it
    if (containsTamil(data.description)) {
      data.description = "";
    }

    // If category accidentally comes in Tamil → fallback
    if (containsTamil(data.category)) {
      data.category = "General";
    }

    return {
      tamilName: data.tamilName || "",
      description: data.description || "",
      category: data.category || "General",
    };

  } catch (err) {
    console.error("AI ERROR:", err.message);

    // 🔒 NEVER BREAK APP
    return {
      tamilName: "",
      description: "",
      category: "General",
    };
  }
}