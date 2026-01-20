export default function PdfLayout({ invoice }) {
  return (
    <div className="pdf-page">

      {/* HEADER */}
      <header className="pdf-header">
        <img src="/roundlogo3.png" className="logo" />
        <div>
          <h2>Rahul Catering & Events</h2>
          <p>📞 9655264092 | WhatsApp 8248403710</p>
        </div>
      </header>

      {/* WATERMARK */}
      <img
        src="/watermarkLogo.png"
        className="watermark"
        alt="watermark"
      />

      {/* CONTENT */}
      <main className="pdf-content">

        {/* CLIENT + EVENT */}
        <section className="grid grid-cols-2 gap-6 text-sm mt-6">
          <div>
            <h4 className="font-semibold mb-1">Bill To</h4>
            <p>{invoice?.client.name}</p>
            <p>{invoice?.client.mobile}</p>
            <p>{invoice?.client.address}</p>
          </div>

          <div>
            <p><b>Invoice No:</b> {invoice?.invoiceNo}</p>
            <p><b>Date:</b> {invoice?.date}</p>
            <p><b>Function:</b> {invoice?.event.functionType}</p>
            <p><b>Event Date:</b> {invoice?.event.eventDate}</p>
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
            {invoice?.items.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No items added
                </td>
              </tr>
            ) : (
              invoice?.items.map((item, i) => (
                <tr key={i}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.qty}</td>
                  <td className="p-2 border">{item.rate}</td>
                  <td className="p-2 border">₹{item.qty * item.rate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </main>

      {/* FOOTER */}
      <footer className="pdf-footer">
        <p>📍 Coonoor, The Nilgiris – 643105 | India</p>
        <p>Instagram: @rahul_catering_events</p>
      </footer>
    </div>
  );
}