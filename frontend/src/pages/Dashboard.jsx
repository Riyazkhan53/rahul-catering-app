import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardHome from "./DashboardHome";
import Orders from "./Orders";
import Menu from "./Menu";
import Settings from "./Settings/Settings";
import Setup from "./Setup/Setup";
import AddOrder from "./AddOrder";
import CreateOrder from "./CreateOrder";
import MenuList from "./MenuList/MenuList";
import Invoice from "./InvoiceBilling/Invoice"
import MenuListCreator from "./MenuListCreator/MenuListCreator"
import useIsDesktop from "../hooks/uselsDesktop";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);


  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const greetingText =
    user?.role === "admin"
      ? `Hi, ${timeGreeting} Admin`
      : `Hi Good Evening Chef ${user?.name} 👨‍🍳`;

  return (
    <div className="flex min-h-screen bg-app text-app">

      {/* Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isDesktop={isDesktop}
      />

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300
    ${isDesktop && sidebarOpen ? "ml-64" : "ml-0"}
  `}
      >
        <Topbar
          greeting={greetingText}
          onLogout={onLogout}
          toggleSidebar={() => setSidebarOpen(v => !v)}
          isDesktop={isDesktop}
        />

        <div className="p-6">
          {{
            dashboard: <DashboardHome />,
            orders: <Orders />,
            "add-order": <AddOrder setActiveTab={setActiveTab} />,
            "create-order": <CreateOrder setActiveTab={setActiveTab} />,
            menu: <Menu />,
            settings: <Settings user={user} />,
            setup: <Setup />,
            list: <MenuList />,
            invoice: <Invoice />,
            listcreator: <MenuListCreator />
          }[activeTab]}
        </div>
      </main>
    </div>
  );
}