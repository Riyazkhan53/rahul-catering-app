import { motion } from "framer-motion";
import { useState } from "react";
import InvoiceBillingHome from "./Invoice/InvoiceBillingHome";
import CreateInvoice from "./Invoice/CreateInvoice";
import PdfLayout from "../../utils/InvoiceTemplate";
import InvoicePreview from "./Invoice/InvoicePreview";
import BackHeader from "../../Components/BackHeader";

export default function InvoiceBillingPage() {
    const [view, setView] = useState("home");
    const [invoice, setInvoice] = useState({
        type: "INVOICE",
        invoiceNo: "INV-0001", // later auto-generate
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
    // home | create-invoice | create-quotation | documents

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
                <CreateInvoice
                    type="QUOTATION"
                    onSelect={setView}
                    invoice={invoice}
                    setInvoice={setInvoice}
                    onBack={() => setView("home")}
                />
            )}

            {view === "preview" && (
                <InvoicePreview
                    invoice={invoice}
                    onClose={() => setView("create-invoice")}
                />
            )}

            {view === "documents" && (
                <div className="w-full max-w-5xl">
                    <BackHeader
                        title="Invoice & Billing"
                        subtitle="Manage your invoices, quotations, and bills"
                        onBack={() => setView("home")}
                    />

                    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-2">📂 Documents</h2>
                        <p className="text-gray-500 mb-8">
                            View and manage all your invoices, quotations, and bills
                        </p>

                        <div className="text-center text-gray-500 py-20 border-dashed border-4 border-gray-200 rounded-xl">
                            No documents available.
                        </div>
                    </div>
                </div>)}
        </motion.div>
    );
}