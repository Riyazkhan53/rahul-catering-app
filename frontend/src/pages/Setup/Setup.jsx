import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import Items from "./Items";
import Dishes from "./Dishes";
import PicklistManager from "./PicklistManager";
import RoleSettings from "./RoleSettings";
import CardButton from "../../Components/CardButton";
import BackHeader from "../../Components/BackHeader";
import { Package, UtensilsCrossed, ClipboardList, Database, Shield } from "lucide-react";

export default function Setup() {
  const [itemOpen, setItemOpen] = useState(false);
  const [dishesOpen, setDishesOpen] = useState(false);
  const [masterDataOpen, setMasterDataOpen] = useState(false);
  const [roleSettingsOpen, setRoleSettingsOpen] = useState(false);

  return (
    <AnimatedPage>
      {!itemOpen && !dishesOpen && !masterDataOpen && !roleSettingsOpen && (
        <div className="card p-5 sm:p-6 text-app w-full max-w-5xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 dark:text-orange-500" />
            Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

            <CardButton
              icon={Database}
              title="Master Data"
              description="Categories, units, event types & more"
              onClick={() => setMasterDataOpen(true)}
            />

            <CardButton
              icon={Shield}
              title="Role Settings"
              description="Manage user roles & permissions"
              onClick={() => setRoleSettingsOpen(true)}
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
          <Dishes />
        </div>
      )}

      {masterDataOpen && (
        <div className="w-full max-w-5xl">
          <BackHeader title="Master Data" subtitle="Manage picklists & categories" onBack={() => setMasterDataOpen(false)} />
          <div className="card p-5 sm:p-6 text-app">
            <PicklistManager />
          </div>
        </div>
      )}

      {roleSettingsOpen && (
        <div className="w-full max-w-5xl">
          <BackHeader title="Role Settings" subtitle="Manage user roles" onBack={() => setRoleSettingsOpen(false)} />
          <div className="card p-5 sm:p-6 text-app">
            <RoleSettings />
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}