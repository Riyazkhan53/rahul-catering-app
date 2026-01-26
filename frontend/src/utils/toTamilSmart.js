import { TAMIL_MEANING_MAP } from "./tamilMeaningMap";
import { toTamil as transliterateTamil } from "./tamilTransliterate";

export function toTamilSmart(text) {
  if (!text) return "";

  function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, "_");
}

const key = normalize(text);

  // Split by space OR comma, but keep delimiters
  const tokens = key.split(/(\s+|,\s*)/);

  return tokens
    .map(token => {
      const cleaned = token.toLowerCase().trim().toLowerCase().replace(/\s+/g, "_");
      

      // Keep spaces / commas as-is
      if (cleaned === "" || token.match(/^\s+$|^,\s*$/)) {
        return token;
      }

      // Meaning dictionary
      if (TAMIL_MEANING_MAP[cleaned]) {
        return TAMIL_MEANING_MAP[cleaned];
      }

      // Fallback transliteration
      return transliterateTamil(cleaned);
    })
    .join("");
}