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
    const prompt = `
You are a backend JSON API.

RULES (STRICT):
- tamilName → Tamil language ONLY
- description → English ONLY
- category → English ONLY
- NO markdown
- NO explanations
- ONLY valid JSON

Schema:
{
  "tamilName": "Tamil text",
  "description": "English text",
  "category": "English category"
}

Item name: "${name}"
`;

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
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