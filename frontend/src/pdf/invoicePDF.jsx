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
        opacity: 0.08,
    },

    section: {
        marginBottom: 10,
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        borderBottom: "1 solid #ccc",
    },

    row: {
        flexDirection: "row",
        borderBottom: "1 solid #eee",
    },

    cell: {
        padding: 5,
        flex: 1,
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

export default function InvoicePDF({ invoice }) {
    return (
        <Document>
            <Page size="LEGAL" style={styles.page}>

                {/* WATERMARK */}
                <Image
                    src="/watermarkLogo.png"
                    style={styles.watermark}
                />

                {/* HEADER */}
                <View style={styles.header}>
                    <Image
                        src="/headerLogo.png"
                        style={styles.headerImage}
                    />
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