import CardButton from "../../../Components/CardButton";
export default function InvoiceBillingHome({ onSelect }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">🧾 Invoice & Billing</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                Create invoices, quotations and bills for catering orders
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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