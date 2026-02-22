import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ListPrintView from "./listPrintView";
import { getListById, addToSyncQ } from "../db/indexedDB";
import { generatedListService } from "../api/service";
import { isOfflineMode } from "../api/api";
import { isDesktop } from "../utils/device";

export default function ListPrintRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const autoDownloadTriggered = useRef(false);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      // Ensure data is in MongoDB before hitting backend GET endpoint
      if (list && navigator.onLine && !isOfflineMode()) {
        try {
          await generatedListService.saveGeneratedList(list);
        } catch (apiErr) {
          console.error("Server save failed, queuing for sync:", apiErr);
          await addToSyncQ("generated_lists", list.id);
        }
      } else if (list) {
        // Queue for later sync if offline
        await addToSyncQ("generated_lists", list.id);
      }

      const url = `${import.meta.env.VITE_API_URL}/api/print/list/${id}`;

      if (navigator.onLine && !isOfflineMode()) {
        if (isDesktop()) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
      } else {
        // Offline: cannot reach backend, show message
        alert("You are offline. Please sync and try downloading when online.");
      }
    } catch (err) {
      console.error("Download error:", err);
    }
    setTimeout(() => setDownloading(false), 800);
  };

  useEffect(() => {
    async function load() {
      const data = await getListById(id);
      setList(data);
    }
    load();
  }, [id]);

  // Auto-trigger download when ?download=true
  useEffect(() => {
    if (list && searchParams.get("download") === "true" && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      downloadPDF();
    }
  }, [list, searchParams]);

  if (!list) return <div className="print-route" style={{ padding: 24 }}>Loading preview…</div>;

  return (
    <div className="print-route">
      {/* ACTION BAR */}
      <div className="print-actions">
        <button onClick={() => navigate(-1)} className="print-back-btn">
          ← Back
        </button>
        <button onClick={downloadPDF} disabled={downloading}>
          {downloading ? "Preparing…" : "⬇ Download PDF"}
        </button>
      </div>

      {/* PREVIEW */}
      <ListPrintView list={list} />
    </div>
  );
}