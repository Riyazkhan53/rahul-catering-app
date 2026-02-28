import DeleteConfirmModalBase from "../../../Components/DeleteConfirmModal";

export default function DeleteConfirmModal({ item, onConfirm, onClose }) {
  return (
    <DeleteConfirmModalBase
      open={true}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Item"
      message={`Are you sure you want to delete "${item?.name}"? This action cannot be undone.`}
    />
  );
}