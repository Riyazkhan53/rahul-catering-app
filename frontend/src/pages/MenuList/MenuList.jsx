import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import CardButton from "../../Components/CardButton";
import BackHeader from "../../Components/BackHeader";
import MasterList from "../Common/MasterList";
import {
  PackageOpen,
  Utensils,
  ClipboardList
} from "lucide-react";
import GenerateRandomList from "../MenuListCreator/GenerateList";

export default function MenuList() {
  const [itemOpen, setItemOpen] = useState(false);
  const [generateListOpen, setGenerateListOpen] = useState(false);

  return (
    <AnimatedPage>
      {!itemOpen && !generateListOpen && (
        <div className="card p-6 text-app w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-400" />
            Menu Master
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardButton
              icon={PackageOpen}
              title="Items Master"
              description="Manage ingredients, raw materials & services"
              onClick={() => setItemOpen(true)}
            />
{/* 
            <CardButton
              icon={Utensils}
              title="Menu Builder"
              description="Create menus & generate item-wise lists"
              onClick={() => setGenerateListOpen(true)}
            /> */}
          </div>
        </div>
      )}

      {itemOpen && (
        <div className="w-full max-w-5xl">
          <BackHeader
            title="Items Master"
            subtitle="Ingredients & services setup"
            onBack={() => setItemOpen(false)}
          />
          <MasterList />
        </div>
      )}

      {/* {generateListOpen && (
        <div className="w-full max-w-5xl">
          <BackHeader
            title="Menu Builder"
            subtitle="Generate lists from dishes & menus"
            onBack={() => setGenerateListOpen(false)}
          />
          <GenerateRandomList />
        </div>
      )} */}
    </AnimatedPage>
  );
}