import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ListPrintView from "./listPrintView";
import { getListById } from "../db/indexedDB";
import { isDesktop } from "../utils/device";

export default function ListPrintRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const autoDownloadTriggered = useRef(false);

  const downloadPDF = () => {
    setDownloading(true);

    const url = `${import.meta.env.VITE_API_URL}/api/print/list/${id}`;

    if (isDesktop()) {
      // Desktop → open preview tab
      window.open(url, "_blank");
    } else {
      // Android / iOS → native download
      window.location.href = url;
    }

    // Just UI state reset
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