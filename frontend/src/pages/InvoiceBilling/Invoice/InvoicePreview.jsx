import PdfLayout from "../../../utils/InvoiceTemplate"
export default function InvoicePreview({ invoice, onClose }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">

            {/* SCROLL CONTAINER */}
            <div className="bg-white max-h-[95vh] overflow-auto rounded-xl shadow-xl relative">

                {/* ACTION BAR */}
                <div className="sticky top-0 z-10 bg-white border-b flex justify-between px-4 py-3 print:hidden">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        ✕ Close
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-orange-500 text-white rounded"
                    >
                        🖨 Print
                    </button>
                </div>

                {/* PRINT PAGE */}
                <PdfLayout invoice={invoice} />
            </div>
        </div>
    );
}