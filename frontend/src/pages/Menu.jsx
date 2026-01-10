import { useState } from "react";
import AnimatedPage from "./AnimatedPage";

const MENU_CATEGORIES = [
  { key: "veg", label: "Veg", icon: "🥦" },
  { key: "nonveg", label: "Non Veg", icon: "🍗" },
  { key: "desserts", label: "Desserts", icon: "🍰" },
  { key: "snacks", label: "Snacks", icon: "🍟" },
  { key: "drinks", label: "Cool Drinks", icon: "🥤" },
  { key: "others", label: "Others", icon: "🍽️" },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <AnimatedPage>
      {!selectedCategory ? (
        <CategoryGrid onSelect={setSelectedCategory} />
      ) : (
        <CategoryItems
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
    </AnimatedPage>
  );
}

/* ---------------- COMPONENTS ---------------- */

function CategoryGrid({ onSelect }) {
  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🍽️ Menu Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {MENU_CATEGORIES.map(cat => (
          <div
            key={cat.key}
            onClick={() => onSelect(cat)}
            className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer
                       hover:scale-105 transition-transform"
          >
            <div className="text-5xl mb-3">{cat.icon}</div>
            <h3 className="text-lg font-semibold">{cat.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryItems({ category, onBack }) {
  return (
    <div className="shadow-xl card p-8 text-app w-full max-w-3xl">
      <button
        onClick={onBack}
        className="text-orange-500 mb-4 font-medium"
      >
        ← Back to Categories
      </button>

      <h2 className="text-2xl font-bold mb-4">
        {category.icon} {category.label}
      </h2>

      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚧</div>
        <p className="text-gray-500">
          Items for <b>{category.label}</b> will be loaded from API soon 👨‍🍳
        </p>
      </div>
    </div>
  );
}