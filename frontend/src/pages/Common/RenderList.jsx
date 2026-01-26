import { useState } from "react";
import { Info, Pencil, Trash2 } from "lucide-react";
import ItemDetails from "./ItemDetails";
import EditItemModal from "./ItemsControl/EditItemModel";
import DeleteConfirmModal from "./ItemsControl/DeleteConfirmModel";
import Modal from "../../Components/Modal";

export default function ItemsList({ items, onEdit, onDelete }) {
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-sm opacity-70">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Tamil</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr key={item.itemId} className="border-b">
              <td className="px-4 py-3 font-medium">{item.name}</td>
              <td className="px-4 py-3">{item.tamilName}</td>

              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">

                  <button onClick={() => setViewItem(item)}>
                    <Info size={18} />
                  </button>

                  <button onClick={() => setEditItem(item)}>
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => setDeleteItem(item)}>
                    <Trash2 size={18} />
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewItem && (
        <Modal title="Item Details" onClose={() => setViewItem(null)}>
          <ItemDetails item={viewItem} />
        </Modal>
      )}

      {editItem && (
        <EditItemModal
          item={editItem}
          onSave={(data) => {onEdit(data)
            setEditItem(null)
          }
          }
          onClose={() => {setEditItem(null)
            setEditItem(null)}
          }
        />
      )}

      {deleteItem && (
        <DeleteConfirmModal
          item={deleteItem}
          onConfirm={() => {onDelete()
            setDeleteItem(null)
          }}
          onClose={() => {setDeleteItem(null) 
            setDeleteItem(null)}}
        />
      )}
    </>
  );
}