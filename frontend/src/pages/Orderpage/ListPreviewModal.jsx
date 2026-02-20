import { createPortal } from "react-dom";
import { BlobProvider } from "@react-pdf/renderer";
import { Download, ExternalLink, Loader2, X, Share2 } from "lucide-react";
import ListPDF from "../../pdf/listPDF";

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function handleOpenPDF(blob) {
  const fileURL = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  window.open(fileURL, "_blank");
}

function handleDownloadPDF(blob, name) {
  const fileURL = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = `${name || "item-list"}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
}

async function handleSharePDF(blob, name) {
  try {
    const file = new File([blob], `${name || "item-list"}.pdf`, { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: name || "Item List" });
      return;
    }
  } catch {}
  // Fallback to download
  handleDownloadPDF(blob, name);
}

export default function ListPreviewModal({ list, onClose }) {
  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden relative flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            List Preview
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden">
          <BlobProvider document={<ListPDF items={list} />}>
            {({ blob, url, loading, error }) => {
              if (loading) {
                return (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Generating PDF...</p>
                  </div>
                );
              }

              if (error) {
                return (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <p className="text-red-500">Failed to generate PDF</p>
                    <p className="text-sm text-gray-400">{error.message}</p>
                  </div>
                );
              }

              if (isMobile()) {
                return (
                  <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                      <Download className="w-12 h-12 text-orange-500" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                      Your PDF is ready!
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <button
                        onClick={() => handleDownloadPDF(blob, list.name)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md active:scale-95 transition"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleSharePDF(blob, list.name)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-md active:scale-95 transition"
                      >
                        <Share2 className="w-4 h-4" />
                        Share PDF
                      </button>
                      <button
                        onClick={() => handleOpenPDF(blob)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl active:scale-95 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Browser
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <iframe
                  src={url}
                  title="List Preview"
                  className="w-full h-full border-0"
                />
              );
            }}
          </BlobProvider>
        </div>
      </div>
    </div>,
    document.body
  );
}