import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import Items from "./Items";
import CardButton from "../../Components/CardButton";
import BackHeader from "../../Components/BackHeader";
import { Package, UtensilsCrossed, ClipboardList } from "lucide-react";

export default function Setup() {
  const [itemOpen, setItemOpen] = useState(false);
  const [dishesOpen, setDishesOpen] = useState(false);

  return (
    <AnimatedPage>
      {!itemOpen && !dishesOpen && (
        <div className="card p-6 text-app w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-400" />
            Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardButton
              icon={Package}
              title="Items Setup"
              description="Manage raw items & services"
              onClick={() => setItemOpen(true)}
            />

            <CardButton
              icon={UtensilsCrossed}
              title="Dishes Setup"
              description="Create & manage food dishes"
              onClick={() => setDishesOpen(true)}
            />
          </div>
        </div>
      )}

      {itemOpen && (
        <div className="w-full max-w-5xl">
          <BackHeader title="Items Setup" onBack={() => setItemOpen(false)} />
          <Items />
        </div>
      )}

      {dishesOpen && (
        <div className="w-full max-w-5xl">
          <BackHeader title="Dishes Setup" onBack={() => setDishesOpen(false)} />
          {/* <Dishes /> – future */}
        </div>
      )}
    </AnimatedPage>
  );
}