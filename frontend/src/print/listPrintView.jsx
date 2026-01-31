import "./print.css";

export default function ListPrintView({ list={items:[]} }) {
  const ROWS_PER_COLUMN = 18;

  const leftItems = list.items.slice(0, ROWS_PER_COLUMN);
  const rightItems =
    list.items.length > ROWS_PER_COLUMN
      ? list.items.slice(ROWS_PER_COLUMN)
      : [];

  return (
    <div className="print-root">
      <div className="print-page">

        {/* WATERMARK */}
        <img src="/roundlogo3.png" className="print-watermark" />

        {/* HEADER */}
        <div className="print-header">
          <img src="/headerLogo.png" className="print-header-img" />
        </div>

        {/* TABLES */}
        <div className="print-split">

          {/* LEFT TABLE */}
          <div className="print-table-box">
            <Table items={leftItems} />
          </div>

          {/* RIGHT TABLE */}
          {rightItems.length > 0 && (
            <div className="print-table-box">
              <Table items={rightItems} />
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="print-footer">
          <p>📍 Coonoor, The Nilgiris – 643105 | India</p>
          <p>Instagram: @rahul_catering_events</p>
        </div>

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
        {items.map((item, i) => (
          <tr key={i}>
            <td>
              {item.name}
              {item.tamilName && (
                <span className="ta"> / {item.tamilName}</span>
              )}
            </td>
            <td className="qty">
              {item.quantity} {item.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}