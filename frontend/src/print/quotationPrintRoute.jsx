import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import QuotationPrintView from "./quotationPrintView";
import { getQuotationById } from "../db/indexedDB";
import { generateQuotationPDF } from "../utils/generateQuotationPDF";
import { saveAs } from "file-saver";

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
      const pdfBytes = await generateQuotationPDF(data);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `Quotation_${data.customerName || "draft"}_${data.id || id}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
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

      {/* PREVIEW */}
      <QuotationPrintView data={data} />
    </div>
  );
}
