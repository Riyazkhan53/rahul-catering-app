import { useState, useEffect } from "react";
import {
  saveItem,
  getItemsByCategory
} from "../../db/indexedDB";
import { generateNextItemCode } from "../../utils/codeGen";
import { itemService } from "../../api/service";
import { useToast } from "../../context/ToastContext";
import { toTamilSmart } from "../../utils/toTamilSmart";
import {uuid} from "../../utils/uuid";

export default function AddItem(props) {
  const { onClose } = props;
  const { showToast } = useToast();
  const [form, setForm] = useState({
    id: uuid(),
    name: "",
    tamilName: "",
    category: "",
    description: "",
    defaultQuantity: 1,
    price: "",
    unit: "kg"
  });

  const [code, setCode] = useState("");

  useEffect(() => {
    if (!form.category) return;

    (async () => {
      const items = await getItemsByCategory(form.category);
      const nextCode = generateNextItemCode(items, form.category);
      setCode(nextCode);
    })();
  }, [form.category]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const itemPayload = {
    ...form,
    code,
    price: Number(form.price),
    defaultQuantity: Number(form.defaultQuantity),
    image: null,
    updatedAt: Date.now(),
  };

  // 1️⃣ Always save locally first
  const localItem = {
    ...itemPayload,
    syncStatus: navigator.onLine ? "synced" : "pending",
    serverId: null,
  };

  await saveItem(localItem);

  // 2️⃣ If online → sync immediately
  if (navigator.onLine) {
    await itemService.upsertItem(itemPayload);
  }

  showToast("Item saved successfully", "success");
  resetForm();
};

const resetForm = () => {
  setForm({
    name: "",
    tamilName: "",
    category: "",
    description: "",
    defaultQuantity: 1,
    price: "",
    unit: "kg"
  });
  setCode("");
  onClose()
}


  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
  placeholder="Item Name (English)"
  value={form.name}
  onChange={(e) => {
    const value = e.target.value;

    setForm(prev => ({
      ...prev,
      name: value,
      tamilName: toTamilSmart(value),
    }));
  }}
  className="w-full border px-4 py-2 rounded-lg"
  required
/>

      <input
  placeholder="Item Name (Tamil)"
  value={form.tamilName}
  onChange={(e) => handleChange("tamilName", e.target.value)}
  lang="ta"
  className="w-full border px-4 py-2 rounded-lg"
/>

      <select
        value={form.category}
        onChange={(e) => handleChange("category", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        required
      >
        <option value="">Select Category</option>
        <option value="essentials">Essentials</option>
        <option value="veg">Veg</option>
        <option value="nonveg">Non-Veg</option>
        <option value="dessert">Dessert</option>
        <option value="service">Service</option>
      </select>

      <input
        value={code}
        disabled
        className="w-full border px-4 py-2 rounded-lg bg-gray-100"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <input
        type="number"
        placeholder="Default Quantity"
        value={form.defaultQuantity}
        onChange={(e) => handleChange("defaultQuantity", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => handleChange("price", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
        required
      />

      <input
        placeholder="Unit (kg / plate / nos)"
        value={form.unit}
        onChange={(e) => handleChange("unit", e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <button className="w-full bg-orange-500 text-white py-2 rounded-lg">
        Save Item
      </button>
    </form>
  );
}