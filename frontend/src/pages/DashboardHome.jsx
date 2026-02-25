import { motion } from "framer-motion";
import { TrendingUp, Clock, Wallet, MessageSquare, ClipboardList, Inbox } from "lucide-react";
import AnimatedPage from "./AnimatedPage";

export default function DashboardHome() {
  const stats = [
    { title: "Today's Orders", value: "24", icon: TrendingUp, color: "text-blue-500 dark:text-blue-400" },
    { title: "Pending Orders", value: "6", icon: Clock, color: "text-yellow-500 dark:text-yellow-400" },
    { title: "Revenue", value: "₹18,500", icon: Wallet, color: "text-green-500 dark:text-green-400" },
  ];

  return (
    <AnimatedPage>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
        {stats.map((stat, index) => (
          <Stat 
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Messages & Order Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl mt-6">

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Messages</h3>
            <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500">0 new</span>
          </div>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
              <Inbox className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No messages yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Messages will appear here</p>
          </div>
        </motion.div>

        {/* New Order Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10 dark:to-transparent">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ClipboardList className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">New Order Requests</h3>
            <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500">0 pending</span>
          </div>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
              <ClipboardList className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No new order requests</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Incoming orders will show up here</p>
          </div>
        </motion.div>

      </div>
    </AnimatedPage>
  );
}

function Stat({ title, value, icon: Icon, color, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 text-center transition-all hover:scale-105 hover:shadow-xl dark:hover:shadow-gray-900/70 group cursor-pointer"
    >
      <div className="flex justify-center mb-3">
        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-300 ${color}`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:animate-bounce" />
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-orange-500 dark:text-orange-400 mt-2">{value}</p>
    </motion.div>
  );
}