import Sanscript from "sanscript";
import { TAMIL_FOOD_MAP } from "./tamilFoodMap";

export function toTamil(text) {
  if (!text) return "";

  const key = text.toLowerCase().trim();

  // 1️⃣ Exact dictionary match
  if (TAMIL_FOOD_MAP[key]) {
    return TAMIL_FOOD_MAP[key];
  }

  // 2️⃣ Fallback transliteration (best effort)
  try {
    return Sanscript.t(key, "itrans", "tamil");
  } catch {
    return "";
  }
}