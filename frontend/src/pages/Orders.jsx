import { useState } from "react";
import AnimatedPage from "./AnimatedPage";
import CardButton from "../Components/CardButton";
import BackHeader from "../Components/BackHeader";
import {
  ClipboardList,
  CalendarDays,
  UtensilsCrossed,
  ListChecks,
} from "lucide-react";
import OrdersCalender from "./Orderpage/OrderCalender";
import CreatedItemLists from "./Orderpage/CreatedItemList";
import CreatedMenuList from "./Orderpage/CreatedMenuList";

export default function Orders() {
  const [orderSelected, setOrderSelected] = useState(null);

  return (
    <AnimatedPage>
      {!orderSelected && (
        <div className="card p-6 text-app w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-400" />
            Orders Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardButton
              icon={CalendarDays}
              title="Orders Calendar"
              description="View, create and manage orders by date"
              onClick={() => setOrderSelected("calendar")}
            />

            <CardButton
              icon={UtensilsCrossed}
              title="Menu List Manager"
              description="Plan dishes and menus for each order"
              onClick={() => setOrderSelected("menu")}
            />

            <CardButton
              icon={ListChecks}
              title="Item List Manager"
              description="Generated ingredient & service item lists"
              onClick={() => setOrderSelected("items")}
            />
          </div>
        </div>
      )}

      {orderSelected === "calendar" && (
        <div className="w-full max-w-5xl">
          <BackHeader
            title="Orders Calendar"
            subtitle="Plan and track orders by date"
            onBack={() => setOrderSelected(null)}
          />
          <OrdersCalender />
        </div>
      )}

      {orderSelected === "menu" && (
        <div className="w-full max-w-5xl">
          <BackHeader
            title="Menu List Manager"
            subtitle="Select dishes and build menus for orders"
            onBack={() => setOrderSelected(null)}
          />
          <CreatedMenuList/>
        </div>
      )}

      {orderSelected === "items" && (
        <div className="w-full max-w-5xl">
          <BackHeader
            title="Item List Manager"
            subtitle="Finalize ingredients & quantities for orders"
            onBack={() => setOrderSelected(null)}
          />
          <CreatedItemLists/>
        </div>
      )}
    </AnimatedPage>
  );
}