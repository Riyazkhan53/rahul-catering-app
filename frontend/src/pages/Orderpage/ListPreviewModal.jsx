import { PDFViewer } from "@react-pdf/renderer";
import ListPDF from "../../pdf/listPDF";

export default function ListPreviewModal({ list, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="w-[90vw] h-[90vh] bg-white rounded-xl overflow-hidden relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl"
        >
          ✕
        </button>

        <PDFViewer width="100%" height="100%">
          <ListPDF items={list} />
        </PDFViewer>
      </div>
    </div>
  );
}