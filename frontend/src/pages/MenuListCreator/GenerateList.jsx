import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import CardButton from "../../Components/CardButton";
import BackHeader from "../../Components/BackHeader";
import {
  ClipboardList,
  Boxes,
  UtensilsCrossed,
  FolderOpen
} from "lucide-react";
import GenerateSingleList from "./GenerateSingleList";
import GenerateSingleMenu from "./GenerateSingleMenu";
import ViewSavedLists from "./ViewSavedLists";

export default function GenerateRandomList() {
  const [generateMenuOpen, setGenerateMenuOpen] = useState(false);
  const [generateListOpen, setGenerateListOpen] = useState(false);
  const [viewSavedListsOpen, setViewSavedListsOpen] = useState(false);

  return (
    <AnimatedPage>
      {!generateMenuOpen && !generateListOpen && !viewSavedListsOpen && (
        <div className="card p-6 text-app w-full max-w-5xl overflow-x-hidden">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-400" />
            Menu Builder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardButton
              icon={Boxes}
              title="Generate Item List"
              description="Create ingredient & raw material lists"
              onClick={() => setGenerateListOpen(true)}
            />

            <CardButton
              icon={UtensilsCrossed}
              title="Generate Menu"
              description="Build menus & generate dish-wise requirements"
              onClick={() => setGenerateMenuOpen(true)}
            />

            <CardButton
              icon={FolderOpen}
              title="View Saved Lists"
              description="View and manage saved item lists"
              onClick={() => setViewSavedListsOpen(true)}
            />
          </div>
        </div>
      )}

      {generateListOpen && (
        <div className="w-full max-w-5xl overflow-x-hidden">
          <BackHeader
            title="Item List Generator"
            subtitle="Ingredients & service items"
            onBack={() => setGenerateListOpen(false)}
          />
          <GenerateSingleList/>
        </div>
      )}

      {generateMenuOpen && (
        <div className="w-full max-w-5xl overflow-x-hidden">
          <BackHeader
            title="Menu Generator"
            subtitle="Menus, dishes & quantity planning"
            onBack={() => setGenerateMenuOpen(false)}
          />
          <GenerateSingleMenu/>
        </div>
      )}

      {viewSavedListsOpen && (
        <div className="w-full max-w-5xl overflow-x-hidden">
          <ViewSavedLists onBack={() => setViewSavedListsOpen(false)} />
        </div>
      )}
    </AnimatedPage>
  );
}