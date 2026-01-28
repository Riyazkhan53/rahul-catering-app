import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font
} from "@react-pdf/renderer";

Font.register({
    family: "Tamil",
    src: "fonts/NotoSansTamil_SemiCondensed-Regular.ttf",
});


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
        fontFamily: "Tamil",
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

export default function ListPDF({ items }) {
    const ROWS_PER_COLUMN = 18;

const leftItems = items.items.slice(0, ROWS_PER_COLUMN);
const rightItems =
  items.items.length > ROWS_PER_COLUMN
    ? items.items.slice(ROWS_PER_COLUMN)
    : [];
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
                                <Text style={styles.cellItem}>
                                    {item.name}
                                    {item.tamilName ? " / " : ""}
                                    <Text style={{ fontFamily: "Tamil" }}>
                                        {item.tamilName}
                                    </Text>
                                </Text>
                                <Text style={styles.cellQty}>{`${item.quantity} ${item.unit}`}</Text>
                            </View>
                        ))}
                    </View>

                    {/* RIGHT TABLE */}
                    {rightItems && rightItems.length > 0 &&
                    <>
                        <View style={styles.tableHeader}>
                            <Text style={styles.cellItem}>Items</Text>
                            <Text style={styles.cellQty}>Qty</Text>
                        </View>

                        {rightItems.map((item, i) => (
                            <View key={i} style={styles.row}>
                                <Text style={styles.cellItem}>
                                    {item.name}
                                    {item.tamilName ? " / " : ""}
                                    <Text style={{ fontFamily: "Tamil" }}>
                                        {item.tamilName}
                                    </Text>
                                </Text>
                                <Text style={styles.cellQty}>{`${item.quantity} ${item.unit}`}</Text>
                            </View>
                        ))}
                    </>}

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