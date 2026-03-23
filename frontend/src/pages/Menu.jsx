import { useState } from "react";
import AnimatedPage from "./AnimatedPage";

const MENU_CATEGORIES = [
  { key: "sweets", label: "Sweets", icon: "🥨" },
  { key: "starters", label: "Starters", icon: "🍟" },
  { key: "main courses", label: "Main Courses", icon: "🍛" },
  { key: "accompaniments", label: "Accompaniments", icon: "🥣" },
  { key: "kerala segment", label: "Kerala Segment", icon: "🥥" },
  { key: "north indian flavours ", label: "North Indian Flavours", icon: "🫓" },
  { key: "village treat", label: "Village Treat", icon: "🌾" },
  { key: "desserts", label: "Desserts", icon: "🍰" },
  { key: "beverages", label: "Beverages", icon: "🥤" },
  { key: "childrens menu", label: "Childrens Menu", icon: "👶" },
  { key: "live counters/others", label: "Live Counters/Others", icon: "🍽️" },
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
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-app">
        🍽️ Menu Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {MENU_CATEGORIES.map(cat => (
          <div
            key={cat.key}
            onClick={() => onSelect(cat)}
            className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-xl p-4 sm:p-6 text-center cursor-pointer
                       hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{cat.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{cat.label}</h3>
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