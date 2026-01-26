import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    position: "relative"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "2 solid #ADC455",
    paddingBottom: 10,
    marginBottom: 16
  },

  logo: {
    width: 70,          // 👈 bigger logo
    height: 70,
    marginRight: 14
  },

  companyBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  companyName: {
    fontSize: 16,       // 👈 clean & bold
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  contact: {
    fontSize: 9,
    marginTop: 2,
    color: "#444",
    justifyContent:"flex-end"
  },

  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    width: 300,
    opacity: 1
  },

  section: {
    marginBottom: 10
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottom: "1 solid #ccc"
  },

  row: {
    flexDirection: "row",
    borderBottom: "1 solid #eee"
  },

  cell: {
    padding: 5,
    flex: 1
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTop: "1 solid #ccc",
    paddingTop: 6
  }
});

export default function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* WATERMARK */}
        <Image
          src="/watermarkLogo.png"
          style={styles.watermark}
        />

        {/* HEADER */}
        <View style={styles.header}>
  <Image
    src="/roundlogo3.png"
    style={styles.logo}
  />

  <View style={styles.companyBlock}>
    <Text style={styles.companyName}>
      Rahul Catering & Events
    </Text>

    <Text style={styles.contact}>
      📞 9655264092 | WhatsApp 8248403710
    </Text>
  </View>
</View>

        {/* CLIENT */}
        <View style={styles.section}>
          <Text>Bill To:</Text>
          <Text>{invoice.client.name}</Text>
          <Text>{invoice.client.mobile}</Text>
          <Text>{invoice.client.address}</Text>
        </View>

        {/* TABLE */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.cell}>Item</Text>
            <Text style={styles.cell}>Qty</Text>
            <Text style={styles.cell}>Rate</Text>
            <Text style={styles.cell}>Amount</Text>
          </View>

          {invoice.items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.qty}</Text>
              <Text style={styles.cell}>{item.rate}</Text>
              <Text style={styles.cell}>
                ₹{item.qty * item.rate}
              </Text>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            📍 Coonoor, The Nilgiris – 643105 | India
          </Text>
          <Text>
            Instagram: @rahul_catering_events
          </Text>
        </View>

      </Page>
    </Document>
  );
}