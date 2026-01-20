export default function InvoicePreview({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-[210mm] h-[297mm] overflow-auto shadow-xl relative">

        {/* CLOSE (hidden in print) */}
        <div className="absolute top-4 right-4 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            ✕ Close
          </button>
        </div>

        {/* PRINT BUTTON */}
        <div className="absolute top-4 left-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            🖨 Print
          </button>
        </div>

        {/* PAGE */}
        <div className="pdf-page">

          {/* CLIENT + EVENT */}
          <section className="grid grid-cols-2 gap-6 text-sm mt-6">
            <div>
              <h4 className="font-semibold mb-1">Bill To</h4>
              <p>{invoice.client.name}</p>
              <p>{invoice.client.mobile}</p>
              <p>{invoice.client.address}</p>
            </div>

            <div>
              <p><b>Invoice No:</b> {invoice.invoiceNo}</p>
              <p><b>Date:</b> {invoice.date}</p>
              <p><b>Function:</b> {invoice.event.functionType}</p>
              <p><b>Event Date:</b> {invoice.event.eventDate}</p>
            </div>
          </section>

          {/* ITEMS */}
          <table className="w-full mt-6 border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rate</th>
                <th className="p-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    No items added
                  </td>
                </tr>
              ) : (
                invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.qty}</td>
                    <td className="p-2 border">{item.rate}</td>
                    <td className="p-2 border">
                      ₹{item.qty * item.rate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="flex justify-end mt-6">
            <div className="w-1/3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>₹0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}