import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMenuPlanById, addToSyncQ } from "../db/indexedDB";
import { generateMenuPlanPDF } from "../utils/generateMenuPlanPDF";
import { generatedMenuPlanService } from "../api/service";
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

  // Download: save to MongoDB first (if not already), then GET → Chrome PDF viewer
  const downloadPDF = async () => {
    setDownloading(true);
    try {
      // Ensure data is in MongoDB before hitting the backend GET endpoint
      if (menuPlanData && navigator.onLine) {
        try {
          await generatedMenuPlanService.saveGeneratedMenuPlan(menuPlanData);
        } catch (apiErr) {
          console.error("Server save failed, queuing for sync:", apiErr);
          await addToSyncQ("generated_menu_plans", menuPlanData.id || menuPlanData.planNumber);
        }
      }

      const url = `${import.meta.env.VITE_API_URL}/api/print/menuplan/${id}`;

      if (isDesktop()) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Download error:", err);
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
