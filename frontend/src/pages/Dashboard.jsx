import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardHome from "./DashboardHome";
import Orders from "./Orders";
import Menu from "./Menu";
import Settings from "./Settings/Settings";
import Setup from "./Setup";
import AddOrder from "./AddOrder";
import CreateOrder from "./CreateOrder";

export default function Dashboard({ user, onLogout }) {debugger;
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const hour = new Date().getHours();
    const timeGreeting =
        hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    const greetingText =
        user?.role === "admin"
            ? `Hi, ${timeGreeting} Admin`
            : `Hi ${timeGreeting} Chef ${user?.name} 👨‍🍳`;

    return (
        <div className="flex h-screen bg-gray-100 min-h-screen bg-app text-app transition-colors">

            <Sidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <main className="flex-1 p-6 overflow-auto min-h-screen bg-app text-app transition-colors">
                <Topbar
                    greeting={greetingText}
                    onLogout={onLogout}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="flex justify-center items-start mt-6 min-h-screen bg-app text-app transition-colors">
                    {{
                        dashboard: <DashboardHome />,
                        orders: <Orders />,
                        "add-order": <AddOrder setActiveTab={setActiveTab} />,
                        "create-order": <CreateOrder setActiveTab={setActiveTab} />,
                        menu: <Menu />,
                        settings: <Settings user={user} />,
                        setup: <Setup />,
                    }[activeTab]}
                </div>
            </main>
        </div>
    );
}