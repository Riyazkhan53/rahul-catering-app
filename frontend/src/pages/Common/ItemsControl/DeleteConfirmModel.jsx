import Modal from "../../../Components/Modal";

export default function DeleteConfirmModal({ item, onConfirm, onClose }) {
  return (
    <Modal title="Delete Item" onClose={onClose}>
      <p className="text-sm">
        Are you sure you want to delete  
        <strong> {item.name}</strong>?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}