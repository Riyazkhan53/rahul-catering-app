const CATEGORY_CODE_MAP = {
  essentials: "ES",
  veg: "VG",
  nonveg: "NV",
  dessert: "DS",
  service: "SV"
};

export function generateNextItemCode(items, category) {
  const prefix = CATEGORY_CODE_MAP[category] || "OT";

  if (!items.length) return `IT-${prefix}-01`;

  const numbers = items.map((item) =>
    parseInt(item.code.split("-").pop(), 10)
  );

  const next = Math.max(...numbers) + 1;
  return `IT-${prefix}-${String(next).padStart(2, "0")}`;
}