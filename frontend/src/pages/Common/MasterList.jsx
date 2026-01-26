import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import items from "../../utils/items.json";
import RenderList from "./RenderList"
import { getAllItems } from "../../db/indexedDB";
import { updateItem, deleteItem } from "../../db/indexedDB";
import { itemService } from "../../api/service";
import { useToast } from "../../context/ToastContext";

const TABS = [
  { id: "all", label: "All Items" },
  { id: "essentials", label: "Staples & Essentials" },
  { id: "grains_pulses", label: "Grains & Pulses" },
  { id: "oils_fats", label: "Oils & Fats" },
  { id: "spices_whole", label: "Spices (Whole)" },
  { id: "spices_powder", label: "Spices (Powdered)" },
  { id: "dry_fruits", label: "Dry Fruits" },
  { id: "condiments", label: "Condiments" },
  { id: "misc", label: "Miscellaneous" },
  { id: "vegs", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
  { id: "dairy", label: "Dairy Products" },
  { id: "meat", label: "Meat & Poultry" },
  { id: "beverages", label: "Beverages" },
  { id: "snacks", label: "Snacks" },
  { id: "utensils", label: "Utensils" },
];

export default function ItemsList() {
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState([]);
  const {showToast} = useToast();

  const handleEdit = async (item) => {debugger
  await updateItem(item);
  await itemService.updateItem(item.serverId, item);
  await loadItems();
  showToast("Item updated successfully", "success");
};

const handleDelete = async (item) => {
  await deleteItem(item.itemId);
  if (navigator.onLine && item.serverId) {
    await itemService.deleteItem(item.serverId);
  }
  if (!navigator.onLine) {
  showToast("Connect to internet to delete items","error");
  return;
}
  await loadItems();
  showToast("Item deleted successfully", "success");
};

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };
  const visibleItems = items.filter(item => !item.isDeleted);

  const filteredItems =
    activeTab === "all"
      ? visibleItems
      : visibleItems.filter(item => item.category === activeTab);

  return (
    <div className="w-full">

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6 overflow-x-auto hide-scrollbar scroll-smooth">
        {TABS.map(tab => (
          <div key={tab.id} className="flex-shrink-0">
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition
              ${activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-500 hover:text-orange-500"
                }`}
            >
              {tab.label}
            </button>
          </div>
        ))}
      </div>

      {/* Content */}
      {filteredItems && filteredItems.length > 0 ? <RenderList items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete} /> : (
        <div className="flex flex-col items-center justify-center py-16 text-center opacity-80">
          <PackageOpen className="w-12 h-12 mb-4 text-orange-400" />

          <p className="text-lg font-semibold">
            No items to display
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Items added will appear here
          </p>
        </div>)}
    </div>
  );
}