import { useEffect, useState } from "react";
import { FileText, Eye, Pencil, Printer } from "lucide-react";
import { getAllLists } from "../../db/indexedDB";
import AnimatedPage from "../AnimatedPage";

export default function CreatedItemLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLists() {
      const data = await getAllLists();
      setLists(data || []);
      setLoading(false);
    }

    loadLists();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 opacity-70">
        Loading lists...
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="card p-6 w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-400" />
          Created Item Lists
        </h2>

        {lists.length === 0 ? (
          <div className="text-center py-16 opacity-70">
            <p className="text-lg font-semibold">
              No lists created yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Generated item lists will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-left opacity-80">
                  <th className="py-3 px-2">List ID</th>
                  <th className="py-3 px-2">List Name</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {lists.map((list) => (
                  <tr
                    key={list.id}
                    className="border-b hover:bg-orange-50 dark:hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-2 font-medium">
                      {list.id}
                    </td>

                    <td className="py-3 px-2">
                      {list.name}
                    </td>

                    <td className="py-3 px-2">
                      {new Date(list.date).toDateString()}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex justify-center gap-4">
                        <DisabledAction icon={Eye} />
                        <DisabledAction icon={Pencil} />
                        <DisabledAction icon={Printer} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

/* 🔒 Disabled action button */
function DisabledAction({ icon: Icon }) {
  return (
    <div className="relative group cursor-not-allowed opacity-50">
      <Icon className="w-4 h-4" />

      {/* Tooltip */}
      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2
        whitespace-nowrap text-xs px-2 py-1 rounded
        bg-black text-white opacity-0
        group-hover:opacity-100 transition"
      >
        Under Development
      </span>
    </div>
  );
}