import "./print.css";

export default function ListPrintView({ list }) {
  const ROWS_PER_COLUMN = 18;
  const left = list.items.slice(0, ROWS_PER_COLUMN);
  const right = list.items.slice(ROWS_PER_COLUMN);

  return (
    <div className="print-page">

      <img
    src="/roundlogo3.png"
    className="print-watermark"
    alt="watermark"
  />

      {/* HEADER */}
      <div className="print-header">
        <img src="/headerLogo.png" className="print-header-img" />
      </div>

      {/* TABLES */}
      <div className="print-body">
        <div className="print-column">
          <Table items={left} />
        </div>

        <div className="print-column">
          {right.length > 0 && <Table items={right} />}
        </div>
      </div>

      {/* FOOTER */}
      <div className="print-footer">
        <p>📍 Coonoor, The Nilgiris – 643105 | India</p>
        <p>Instagram: @rahul_catering_events</p>
      </div>
    </div>
  );
}

function Table({ items }) {
  return (
    <table className="print-table">
      <thead>
        <tr>
          <th>Items</th>
          <th className="qty">Qty</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i, idx) => (
          <tr key={idx}>
            <td>
              {i.name}
              {i.tamilName && <span className="ta"> / {i.tamilName}</span>}
              {i.comment && (<i> ({i.comment})</i>)}
            </td>
            <td className="qty">{i.quantity} {i.unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}