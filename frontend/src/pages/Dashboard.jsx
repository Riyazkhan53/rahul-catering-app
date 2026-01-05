import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardHome from "./DashboardHome";
import Orders from "./Orders";
import Menu from "./Menu";
import Settings from "./Settings";
import Setup from "./Setup";
import AddOrder from "./AddOrder";
import CreateOrder from "./CreateOrder";

export default function Dashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <main className="flex-1 p-6 overflow-auto">
                <Topbar
                    greeting={greeting}
                    onLogout={onLogout}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="flex justify-center items-start mt-6">
                    {{
                        dashboard: <DashboardHome />,
                        orders: <Orders />,
                        "add-order": <AddOrder setActiveTab={setActiveTab} />,
                        "create-order": <CreateOrder setActiveTab={setActiveTab} />,
                        menu: <Menu />,
                        settings: <Settings />,
                        setup: <Setup />,
                    }[activeTab]}
                </div>
            </main>
        </div>
    );
}