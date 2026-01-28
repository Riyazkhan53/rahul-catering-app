import { TAMIL_MEANING_MAP } from "./tamilMeaningMap";
import { toTamil as transliterateTamil } from "./tamilTransliterate";

export function toTamilSmart(text) {
  if (!text) return "";

  // Split by space or comma but keep separators
  const rawTokens = text.split(/(\s+|,\s*)/);

  const result = [];
  let i = 0;

  while (i < rawTokens.length) {
    const token = rawTokens[i];

    // Preserve spaces / commas
    if (token.match(/^\s+$|^,\s*$/)) {
      result.push(token);
      i++;
      continue;
    }

    // Normalize current word
    const current = normalize(token);

    // 🔍 Try phrase match: current + next
    const nextToken = rawTokens[i + 1];
    const nextWord =
      nextToken && !nextToken.match(/^\s+$|^,\s*$/)
        ? normalize(nextToken)
        : null;

    if (nextWord) {
      const phraseKey = `${current}_${nextWord}`;

      // ✅ Longest phrase match FIRST
      if (TAMIL_MEANING_MAP[phraseKey]) {
        result.push(TAMIL_MEANING_MAP[phraseKey]);
        i += 2;
        continue;
      }
    }

    // ✅ Single word meaning
    if (TAMIL_MEANING_MAP[current]) {
      result.push(TAMIL_MEANING_MAP[current]);
    } else {
      // 🔁 Transliteration fallback
      result.push(transliterateTamil(token));
    }

    i++;
  }

  return result.join("");
}

// Helper
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, "_");
}