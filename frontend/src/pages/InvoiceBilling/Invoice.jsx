import { motion } from "framer-motion";
import { useState } from "react";
import InvoiceBillingHome from "./Invoice/InvoiceBillingHome";
import CreateInvoice from "./Invoice/CreateInvoice";
import CreateQuotation from "./Invoice/CreateQuotation";
import EventMenuPlan from "./Invoice/EventMenuPlan";
import ViewDocuments from "./Invoice/ViewDocuments";
import PdfLayout from "../../utils/InvoiceTemplate";
import InvoicePreview from "../../pdf/invoicePreview";
import BackHeader from "../../Components/BackHeader";

export default function InvoiceBillingPage() {
    const [view, setView] = useState("home");
    const [invoice, setInvoice] = useState({
        type: "INVOICE",
        invoiceNo: "INV-0001",
        date: new Date().toISOString().slice(0, 10),

        client: {
            name: "",
            mobile: "",
            address: ""
        },

        event: {
            functionType: "",
            eventDate: "",
            location: "",
            pax: ""
        },

        items: [],

        summary: {
            discount: 0,
            tax: 0
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            {view === "home" && (
                <InvoiceBillingHome onSelect={setView} />
            )}

            {view === "create-invoice" && (
                <CreateInvoice onSelect={setView} invoice={invoice} setInvoice={setInvoice} onBack={() => setView("home")} />
            )}

            {view === "create-quotation" && (
                <CreateQuotation onBack={() => setView("home")} />
            )}

            {view === "event-menu-plan" && (
                <EventMenuPlan onBack={() => setView("home")} />
            )}

            {view === "preview" && (
                <InvoicePreview
                    invoice={invoice}
                    onClose={() => setView("create-invoice")}
                />
            )}

            {view === "documents" && (
                <ViewDocuments onBack={() => setView("home")} />
            )}
        </motion.div>
    );
}