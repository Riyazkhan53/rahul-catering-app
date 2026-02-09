import { useEffect, useState } from "react";
import Modal from "../../Components/Modal";
import { apiRequest } from "../../api/api";

export default function ChefListModal({ onClose }) {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    apiRequest("/api/users/chefs", {
      token: localStorage.getItem("token"),
    }).then(setChefs);
  }, []);

  return (
    <Modal
      title="👨‍🍳 Chef Accounts"
      subtitle="All chefs currently registered"
      onClose={onClose}
    >
      <div className="space-y-3 max-h-[300px] overflow-auto">
        {chefs.map((chef) => (
          <div
            key={chef._id}
            className="flex justify-between items-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-700/50"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{chef.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{chef.username}</p>
            </div>

            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
              CHEF
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
}