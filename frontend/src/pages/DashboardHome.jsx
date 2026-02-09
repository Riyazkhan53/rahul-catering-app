import { motion } from "framer-motion";
import { TrendingUp, Clock, Wallet } from "lucide-react";
import AnimatedPage from "./AnimatedPage";

export default function DashboardHome() {
  const stats = [
    { title: "Today's Orders", value: "24", icon: TrendingUp, color: "text-blue-500 dark:text-blue-400" },
    { title: "Pending Orders", value: "6", icon: Clock, color: "text-yellow-500 dark:text-yellow-400" },
    { title: "Revenue", value: "₹18,500", icon: Wallet, color: "text-green-500 dark:text-green-400" },
  ];

  return (
    <AnimatedPage>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
        {stats.map((stat, index) => (
          <Stat 
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
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