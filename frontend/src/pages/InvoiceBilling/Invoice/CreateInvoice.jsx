import { useState } from "react";
import { motion } from "framer-motion";
import InvoicePreview from "./InvoicePreview"
import PdfLayout from "../../../utils/InvoiceTemplate";

export default function CreateInvoice({ onSelect, onBack, type = "INVOICE", invoice, setInvoice }) {

    const [showPreview, setShowPreview] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">🧾 Create {type}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        Generate {type.toLowerCase()} for catering service
                    </p>
                </div>

                <button
                    onClick={onBack}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                >
                    ← Back
                </button>
            </div>

            {/* DOCUMENT INFO */}
            <Section title="Invoice Details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label="Invoice No"
                        value={invoice.invoiceNo}
                        disabled
                    />

                    <Input
                        label="Invoice Date"
                        type="date"
                        value={invoice.date}
                        onChange={(e) =>
                            setInvoice({ ...invoice, date: e.target.value })
                        }
                    />
                </div>
            </Section>

            {/* CLIENT INFO */}
            <Section title="Client Details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label="Client Name"
                        placeholder="Enter client name"
                        value={invoice.client.name}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                client: { ...invoice.client, name: e.target.value }
                            })
                        }
                    />

                    <Input
                        label="Mobile Number"
                        placeholder="Enter mobile number"
                        value={invoice.client.mobile}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                client: { ...invoice.client, mobile: e.target.value }
                            })
                        }
                    />

                    <Input
                        label="Address"
                        placeholder="Location / Address"
                        value={invoice.client.address}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                client: { ...invoice.client, address: e.target.value }
                            })
                        }
                    />
                </div>
            </Section>

            {/* EVENT INFO */}
            <Section title="Event Details">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Select
                        label="Function Type"
                        value={invoice.event.functionType}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                event: { ...invoice.event, functionType: e.target.value }
                            })
                        }
                        options={[
                            "Wedding",
                            "Birthday",
                            "Housewarming",
                            "Corporate Event",
                            "Other"
                        ]}
                    />

                    <Input
                        label="Event Date"
                        type="date"
                        value={invoice.event.eventDate}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                event: { ...invoice.event, eventDate: e.target.value }
                            })
                        }
                    />

                    <Input
                        label="No of Pax"
                        placeholder="Eg: 200"
                        value={invoice.event.pax}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                event: { ...invoice.event, pax: e.target.value }
                            })
                        }
                    />

                    <Input
                        label="Location"
                        placeholder="Event location"
                        value={invoice.event.location}
                        onChange={(e) =>
                            setInvoice({
                                ...invoice,
                                event: { ...invoice.event, location: e.target.value }
                            })
                        }
                    />
                </div>
            </Section>

            {/* ITEMS PLACEHOLDER */}
            <Section title="Invoice Items">
                <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
                    Item table coming next…
                </div>
            </Section>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 sm:gap-4 mt-8">
                <button
                    onClick={() => onSelect("preview")}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    Preview
                </button>

                <button
                    className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition disabled:opacity-50"
                    disabled
                >
                    Save Invoice <i>(Under Development)</i>
                </button>
            </div>


        </motion.div>
    );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
    return (
        <div className="mb-6 sm:mb-8">
            <h3 className="font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
            {children}
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{label}</label>
            <input
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                {...props}
            />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{label}</label>
            <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                {...props}
            >
                <option value="">Select</option>
                {options.map((opt) => (
                    <option key={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}