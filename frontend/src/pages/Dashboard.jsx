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
import CalendarPage from "./Calendar/CalendarPage";
import ProfileModal from "./Settings/Profile";
import { apiRequest, isOfflineMode } from "../api/api";
import { getAllUserRoles } from "../db/indexedDB";

export default function Dashboard({ user, onLogout, onSwitchRole }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const [orderPrefill, setOrderPrefill] = useState(null);
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [allowedTabs, setAllowedTabs] = useState(null);
  const [rolePermissions, setRolePermissions] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  // Fetch role config (tabs + permissions) for the current user's role
  useEffect(() => {
    async function fetchRoleConfig() {
      const role = user?.role;
      if (!role) return;
      try {
        let roleData = null;
        if (!isOfflineMode()) {
          const roles = await apiRequest("/api/roles");
          roleData = roles.find((r) => r.roleId === role);
        }
        if (!roleData) {
          // Fallback to IndexedDB
          const local = await getAllUserRoles();
          roleData = local.find((r) => r.id === role);
        }
        if (roleData) {
          setAllowedTabs(roleData.tabs || []);
          setRolePermissions(roleData.permissions || {});
        }
      } catch {
        // Fallback to IndexedDB
        try {
          const local = await getAllUserRoles();
          const roleData = local.find((r) => r.id === role);
          if (roleData) {
            setAllowedTabs(roleData.tabs || []);
            setRolePermissions(roleData.permissions || {});
          }
        } catch {}
      }
    }
    fetchRoleConfig();
  }, [user?.role]);

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
      orders: <Orders setActiveTab={setActiveTab} setOrderPrefill={setOrderPrefill} />,
      "add-order": <AddOrder setActiveTab={setActiveTab} prefill={orderPrefill} clearPrefill={() => setOrderPrefill(null)} />,
      "create-order": <CreateOrder setActiveTab={setActiveTab} />,
      menu: <Menu />,
      settings: <Settings user={user} />,
      setup: <Setup />,
      list: <MenuList />,
      invoice: <Invoice />,
      listcreator: <MenuListCreator />,
      "listcreator-menu": <MenuListCreator defaultView="menu" />,
      "listcreator-list": <MenuListCreator defaultView="list" />,
      appsettings: <AppSettings />,
      calendar: <CalendarPage />,
    };

    return pages[activeTab] || <DashboardHome />;
  };

  // Get tab order based on role config
  const getTabOrder = () => {
    if (allowedTabs && allowedTabs.length > 0) return allowedTabs;
    if (user?.role === "admin") {
      return ["dashboard", "orders", "menu", "settings", "setup", "appsettings"];
    }
    return ["dashboard", "menu", "orders", "add-order", "listcreator", "invoice", "appsettings"];
  };

  return (
    <div className="flex min-h-screen bg-app text-app overflow-x-hidden">

      {/* Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isDesktop={isDesktop}
        onLogout={onLogout}
        onViewProfile={() => setShowProfile(true)}
        onSwitchRole={onSwitchRole}
        allowedTabs={allowedTabs}
      />

      {/* Main */}
      <main
        className={`flex-1 transition-all duration-300 w-full max-w-full overflow-x-hidden
    ${isDesktop && sidebarOpen ? "ml-64" : "ml-0"}
  `}
      >
        <Topbar
          greeting={greetingText}
          user={user}
          onLogout={onLogout}
          onViewProfile={() => setShowProfile(true)}
          onSwitchRole={onSwitchRole}
          toggleSidebar={() => setSidebarOpen(v => !v)}
          isDesktop={isDesktop}
        />

        <div className="p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-full overflow-x-hidden"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}