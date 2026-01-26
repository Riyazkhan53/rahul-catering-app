import { useState } from "react";
import Modal from "../../../Components/Modal";

export default function EditItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item.name,
    tamilName: item.tamilName,
    price: item.price,
    unit: item.unit,
    defaultQuantity: item.defaultQuantity,
    description: item.description || "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {debugger
    onSave({
      ...item,
      ...form,
      price: Number(form.price),
      defaultQuantity: Number(form.defaultQuantity),
    });
  };

  return (
    <Modal title="Edit Item" onClose={onClose}>
      <div className="space-y-4">

        <input
          value={form.name}
          onChange={e => handleChange("name", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Item Name"
        />

        <input
          value={form.tamilName}
          onChange={e => handleChange("tamilName", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Tamil Name"
        />

        <input
          type="number"
          value={form.price}
          onChange={e => handleChange("price", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Price"
        />

        <input
          value={form.unit}
          onChange={e => handleChange("unit", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Unit"
        />

        <textarea
          value={form.description}
          onChange={e => handleChange("description", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Description"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}