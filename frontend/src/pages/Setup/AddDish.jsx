import { useState, useEffect } from "react";
import { saveDish, getDishesByCategory } from "../../db/indexedDB";
import { aiService } from "../../api/service";
import { useToast } from "../../context/ToastContext";
import { toTamilSmart } from "../../utils/toTamilSmart";
import { uuid } from "../../utils/uuid";
import { dishCategories } from "../../utils/picklist";
import Modal from "../../Components/BasicComponents/Modal";
import ModalCard from "../../Components/BasicComponents/ModalCard";
import { Input, Select, Textarea, FormField, PrimaryButton } from "../../Components/BasicComponents/index";

export default function AddDish({ onClose, onSaved }) {
  const { showToast } = useToast();
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    dishId: uuid(),
    name: "",
    tamilName: "",
    category: "",
    description: "",
    costPerPerson: "",
  });

  const [code, setCode] = useState("");

  useEffect(() => {
    if (!form.category) return;

    (async () => {
      const dishes = await getDishesByCategory(form.category);
      const cat = dishCategories.find((c) => c.value === form.category);
      const prefix = cat?.code || "OT";

      if (!dishes.length) {
        setCode(`DH-${prefix}-01`);
      } else {
        const numbers = dishes
          .filter((d) => d.code)
          .map((d) => parseInt(d.code.split("-").pop(), 10) || 0);
        const next = numbers.length ? Math.max(...numbers) + 1 : 1;
        setCode(`DH-${prefix}-${String(next).padStart(2, "0")}`);
      }
    })();
  }, [form.category]);

  const handleAIGenerate = async () => {
    if (!form.name) {
      showToast("Enter dish name first", "error");
      return;
    }

    try {
      setAiLoading(true);
      const res = await aiService.autoGenerateItem(form.name);
      setForm((prev) => ({
        ...prev,
        tamilName: res.tamilName || prev.tamilName,
        description: res.description || prev.description,
      }));
      showToast("AI generated details", "success");
    } catch (err) {
      showToast("AI generation failed", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.costPerPerson) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const dishPayload = {
      ...form,
      code,
      costPerPerson: Number(form.costPerPerson),
      updatedAt: Date.now(),
    };

    await saveDish(dishPayload);
    showToast("Dish saved successfully", "success");

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalCard
          title="Add New Dish"
          onClose={onClose}
          footer={
            <PrimaryButton type="submit">
              Save Dish
            </PrimaryButton>
          }
        >
          <FormField label="Dish Name (English)">
            <div className="relative flex items-center gap-2">
              <Input
                placeholder="Enter dish name"
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

              {/* AI BUTTON */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !form.name}
                  className="
                    flex items-center gap-1
                    px-3 py-2 rounded-md
                    border border-orange-300
                    bg-orange-50 text-orange-600
                    text-sm font-semibold
                    hover:bg-orange-100 hover:shadow-sm
                    active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                >
                  {aiLoading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <>✨ <span>AI</span></>
                  )}
                </button>

                {/* TOOLTIP */}
                <div
                  className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    whitespace-nowrap
                    rounded-md bg-black text-white text-xs
                    px-2 py-1
                    opacity-0 group-hover:opacity-100
                    pointer-events-none
                    transition
                  "
                >
                  Generate Tamil name & description
                </div>
              </div>
            </div>
          </FormField>

          <FormField label="Dish Name (Tamil)">
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
              {dishCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Dish Code">
            <Input value={code} disabled />
          </FormField>

          <FormField label="Cost per Person (₹)">
            <Input
              type="number"
              placeholder="₹ Cost per person"
              value={form.costPerPerson}
              onChange={(e) => handleChange("costPerPerson", e.target.value)}
              required
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Short description of the dish"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormField>
        </ModalCard>
      </form>
    </Modal>
  );
}
