import { useState, useEffect } from "react";
import { getAllDishes } from "../../db/indexedDB";
import { dishCategories } from "../../utils/picklist";
import BackHeader from "../../Components/BackHeader";
import { ChefHat, UtensilsCrossed, Search, FileX2 } from "lucide-react";

const CATEGORY_ICONS = {
  starter: "🍢",
  main_course: "🍛",
  bread: "🫓",
  rice: "🍚",
  side_dish: "🥗",
  dessert: "🍮",
  beverage: "☕",
  snack: "🍿",
  chutney_raita: "🫙",
  salad: "🥬",
};

export default function ManageDishes({ onBack }) {
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    const all = await getAllDishes();
    setDishes(all);
  };

  // Count dishes per category
  const getCategoryCount = (catValue) => {
    return dishes.filter((d) => d.category === catValue).length;
  };

  // Get dishes for selected category
  const getCategoryDishes = () => {
    if (!selectedCategory) return [];
    let filtered = dishes.filter((d) => d.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.tamilName?.toLowerCase().includes(q) ||
          d.code?.toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const categoryLabel = dishCategories.find((c) => c.value === selectedCategory)?.label || "";

  // Category cards view
  if (!selectedCategory) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {dishCategories.map((cat) => {
            const count = getCategoryCount(cat.value);
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className="card p-4 sm:p-5 text-left hover:scale-[1.02] active:scale-[0.98] transition
                           border border-white/20 dark:border-gray-700 shadow-md group"
              >
                <div className="text-3xl sm:text-4xl mb-2">
                  {CATEGORY_ICONS[cat.value] || "🍽️"}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-app leading-tight">
                  {cat.label}
                </h3>
                <p className="text-xs opacity-60 mt-1">
                  {count === 0
                    ? "No dishes yet"
                    : `${count} dish${count > 1 ? "es" : ""}`}
                </p>
                <div className="mt-2 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.min(count * 10, 100)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dishes list for selected category
  const categoryDishes = getCategoryDishes();

  return (
    <div className="space-y-4">
      <BackHeader
        title={categoryLabel}
        onBack={() => {
          setSelectedCategory(null);
          setSearch("");
        }}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Dishes list or empty state */}
      {categoryDishes.length === 0 ? (
        <div className="card p-8 sm:p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
            <FileX2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-300 dark:text-orange-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Dishes Found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            {search
              ? `No dishes matching "${search}" in ${categoryLabel}`
              : `No dishes added in ${categoryLabel} yet. Go to "Add New Dish" to create one.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categoryDishes.map((dish) => (
            <div
              key={dish.dishId}
              className="card p-4 flex items-center gap-4 border border-white/10 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                <ChefHat className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base text-app truncate">
                    {dish.name}
                  </h4>
                  {dish.code && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-mono shrink-0">
                      {dish.code}
                    </span>
                  )}
                </div>
                {dish.tamilName && (
                  <p className="text-xs opacity-60 truncate">{dish.tamilName}</p>
                )}
                {dish.description && (
                  <p className="text-xs opacity-50 mt-0.5 truncate">{dish.description}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  ₹{dish.costPerPerson}
                </span>
                <p className="text-[10px] opacity-50">per person</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
