import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import QuotationPrintView from "./quotationPrintView";
import { getQuotationById } from "../db/indexedDB";
import { isDesktop } from "../utils/device";

export default function QuotationPrintRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const autoDownloadTriggered = useRef(false);

  const downloadPDF = async () => {
    if (!data) return;
    setDownloading(true);

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/print/quotation`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (isDesktop()) {
        // Desktop → open PDF in new tab
        window.open(blobUrl, "_blank");
      } else {
        // Android / iOS → trigger native download via <a> tag
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Quotation_${data.customerName || "draft"}_${data.id || id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      console.error("PDF download error:", err);
    }

    setTimeout(() => setDownloading(false), 800);
  };

  useEffect(() => {
    async function load() {
      const quotation = await getQuotationById(id);
      setData(quotation);
    }
    load();
  }, [id]);

  // Auto-trigger download when ?download=true
  useEffect(() => {
    if (data && searchParams.get("download") === "true" && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      downloadPDF();
    }
  }, [data, searchParams]);

  if (!data) return <div className="print-route" style={{ padding: 24 }}>Loading preview…</div>;

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

      {/* HTML PREVIEW (same as listPrintRoute renders ListPrintView) */}
      <QuotationPrintView data={data} />
    </div>
  );
}
