import { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../../Components/Modal";
import ItemDetails from "./ItemDetails";

export default function ItemsList(items) {debugger
  const [selectedItem, setSelectedItem] = useState(null);
  const renderitems = items.items;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm opacity-70">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Tamil Name</th>
              <th className="py-3 px-4 text-center">Info</th>
            </tr>
          </thead>

          <tbody>
            {renderitems && renderitems.map(item => (
              <tr
                key={item.itemId}
                className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <td className="py-3 px-4 font-medium">
                  {item.name}
                </td>

                <td className="py-3 px-4">
                  {item.tamilName}
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-400/20 transition"
                    title="View item details"
                  >
                    <Info size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-center py-10 opacity-60">
            No items to display
          </p>
        )}
      </div>

      {/* 🔍 Item Details Modal */}
      {selectedItem && (
        <Modal
          title="Item Details"
          onClose={() => setSelectedItem(null)}
        >
          <ItemDetails item={selectedItem} />
        </Modal>
      )}
    </>
  );
}