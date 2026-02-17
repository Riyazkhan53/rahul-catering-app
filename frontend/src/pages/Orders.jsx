import { useState } from "react";
import AnimatedPage from "./AnimatedPage";
import CardButton from "../Components/CardButton";
import BackHeader from "../Components/BackHeader";
import {
  ClipboardList,
  CalendarDays,
  UtensilsCrossed,
  ListChecks,
  ScrollText,
} from "lucide-react";
import OrdersCalender from "./Orderpage/OrderCalender";
import CreatedItemLists from "./Orderpage/CreatedItemList";
import CreatedMenuList from "./Orderpage/CreatedMenuList";
import OrderMasterList from "./Orderpage/OrderMasterList";

export default function Orders({ setActiveTab, setOrderPrefill }) {
  const [orderSelected, setOrderSelected] = useState(null);

  return (
    <AnimatedPage>
      {!orderSelected && (
        <div className="card p-4 sm:p-6 text-app w-full max-w-5xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 dark:text-orange-500" />
            Orders Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
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

            <CardButton
              icon={ScrollText}
              title="Order Master List"
              description="View all created orders"
              onClick={() => setOrderSelected("order-list")}
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
          <OrdersCalender onCreateOrder={(date) => {
            setOrderPrefill({ date, days: 1 });
            setActiveTab("add-order");
          }} />
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

      {orderSelected === "order-list" && (
        <div className="w-full max-w-5xl">
          <BackHeader
            title="Order Master List"
            onBack={() => setOrderSelected(null)}
          />
          <OrderMasterList />
        </div>
      )}
    </AnimatedPage>
  );
}