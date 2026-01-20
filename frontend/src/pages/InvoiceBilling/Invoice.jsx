import { motion } from "framer-motion";
import React from "react";
import CreateInvoice from "./Invoice/CreateInvoice";
import PdfLayout from "../../utils/InvoiceTemplate";

export default function InvoiceBillingHome({ setActiveTab }) {
    const [invoice, setInvoice]= React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex justify-center items-center"
    >
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-2">
          🧾 Invoice & Billing
        </h2>
        <p className="text-gray-500 mb-8">
          Create invoices, quotations and bills for catering orders
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <ActionCard
            title="Create Invoice"
            desc="Official invoice for completed orders"
            onClick={() => setInvoice("create-invoice")}
          />

          <ActionCard
            title="Create Quotation"
            desc="Share pricing before confirmation"
            onClick={() => setInvoice("create-quotation")}
          />

          <ActionCard
            title="Create Bill"
            desc="Quick billing for instant payments"
            onClick={() => setActiveTab("create-bill")}
          />

          <ActionCard
            title="View Documents"
            desc="Invoices, bills & quotations"
            onClick={() => setActiveTab("all-documents")}
          />
        </div>
      </div>
      {invoice=="create-invoice" && (
        <CreateInvoice
          invoice={invoice}
        //   onClose={() => setShowPreview(false)}
        />
      )}
      {invoice =="create-quotation" && <PdfLayout>Quotation Here</PdfLayout>}
    </motion.div>
  );
}

function ActionCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left border rounded-xl p-6 hover:shadow-md hover:border-orange-400 transition"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{desc}</p>
    </button>
  );
}