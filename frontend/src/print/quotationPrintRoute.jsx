import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getQuotationById } from "../db/indexedDB";
import { generateQuotationPDF } from "../utils/generateQuotationPDF";
import { savePdfFile } from "../utils/savePdf";
import "./print.css";

export default function QuotationPrintRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const autoDownloadTriggered = useRef(false);

  // Load quotation data and generate PDF on mount
  useEffect(() => {
    async function loadAndGenerate() {
      try {
        setLoading(true);
        const data = await getQuotationById(id);
        if (!data) {
          setError("Quotation not found");
          setLoading(false);
          return;
        }
        setQuotationData(data);

        // Generate the actual PDF with letterhead
        const bytes = await generateQuotationPDF(data);
        setPdfBytes(bytes);

        // Create blob URL for iframe preview
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("PDF generation error:", err);
        setError("Failed to generate PDF preview");
      } finally {
        setLoading(false);
      }
    }
    loadAndGenerate();

    return () => {
      // Cleanup blob URL on unmount
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [id]);

  // Auto-trigger download when ?download=true
  useEffect(() => {
    if (pdfBytes && quotationData && searchParams.get("download") === "true" && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      handleDownload();
    }
  }, [pdfBytes, quotationData, searchParams]);

  const handleDownload = async () => {
    if (!pdfBytes || !quotationData) return;
    setDownloading(true);
    try {
      const fileName = `Quotation_${quotationData.customerName || "draft"}_${quotationData.id || id}.pdf`;
      await savePdfFile(pdfBytes, fileName);
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  if (loading) {
    return (
      <div className="print-route" style={{ padding: 24, textAlign: "center" }}>
        <div style={{ marginBottom: 12 }}>Generating PDF preview…</div>
        <div style={{ width: 32, height: 32, border: "3px solid #f97316", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="print-route" style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: "#ef4444", marginBottom: 12 }}>{error}</p>
        <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", background: "#374151", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="print-route" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* ACTION BAR */}
      <div className="print-actions">
        <button onClick={() => navigate(-1)} className="print-back-btn">
          ← Back
        </button>
        <button onClick={handleDownload} disabled={downloading}>
          {downloading ? "Preparing…" : "⬇ Download PDF"}
        </button>
      </div>

      {/* PDF PREVIEW IN IFRAME */}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="Quotation Preview"
          style={{ flex: 1, width: "100%", border: "none", background: "#f3f4f6" }}
        />
      )}
    </div>
  );
}
