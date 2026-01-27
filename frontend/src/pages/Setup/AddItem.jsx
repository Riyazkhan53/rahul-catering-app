import { useState, useEffect } from "react";
import {
  saveItem,
  getItemsByCategory
} from "../../db/indexedDB";
import { generateNextItemCode } from "../../utils/codeGen";
import { itemService } from "../../api/service";
import { useToast } from "../../context/ToastContext";
import { toTamilSmart } from "../../utils/toTamilSmart";
import { uuid } from "../../utils/uuid";
import Modal from "../../Components/BasicComponents/Modal";
import ModalCard from "../../Components/BasicComponents/ModalCard";
import { Input, Select, Textarea, FormField, PrimaryButton } from "../../Components/BasicComponents/index";

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
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalCard
          title="Add New Item"
          onClose={onClose}
          footer={
            <PrimaryButton type="submit">
              Save Item
            </PrimaryButton>
          }
        >
          <FormField label="Item Name (English)">
            <Input
              placeholder="Enter item name"
              value={form.name}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name: value,
                  tamilName: toTamilSmart(value),
                }));
              }}
              required
            />
          </FormField>

          <FormField label="Item Name (Tamil)">
            <Input
              placeholder="தமிழ் பெயர்"
              value={form.tamilName}
              lang="ta"
              onChange={(e) => handleChange("tamilName", e.target.value)}
            />
          </FormField>

          <FormField label="Category">
            <Select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="essentials">Essentials</option>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
              <option value="dessert">Dessert</option>
              <option value="service">Service</option>
            </Select>
          </FormField>

          <FormField label="Item Code">
            <Input value={code} disabled />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Short description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormField>

          <FormField label="Default Quantity">
            <Input
              type="number"
              value={form.defaultQuantity}
              onChange={(e) => handleChange("defaultQuantity", e.target.value)}
            />
          </FormField>

          <FormField label="Price">
            <Input
              type="number"
              placeholder="₹ Price"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
            />
          </FormField>

          <FormField label="Unit">
            <Input
              placeholder="kg / plate / nos"
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            />
          </FormField>
        </ModalCard>
      </form>
    </Modal>
  );
}