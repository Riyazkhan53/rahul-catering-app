import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #f97316",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f97316",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: "1px solid #e5e7eb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    width: "40%",
  },
  value: {
    fontSize: 10,
    color: "#111827",
    width: "60%",
    fontWeight: "bold",
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f97316",
    padding: 8,
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    padding: 8,
    fontSize: 9,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    padding: 8,
    backgroundColor: "#f9fafb",
    fontSize: 9,
  },
  col1: { width: "5%", textAlign: "center" },
  col2: { width: "45%" },
  col3: { width: "15%", textAlign: "center" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "20%", textAlign: "right", fontWeight: "bold" },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff7ed",
    borderRadius: 5,
    border: "2px solid #f97316",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f97316",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#374151",
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
  },
});

export default function QuotationPDF({ data }) {
  const {
    quotationNumber,
    date,
    customerName,
    customerPhone,
    customerAddress,
    eventDate,
    eventType,
    numberOfGuests,
    dishes,
    services,
    total,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🍽️ Rahul Catering & Events</Text>
          <Text style={styles.subtitle}>Professional Catering Services</Text>
          <Text style={styles.subtitle}>
            Phone: +91 XXXXX XXXXX | Email: info@rahulcatering.com
          </Text>
        </View>

        {/* Quotation Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Quotation No:</Text>
            <Text style={styles.value}>{quotationNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          {customerPhone && (
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{customerPhone}</Text>
            </View>
          )}
          {customerAddress && (
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{customerAddress}</Text>
            </View>
          )}
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Event Type:</Text>
            <Text style={styles.value}>{eventType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Event Date:</Text>
            <Text style={styles.value}>
              {new Date(eventDate).toLocaleDateString()}
            </Text>
          </View>
          {numberOfGuests && (
            <View style={styles.row}>
              <Text style={styles.label}>Number of Guests:</Text>
              <Text style={styles.value}>{numberOfGuests}</Text>
            </View>
          )}
        </View>

        {/* Dishes Table */}
        {dishes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Menu Items</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>#</Text>
                <Text style={styles.col2}>Item Name</Text>
                <Text style={styles.col3}>Qty</Text>
                <Text style={styles.col4}>Rate</Text>
                <Text style={styles.col5}>Amount</Text>
              </View>
              {dishes.map((dish, index) => (
                <View
                  key={dish.id}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.col1}>{index + 1}</Text>
                  <Text style={styles.col2}>{dish.name}</Text>
                  <Text style={styles.col3}>{dish.quantity}</Text>
                  <Text style={styles.col4}>₹{dish.price}</Text>
                  <Text style={styles.col5}>
                    ₹{(dish.price * dish.quantity).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Services Table */}
        {services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Services</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>#</Text>
                <Text style={styles.col2}>Service Name</Text>
                <Text style={styles.col3}>Qty</Text>
                <Text style={styles.col4}>Rate</Text>
                <Text style={styles.col5}>Amount</Text>
              </View>
              {services.map((service, index) => (
                <View
                  key={service.id}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.col1}>{index + 1}</Text>
                  <Text style={styles.col2}>{service.name}</Text>
                  <Text style={styles.col3}>{service.quantity}</Text>
                  <Text style={styles.col4}>₹{service.price}</Text>
                  <Text style={styles.col5}>
                    ₹{(service.price * service.quantity).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
            <Text style={styles.totalAmount}>
              ₹{total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Terms & Conditions:</Text>
          <Text style={styles.notesText}>
            • This quotation is valid for 15 days from the date of issue.
          </Text>
          <Text style={styles.notesText}>
            • 50% advance payment required to confirm the booking.
          </Text>
          <Text style={styles.notesText}>
            • Final menu can be customized as per your requirements.
          </Text>
          <Text style={styles.notesText}>
            • Prices are subject to change based on market conditions.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for choosing Rahul Catering & Events!</Text>
          <Text>For any queries, please contact us at +91 XXXXX XXXXX</Text>
        </View>
      </Page>
    </Document>
  );
}
