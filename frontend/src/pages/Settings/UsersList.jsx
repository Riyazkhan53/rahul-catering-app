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
            className="flex justify-between items-center border rounded-lg px-4 py-3"
          >
            <div>
              <p className="font-semibold">{chef.name}</p>
              <p className="text-sm text-gray-500">{chef.username}</p>
            </div>

            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              CHEF
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
}