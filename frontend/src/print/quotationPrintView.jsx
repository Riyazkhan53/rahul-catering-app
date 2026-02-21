import "./print.css";

const CATEGORY_MAP = {
  s1: "Starters", s2: "Starters", s3: "Starters", s4: "Starters", s5: "Starters",
  m1: "Main Course", m2: "Main Course", m3: "Main Course", m4: "Main Course",
  m5: "Main Course", m6: "Main Course", m7: "Main Course",
  b1: "Breads", b2: "Breads", b3: "Breads", b4: "Breads",
  r1: "Rice", r2: "Rice", r3: "Rice",
  sd1: "Side Dishes", sd2: "Side Dishes", sd3: "Side Dishes", sd4: "Side Dishes",
  d1: "Desserts", d2: "Desserts", d3: "Desserts", d4: "Desserts", d5: "Desserts",
  bv1: "Beverages", bv2: "Beverages", bv3: "Beverages", bv4: "Beverages",
};

function groupDishesByCategory(dishes) {
  const groups = {};
  (dishes || []).forEach((dish) => {
    const cat = CATEGORY_MAP[dish.id] || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(dish);
  });
  return groups;
}

function normalizeEventDates(data) {
  if (data.eventDates) return data.eventDates;
  if (data.dishes && data.dishes.length > 0) {
    return [{ date: data.eventDate || "", shifts: { Menu: { dishes: data.dishes } } }];
  }
  return [];
}

function formatCurrency(amount) {
  return `Rs. ${(amount || 0).toLocaleString()}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function QuotationPrintView({ data }) {
  const {
    quotationNumber,
    date,
    customerName,
    customerPhone,
    customerAddress,
    eventType,
    numberOfGuests,
    services,
    total,
  } = data;

  const eventDates = normalizeEventDates(data);
  let itemCounter = 0;

  return (
    <div className="quotation-print-page">
      <img src="/roundlogo3.png" className="print-watermark" alt="watermark" />

      {/* HEADER — same as listPrintView */}
      <div className="print-header">
        <img src="/headerLogo.png" className="print-header-img" alt="header" />
      </div>

      {/* QUOTATION INFO */}
      <div className="qt-info-row">
        <span className="qt-info-label">Quotation No: <strong>{quotationNumber}</strong></span>
        <span className="qt-info-label">Date: <strong>{date}</strong></span>
      </div>

      {/* CUSTOMER DETAILS */}
      <div className="qt-section">
        <div className="qt-section-title">Customer Details</div>
        <div className="qt-detail-grid">
          <div className="qt-detail-row">
            <span className="qt-label">Name:</span>
            <span className="qt-value">{customerName}</span>
          </div>
          {customerPhone && (
            <div className="qt-detail-row">
              <span className="qt-label">Phone:</span>
              <span className="qt-value">{customerPhone}</span>
            </div>
          )}
          {customerAddress && (
            <div className="qt-detail-row">
              <span className="qt-label">Address:</span>
              <span className="qt-value">{customerAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* EVENT DETAILS */}
      <div className="qt-section">
        <div className="qt-section-title">Event Details</div>
        <div className="qt-detail-grid">
          <div className="qt-detail-row">
            <span className="qt-label">Event Type:</span>
            <span className="qt-value">{eventType}</span>
          </div>
          {numberOfGuests && (
            <div className="qt-detail-row">
              <span className="qt-label">Guests:</span>
              <span className="qt-value">{numberOfGuests}</span>
            </div>
          )}
          {eventDates.filter((ed) => ed.date).length > 0 && (
            <div className="qt-detail-row">
              <span className="qt-label">Event Date(s):</span>
              <span className="qt-value">
                {eventDates.filter((ed) => ed.date).map((ed) => formatDate(ed.date)).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MENU ITEMS BY DATE / SHIFT / CATEGORY */}
      {eventDates.map((ed, edIdx) => {
        if (!ed.date) return null;
        const shifts = ed.shifts || {};
        const shiftEntries = Object.entries(shifts).filter(
          ([, sd]) => sd.dishes && sd.dishes.length > 0
        );
        if (shiftEntries.length === 0) return null;

        return (
          <div key={edIdx} className="qt-date-block">
            <div className="qt-date-heading">{formatDate(ed.date)}</div>

            {shiftEntries.map(([shift, shiftData]) => {
              const catGroups = groupDishesByCategory(shiftData.dishes);
              return (
                <div key={shift} className="qt-shift-block">
                  <div className="qt-shift-heading">{shift}</div>

                  {Object.entries(catGroups).map(([category, catDishes]) => (
                    <div key={category} className="qt-category-block">
                      <div className="qt-category-heading">{category}</div>
                      <table className="qt-table">
                        <thead>
                          <tr>
                            <th className="qt-th-num">#</th>
                            <th className="qt-th-item">Item</th>
                            <th className="qt-th-qty">Qty</th>
                            <th className="qt-th-rate">Rate</th>
                            <th className="qt-th-amount">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catDishes.map((dish) => {
                            itemCounter++;
                            return (
                              <tr key={dish.id}>
                                <td className="qt-td-num">{itemCounter}</td>
                                <td className="qt-td-item">{dish.name}</td>
                                <td className="qt-td-qty">{dish.quantity}</td>
                                <td className="qt-td-rate">{formatCurrency(dish.price)}</td>
                                <td className="qt-td-amount">
                                  {formatCurrency(dish.price * (parseInt(dish.quantity) || 0))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ADDITIONAL SERVICES */}
      {services && services.length > 0 && (
        <div className="qt-section">
          <div className="qt-section-title">Additional Services</div>
          <table className="qt-table">
            <thead>
              <tr>
                <th className="qt-th-num">#</th>
                <th className="qt-th-item">Service</th>
                <th className="qt-th-qty">Qty</th>
                <th className="qt-th-rate">Rate</th>
                <th className="qt-th-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service.id}>
                  <td className="qt-td-num">{index + 1}</td>
                  <td className="qt-td-item">{service.name}</td>
                  <td className="qt-td-qty">{service.quantity}</td>
                  <td className="qt-td-rate">{formatCurrency(service.price)}</td>
                  <td className="qt-td-amount">
                    {formatCurrency(service.price * (parseInt(service.quantity) || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TOTAL */}
      <div className="qt-total-box">
        <span className="qt-total-label">TOTAL AMOUNT:</span>
        <span className="qt-total-amount">{formatCurrency(total)}</span>
      </div>

      {/* TERMS */}
      <div className="qt-terms">
        <strong>Terms & Conditions:</strong>
        <ul>
          <li>Quotation valid for 15 days from the date of issue.</li>
          <li>50% advance payment required to confirm the booking.</li>
          <li>Final menu can be customized as per your requirements.</li>
          <li>Prices are subject to change based on market conditions.</li>
        </ul>
      </div>

      {/* FOOTER */}
      <div className="print-footer">
        <p>Thank you for choosing Rahul Catering & Events!</p>
        <p>Coonoor, The Nilgiris – 643105 | India</p>
      </div>
    </div>
  );
}
