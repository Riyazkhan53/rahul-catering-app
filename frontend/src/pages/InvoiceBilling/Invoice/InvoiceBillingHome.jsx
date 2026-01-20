import CardButton from "../../../Components/CardButton";
export default function InvoiceBillingHome({ onSelect }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">🧾 Invoice & Billing</h2>
            <p className="text-gray-500 mb-8">
                Create invoices, quotations and bills for catering orders
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardButton
                    icon={null}
                    title="Create Invoice"
                    description="Official invoice for completed orders"
                    onClick={() => onSelect("create-invoice")}
                />

                <CardButton
                    icon={null}
                    title="Create Quotation"
                    description="Share pricing before confirmation"
                    onClick={() => onSelect("create-quotation")}
                />

                <CardButton
                    icon={null}
                    title="View Documents"
                    description="Invoices, bills & quotations"
                    onClick={() => onSelect("documents")}
                />
            </div>
        </div>
    );
}