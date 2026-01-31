import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListPrintView from "./listPrintView";
import { getListById } from "../db/indexedDB";
import { printService } from "../api/service";

export default function ListPrintRoute() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getListById(id);
      setList(data);
    }
    load();
  }, [id]);

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const blob = await printService.printList(list);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${list.id}.pdf`;
      a.click();

      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (!list) return <div className="p-6">Loading preview…</div>;

  return (
    <div className="print-route">
      <div className="print-actions">
        <button onClick={downloadPDF} disabled={downloading}>
          ⬇ Download PDF
        </button>
      </div>

      <ListPrintView list={list} />
    </div>
  );
}