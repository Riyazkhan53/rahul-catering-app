export default function AddItem() {
  return (
    <form className="space-y-4">
      <input
        placeholder="Item name"
        className="w-full px-4 py-2 rounded-lg border bg-transparent
                   focus:ring-2 focus:ring-orange-400"
      />

      <input
        placeholder="Category (Veg / Non-Veg / Dessert)"
        className="w-full px-4 py-2 rounded-lg border bg-transparent"
      />

      <input
        type="number"
        placeholder="Price"
        className="w-full px-4 py-2 rounded-lg border bg-transparent"
      />

      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">
        Save Item
      </button>
    </form>
  );
}