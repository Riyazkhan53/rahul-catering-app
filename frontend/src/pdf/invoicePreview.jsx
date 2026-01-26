import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./invoicePDF";

export default function InvoicePreview({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="h-full w-full bg-white relative">

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>

        <PDFViewer width="100%" height="100%">
          <InvoicePDF invoice={invoice} />
        </PDFViewer>
      </div>
    </div>
  );
}