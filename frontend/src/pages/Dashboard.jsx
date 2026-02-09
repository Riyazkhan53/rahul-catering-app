import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import AppSettings from "./AppSettings/AppSettings";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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

  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: -20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const renderPage = () => {
    const pages = {
      dashboard: <DashboardHome />,
      orders: <Orders />,
      "add-order": <AddOrder setActiveTab={setActiveTab} />,
      "create-order": <CreateOrder setActiveTab={setActiveTab} />,
      menu: <Menu />,
      settings: <Settings user={user} />,
      setup: <Setup />,
      list: <MenuList />,
      invoice: <Invoice />,
      listcreator: <MenuListCreator />,
      appsettings: <AppSettings />,
    };

    return pages[activeTab] || <DashboardHome />;
  };

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

        <div className="p-3 sm:p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}