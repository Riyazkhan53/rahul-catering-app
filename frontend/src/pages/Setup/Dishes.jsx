import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import CardButton from "../../Components/CardButton";
import AddDish from "./AddDish";
import ManageDishes from "./ManageDishes";
import { PlusCircle, ChefHat } from "lucide-react";

export default function Dishes() {
  const [open, setOpen] = useState(null); // "add" | "manage"
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AnimatedPage>
      {open !== "manage" && (
        <div className="card p-5 sm:p-6 text-app w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <CardButton
              icon={PlusCircle}
              title="Add New Dish"
              description="Create a new food dish"
              onClick={() => setOpen("add")}
            />

            <CardButton
              icon={ChefHat}
              title="Manage Dishes"
              description="View, edit or remove dishes by category"
              onClick={() => setOpen("manage")}
            />
          </div>
        </div>
      )}

      {open === "add" && (
        <AddDish
          onClose={() => setOpen(null)}
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {open === "manage" && (
        <ManageDishes
          key={refreshKey}
          onBack={() => setOpen(null)}
        />
      )}
    </AnimatedPage>
  );
}
