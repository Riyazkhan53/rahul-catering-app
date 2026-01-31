import "./print.css";

export default function ListPrintView({ list }) {
  const mid = Math.ceil(list.items.length / 2);
  const left = list.items.slice(0, mid);
  const right = list.items.slice(mid);

  return (
    <div className="print-page">
      {/* HEADER */}
      <header className="print-header">
        <img src="/headerLogo.png" className="print-logo" />
        <div className="print-contacts">
          <p>📞 9655264032</p>
          <p>📱 8248403710</p>
        </div>
      </header>

      <hr className="print-divider" />

      {/* TABLES */}
      <div className="print-tables">
        <PrintTable items={left} />
        {right.length > 0 && <PrintTable items={right} />}
      </div>

      {/* FOOTER */}
      <footer className="print-footer">
        <p>📍 Coonoor, The Nilgiris – 643105</p>
        <p>Instagram: @rahul_catering_events</p>
      </footer>
    </div>
  );
}

function PrintTable({ items }) {
  return (
    <table className="print-table">
      <thead>
        <tr>
          <th>Items</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i, idx) => (
          <tr key={idx}>
            <td>
              {i.name}
              {i.tamilName && <span className="ta"> / {i.tamilName}</span>}
            </td>
            <td>{i.quantity} {i.unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}