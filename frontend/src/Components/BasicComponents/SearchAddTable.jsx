import React, { useState } from "react";

const SearchAddTable = () => {
  const dishOptions = [
    "Dish 1",
    "Dish 2",
    "Dish 3",
    "Dish 4",
    "Dish 5",
    "Dish 6",
    "Dish 7",
    "Dish 8",
    "Dish 9",
  ];

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDish, setSelectedDish] = useState("");
  const [otherItem, setOtherItem] = useState("");
  const [items, setItems] = useState([]);

  const filteredDishes = dishOptions.filter((dish) =>
    dish.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectDish = (dish) => {
    setSelectedDish(dish);
    setSearch(dish);
    setShowDropdown(false);
  };

  const handleAdd = () => {
    const itemName = otherItem || selectedDish;
    if (!itemName) return alert("Select or enter item!");

    const newItem = {
      id: items.length + 1,
      name: itemName,
      qty: "",
      amount: "",
    };

    setItems([...items, newItem]);
    setSelectedDish("");
    setOtherItem("");
    setSearch("");
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index);
    const reNumbered = updated.map((item, i) => ({
      ...item,
      id: i + 1,
    }));
    setItems(reNumbered);
  };

  const grandTotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.qty) || 0) * (Number(item.amount) || 0),
    0
  );

  return (
    <div>
      {/* Search Section */}
      <div className="flex gap-3 mb-6 relative">
        <div className="w-56">
          <input
            type="text"
            placeholder="Search Dish..."
            className="border p-2 rounded w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {showDropdown && (
            <div className="border rounded bg-white max-h-40 overflow-y-auto absolute w-56 z-10">
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish, i) => (
                  <div
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectDish(dish)}
                  >
                    {dish}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No dishes found</div>
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Other items"
          className="border p-2 rounded w-48"
          value={otherItem}
          onChange={(e) => setOtherItem(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 rounded"
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <table className="w-full border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">S.No</th>
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const lineTotal =
              (Number(item.qty) || 0) *
              (Number(item.amount) || 0);

            return (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="border p-1 rounded w-20"
                    value={item.qty}
                    onChange={(e) =>
                      handleChange(index, "qty", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="border p-1 rounded w-24"
                    value={item.amount}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  ₹ {lineTotal.toFixed(2)}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 text-lg"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}

          {items.length > 0 && (
            <tr className="bg-gray-100 font-bold">
              <td
                colSpan="4"
                className="border p-2 text-right"
              >
                Grand Total
              </td>
              <td className="border p-2">
                ₹ {grandTotal.toFixed(2)}
              </td>
              <td className="border p-2"></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchAddTable;