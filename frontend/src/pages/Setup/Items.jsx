import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import CardButton from "../../Components/CardButton";
import BackHeader from "../../Components/BackHeader";
import AddItem from "./AddItem";
import MasterList from "../Common/MasterList";
import Modal from "../../Components/Modal";
import { PlusCircle, List } from "lucide-react";

export default function Items() {
  const [open, setOpen] = useState(null); // "add" | "list"

  return (
    <AnimatedPage>
      {open != "list" && <div className="card p-6 text-app w-full">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardButton
            icon={PlusCircle}
            title="Add New Item"
            description="Create a new food or service item"
            onClick={() => setOpen("add")}
          />

          <CardButton
            icon={List}
            title="Items Master List"
            description="View, edit or remove items"
            onClick={() => setOpen("list")}
          />
        </div>
      </div>}

      {open === "add" && (
        <Modal title="Add New Item" onClose={() => setOpen(null)}>
          <AddItem />
        </Modal>
      )}

      {open === "list"  && (
              <div className="w-full max-w-5xl">
                <BackHeader title="Master Items List" onBack={() => setOpen(null)} />
                <MasterList/>
              </div>
            )}

      {/* {open === "list" && (
        <Modal title="Items Master List" onClose={() => setOpen(null)}>
          <ItemsList />
        </Modal>
      )} */}
    </AnimatedPage>
  );
}