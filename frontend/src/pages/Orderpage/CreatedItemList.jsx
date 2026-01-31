import { useEffect, useState } from "react";
import { FileText, Eye, Pencil, Printer } from "lucide-react";
import { getAllLists, getListById } from "../../db/indexedDB";
import AnimatedPage from "../AnimatedPage";
import ListPreviewModal from "./ListPreviewModal";
import ListPrintView from "../../print/listPrintView";
import { useNavigate } from "react-router-dom";

export default function CreatedItemLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewList, setPreviewList] = useState(null);
  const [printList, setPrintList] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    async function loadLists() {
      const data = await getAllLists();
      setLists(data || []);
      setLoading(false);
    }
    loadLists();
  }, []);

  /* 🔑 PRINT TIMING FIX */
 useEffect(() => {
  if (!printList) return;

  const timer = setTimeout(() => {
    window.print();
  }, 500); // 👈 allow DOM + images to load

  window.onafterprint = () => {
    setPrintList(null);
    window.onafterprint = null;
  };

  return () => clearTimeout(timer);
}, [printList]);

  if (loading) {
    return <div className="text-center py-10 opacity-70">Loading lists...</div>;
  }

  return (
    <AnimatedPage>
      <div className="card p-6 w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-400" />
          Created Item Lists
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th>List ID</th>
                <th>List Name</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {lists.map((list) => (
                <tr key={list.id} className="border-b">
                  <td>{list.id}</td>
                  <td>{list.name}</td>
                  <td>{new Date(list.date).toDateString()}</td>

                  <td className="text-center">
                    <div className="flex justify-center gap-4">

                      {/* PREVIEW */}
                      <button
                        onClick={async () => {
                          const data = await getListById(list.id);
                          setPreviewList(data);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* EDIT (disabled) */}
                      <button disabled>
                        <Pencil className="w-4 h-4 opacity-50" />
                      </button>

                      {/* PRINT (FIXED) */}
                      <button
    onClick={() => {
      navigate(`/print/list/${list.id}`);
    }}
  >
    <Printer className="w-4 h-4" />
  </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewList && (
        <ListPreviewModal
          list={previewList}
          onClose={() => setPreviewList(null)}
        />
      )}

      {/* PRINT VIEW (DOM ONLY) */}
      {printList && <ListPrintView list={printList} />}
    </AnimatedPage>
  );
}