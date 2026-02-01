import { useState } from "react";
import { PackageOpen } from "lucide-react";
// import items from "../../utils/items.json";
import RenderList from "../Setup/RenderList";
import { getAllItems } from "../../db/indexedDB";
import { itemsCategory } from "../../utils/picklist";

const TABS = [
  { id: "all", label: "All Items" },
  ...itemsCategory];

export default function ItemsList() {
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };
  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter(item => item.category === activeTab);

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
              ${
                activeTab === tab.id
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
      {filteredItems && filteredItems.length > 0 ? <RenderList items={filteredItems} />: (
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