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
        padding: 12,
        fontSize: 12,   // 👈 KEY CHANGE
        position: "relative",
    },

    /* FULL WIDTH HEADER */
    header: {
        width: "100%",
        marginBottom: 2,
        borderBottom: "2 solid #ADC455",
        paddingBottom: 2,
    },

    headerImage: {
        width: "120%",
        height: 60,           // 👈 adjust based on your image
        objectFit: "contain",  // or "cover" if banner-style
    },

    watermark: {
        position: "absolute",
        top: "40%",
        left: "25%",
        width: 300,
        opacity: 0.20,
    },

    section: {
        marginBottom: 10,
    },

    splitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  tableBox: {
    flex: 1,
    border: "1 solid #ccc",
    borderRadius: 6,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottom: "1 solid #ccc",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    borderBottom: "1 solid #eee",
  },

  cellItem: {
    flex: 3,
    padding: 6,
  },

  cellQty: {
    flex: 1,
    padding: 6,
    textAlign: "right",
  },

    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: "center",
        borderTop: "1 solid #ccc",
        paddingTop: 6,
    },
});

export default function ListPDF({ invoice }) {
    const mid = Math.ceil(invoice.items.length / 2);
const leftItems = invoice.items.slice(0, mid);
const rightItems = invoice.items.slice(mid);
    return (
        <Document>
  <Page size="LEGAL" style={styles.page}>

    {/* WATERMARK */}
    <Image src="/roundlogo3.png" style={styles.watermark} />

    {/* HEADER */}
    <View style={styles.header}>
      <Image src="/headerLogo.png" style={styles.headerImage} />
    </View>

    {/* SPLIT TABLES */}
    <View style={styles.splitRow}>

      {/* LEFT TABLE */}
      <View style={styles.tableBox}>
        <View style={styles.tableHeader}>
          <Text style={styles.cellItem}>Items</Text>
          <Text style={styles.cellQty}>Qty</Text>
        </View>

        {leftItems.map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cellItem}>{item.name}</Text>
            <Text style={styles.cellQty}>{item.qty}</Text>
          </View>
        ))}
        <View style={styles.row}>
            <Text style={styles.cellItem}>Salt</Text>
            <Text style={styles.cellQty}>30kg</Text>
          </View>
      </View>

      {/* RIGHT TABLE */}
      <View style={styles.tableBox}>
        <View style={styles.tableHeader}>
          <Text style={styles.cellItem}>Items</Text>
          <Text style={styles.cellQty}>Qty</Text>
        </View>

        {rightItems.map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cellItem}>{item.name}</Text>
            <Text style={styles.cellQty}>{item.qty}</Text>
          </View>
        ))}
        <View style={styles.row}>
            <Text style={styles.cellItem}>Sugar</Text>
            <Text style={styles.cellQty}>20kg</Text>
          </View>
      </View>

    </View>

    {/* FOOTER */}
    <View style={styles.footer}>
      <Text>📍 Coonoor, The Nilgiris – 643105 | India</Text>
      <Text>Instagram: @rahul_catering_events</Text>
    </View>

  </Page>
</Document>
    );
}