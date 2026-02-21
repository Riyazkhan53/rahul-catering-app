import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMenuPlanById } from "../db/indexedDB";
import { generateMenuPlanPDF } from "../utils/generateMenuPlanPDF";
import { isDesktop } from "../utils/device";
import * as pdfjsLib from "pdfjs-dist";
import "./print.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export default function MenuPlanPrintRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pageImages, setPageImages] = useState([]);
  const [menuPlanData, setMenuPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const autoDownloadTriggered = useRef(false);

  // Load data → generate PDF with letterhead → render pages as images
  useEffect(() => {
    async function loadAndRender() {
      try {
        setLoading(true);
        const data = await getMenuPlanById(id);
        if (!data) { setLoading(false); return; }
        setMenuPlanData(data);

        // Generate the actual PDF (uses RahulCateringletterpad.pdf as template)
        const bytes = await generateMenuPlanPDF(data);

        // Render each PDF page to a canvas → convert to image data URL
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const images = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 2;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL("image/png"));
        }
        setPageImages(images);
      } catch (err) {
        console.error("PDF render error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAndRender();
  }, [id]);

  // Auto-trigger download when ?download=true
  useEffect(() => {
    if (menuPlanData && searchParams.get("download") === "true" && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      downloadPDF();
    }
  }, [menuPlanData, searchParams]);

  // Download: direct GET to backend → Chrome PDF viewer (same as item list)
  const downloadPDF = () => {
    setDownloading(true);

    const url = `${import.meta.env.VITE_API_URL}/api/print/menuplan/${id}`;

    if (isDesktop()) {
      window.open(url, "_blank");
    } else {
      // Android / iOS → direct URL navigation opens Chrome PDF viewer
      window.location.href = url;
    }

    setTimeout(() => setDownloading(false), 800);
  };

  if (loading) {
    return (
      <div className="print-route" style={{ padding: 24, textAlign: "center" }}>
        Generating preview…
      </div>
    );
  }

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

      {/* PDF PAGES RENDERED AS IMAGES — actual letterhead PDF with data */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 8px" }}>
        {pageImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Page ${idx + 1}`}
            style={{ width: "100%", display: "block", marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          />
        ))}
      </div>
    </div>
  );
}
