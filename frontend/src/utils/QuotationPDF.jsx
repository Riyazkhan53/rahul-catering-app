import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Reverse lookup for category
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

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 15,
    borderBottom: "2 solid #f97316",
    paddingBottom: 10,
  },
  headerImage: {
    width: "100%",
    height: 50,
    objectFit: "contain",
  },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f97316",
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: "1 solid #fed7aa",
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: { fontSize: 9, color: "#6b7280", width: "35%" },
  value: { fontSize: 9, color: "#111827", width: "65%", fontWeight: "bold" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoBox: { fontSize: 9, color: "#374151" },
  // Date heading
  dateHeading: {
    backgroundColor: "#f3f4f6",
    padding: 6,
    marginBottom: 4,
    marginTop: 8,
    borderRadius: 3,
  },
  dateText: { fontSize: 10, fontWeight: "bold", color: "#1e3a5f" },
  // Shift heading
  shiftHeading: { marginTop: 4, marginBottom: 3, paddingLeft: 4 },
  shiftText: { fontSize: 9, fontWeight: "bold", color: "#f97316" },
  // Category heading
  catHeading: { marginTop: 2, marginBottom: 2, paddingLeft: 8 },
  catText: { fontSize: 8, fontWeight: "bold", color: "#6b7280" },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fff7ed",
    borderBottom: "1 solid #e5e7eb",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #f3f4f6",
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1 solid #f3f4f6",
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: "#fafafa",
  },
  col1: { width: "6%", fontSize: 8, textAlign: "center" },
  col2: { width: "44%", fontSize: 8 },
  col3: { width: "12%", fontSize: 8, textAlign: "center" },
  col4: { width: "18%", fontSize: 8, textAlign: "right" },
  col5: { width: "20%", fontSize: 8, textAlign: "right", fontWeight: "bold" },
  thText: { fontWeight: "bold", fontSize: 8 },
  // Total
  totalSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fff7ed",
    borderRadius: 4,
    border: "2 solid #f97316",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 12, fontWeight: "bold", color: "#1f2937" },
  totalAmount: { fontSize: 16, fontWeight: "bold", color: "#f97316" },
  // Notes
  notes: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  notesTitle: { fontSize: 9, fontWeight: "bold", marginBottom: 3, color: "#374151" },
  notesText: { fontSize: 8, color: "#6b7280", lineHeight: 1.4 },
  // Footer
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#9ca3af",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 8,
  },
});

export default function QuotationPDF({ data }) {
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

  const dateStrings = eventDates
    .filter((ed) => ed.date)
    .map((ed) => {
      try {
        return new Date(ed.date + "T00:00:00").toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        });
      } catch { return ed.date; }
    });

  let itemCounter = 0;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/headerLogo.png" style={styles.headerImage} />
        </View>

        {/* Quotation Info */}
        <View style={styles.infoRow}>
          <Text style={styles.infoBox}>Quotation No: {quotationNumber}</Text>
          <Text style={styles.infoBox}>Date: {date}</Text>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          {customerPhone ? (
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{customerPhone}</Text>
            </View>
          ) : null}
          {customerAddress ? (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{customerAddress}</Text>
            </View>
          ) : null}
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Event Type:</Text>
            <Text style={styles.value}>{eventType}</Text>
          </View>
          {numberOfGuests ? (
            <View style={styles.row}>
              <Text style={styles.label}>Guests:</Text>
              <Text style={styles.value}>{numberOfGuests}</Text>
            </View>
          ) : null}
          {dateStrings.length > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Event Date(s):</Text>
              <Text style={styles.value}>{dateStrings.join(", ")}</Text>
            </View>
          )}
        </View>

        {/* Menu Items by Date / Shift / Category */}
        {eventDates.map((ed, edIdx) => {
          if (!ed.date) return null;
          const shifts = ed.shifts || {};
          const shiftEntries = Object.entries(shifts).filter(
            ([, sd]) => sd.dishes && sd.dishes.length > 0
          );
          if (shiftEntries.length === 0) return null;

          let dateLabel;
          try {
            dateLabel = new Date(ed.date + "T00:00:00").toLocaleDateString("en-IN", {
              weekday: "short", day: "numeric", month: "short", year: "numeric",
            });
          } catch { dateLabel = ed.date; }

          return (
            <View key={edIdx} wrap={false}>
              {/* Date heading */}
              <View style={styles.dateHeading}>
                <Text style={styles.dateText}>{dateLabel}</Text>
              </View>

              {shiftEntries.map(([shift, shiftData]) => {
                const catGroups = groupDishesByCategory(shiftData.dishes);
                return (
                  <View key={shift}>
                    <View style={styles.shiftHeading}>
                      <Text style={styles.shiftText}>{shift}</Text>
                    </View>

                    {Object.entries(catGroups).map(([category, catDishes]) => (
                      <View key={category}>
                        <View style={styles.catHeading}>
                          <Text style={styles.catText}>{category}</Text>
                        </View>

                        {/* Table header */}
                        <View style={styles.tableHeader}>
                          <Text style={[styles.col1, styles.thText]}>#</Text>
                          <Text style={[styles.col2, styles.thText]}>Item</Text>
                          <Text style={[styles.col3, styles.thText]}>Qty</Text>
                          <Text style={[styles.col4, styles.thText]}>Rate</Text>
                          <Text style={[styles.col5, styles.thText]}>Amount</Text>
                        </View>

                        {catDishes.map((dish, dIdx) => {
                          itemCounter++;
                          return (
                            <View
                              key={dish.id}
                              style={dIdx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                            >
                              <Text style={styles.col1}>{itemCounter}</Text>
                              <Text style={styles.col2}>{dish.name}</Text>
                              <Text style={styles.col3}>{dish.quantity}</Text>
                              <Text style={styles.col4}>Rs. {dish.price}</Text>
                              <Text style={styles.col5}>
                                Rs. {(dish.price * (parseInt(dish.quantity) || 0)).toLocaleString()}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Services Table */}
        {services && services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Services</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, styles.thText]}>#</Text>
              <Text style={[styles.col2, styles.thText]}>Service</Text>
              <Text style={[styles.col3, styles.thText]}>Qty</Text>
              <Text style={[styles.col4, styles.thText]}>Rate</Text>
              <Text style={[styles.col5, styles.thText]}>Amount</Text>
            </View>
            {services.map((service, index) => (
              <View
                key={service.id}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={styles.col1}>{index + 1}</Text>
                <Text style={styles.col2}>{service.name}</Text>
                <Text style={styles.col3}>{service.quantity}</Text>
                <Text style={styles.col4}>Rs. {service.price}</Text>
                <Text style={styles.col5}>
                  Rs. {(service.price * (parseInt(service.quantity) || 0)).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
          <Text style={styles.totalAmount}>Rs. {(total || 0).toLocaleString()}</Text>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Terms & Conditions:</Text>
          <Text style={styles.notesText}>
            {"\u2022"} Quotation valid for 15 days from the date of issue.
          </Text>
          <Text style={styles.notesText}>
            {"\u2022"} 50% advance payment required to confirm the booking.
          </Text>
          <Text style={styles.notesText}>
            {"\u2022"} Final menu can be customized as per your requirements.
          </Text>
          <Text style={styles.notesText}>
            {"\u2022"} Prices are subject to change based on market conditions.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Thank you for choosing Rahul Catering & Events!</Text>
          <Text>Coonoor, The Nilgiris - 643105 | India</Text>
        </View>
      </Page>
    </Document>
  );
}
