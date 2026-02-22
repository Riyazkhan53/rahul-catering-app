import { useState, useEffect } from "react";
// import items from "../../utils/items.json";
import { CheckCircle, ListChecks } from "lucide-react";
import { saveListToDB, getAllItems, addToSyncQ } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import { Checkbox, Input, Button, Select, Textarea } from "../../Components/BasicComponents";
import { generatedListService } from "../../api/service";
import { isOfflineMode } from "../../api/api";
import { itemsCategory } from "../../utils/picklist";
import { MessageSquare } from "lucide-react";
import Modal from "../../Components/BasicComponents/Modal";
import ModalCard from "../../Components/BasicComponents/ModalCard";

export default function GenerateSingleList() {
    const [selected, setSelected] = useState({});
    const [listName, setListName] = useState("");
    const [listDate, setListDate] = useState("");
    const [commentFor, setCommentFor] = useState(null); // itemId
    const [commentText, setCommentText] = useState("");
    const [orderCounter, setOrderCounter] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [withQty, setWithQty] = useState(true);
    const { showToast } = useToast();

    const [items, setItems] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getAllItems();
        setItems(data);
    };

    // Filter and group items by category
    const getGroupedItems = () => {
        if (categoryFilter === "all") {
            // Group items by category in the order defined in itemsCategory
            const grouped = {};
            
            // Initialize groups in category order
            itemsCategory.forEach((cat) => {
                grouped[cat.value] = [];
            });
            
            // Add items to their respective categories
            items.forEach((item) => {
                const category = item.category || "Uncategorized";
                if (grouped[category]) {
                    grouped[category].push(item);
                } else {
                    // Handle uncategorized items
                    if (!grouped["Uncategorized"]) {
                        grouped["Uncategorized"] = [];
                    }
                    grouped["Uncategorized"].push(item);
                }
            });
            
            return grouped;
        } else {
            // Single category - return as single group
            return {
                [categoryFilter]: items.filter((i) => i.category === categoryFilter)
            };
        }
    };

    const groupedItems = getGroupedItems();
    
    // Get category display name
    const getCategoryLabel = (categoryValue) => {
        const cat = itemsCategory.find(c => c.value === categoryValue);
        return cat ? cat.label : categoryValue;
    };

    const generateListId = () => {
        const random = Math.floor(1000 + Math.random() * 9000);
        return `RC-LST-${random}`;
    };

    const toggleItem = (item) => {
        setSelected((prev) => {
            if (prev[item.itemId]) {
                return { ...prev, [item.itemId]: null };
            }

            const newItem = {
                quantity: item.defaultQuantity || "",
                unit: item.unit || "",
                comment: "",
                ordNo: orderCounter,
            };

            setOrderCounter((c) => c + 1);

            return {
                ...prev,
                [item.itemId]: newItem,
            };
        });
    };

    const updateUnit = (itemId, value) => {
        setSelected((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                unit: value,
            },
        }));
    };

    const updateQty = (itemId, value) => {
        setSelected((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                quantity: value,
            },
        }));
    };

    const handleGenerate = async () => {
        if (!listName || !listDate) {
            showToast("Please enter list name and date", "error");
            return;
        }

        const selectedItems = items
            .filter((i) => selected[i.itemId])
            .map((i) => ({
                itemId: i.itemId,
                name: i.name,
                tamilName: i.tamilName,
                quantity: withQty ? selected[i.itemId].quantity : "",
                unit: withQty ? selected[i.itemId].unit : "",
                comment: withQty ? selected[i.itemId].comment : "",
                ordNo: selected[i.itemId].ordNo,
            }))
            .sort((a, b) => a.ordNo - b.ordNo);

        if (selectedItems.length === 0) {
            showToast("Please select at least one item", "error");
            return;
        }

        const payload = {
            id: generateListId(),
            name: listName,
            date: listDate,
            createdAt: new Date().toISOString(),
            items: selectedItems,
        };

        try {
            // 1️⃣ Always save to IndexedDB
            await saveListToDB(payload);

            // 2️⃣ Save to MongoDB only if truly online
            if (navigator.onLine && !isOfflineMode()) {
                try {
                    await generatedListService.saveGeneratedList(payload);
                } catch (apiErr) {
                    console.error("Server save failed, queuing for sync:", apiErr);
                    await addToSyncQ("generated_lists", payload.id);
                }
            } else {
                // Queue for later sync
                await addToSyncQ("generated_lists", payload.id);
            }

            showToast(`List ${payload.id} saved successfully`, "success");

            setSelected({});
            setListName("");
            setListDate("");
        } catch (err) {
            console.error(err);
            showToast("Failed to save list", "error");
        }
    };

    return (
        <div className="card p-6 w-full max-w-5xl overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-orange-400" />
                    Generate Item List
                </h2>

                {/* Name + Date */}
                <div className="flex flex-wrap gap-3">
                    <Input
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        placeholder="List name"
                        className="px-3 py-2 rounded-md border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <Input
                        type="date"
                        value={listDate}
                        onChange={(e) => setListDate(e.target.value)}
                        className="px-3 py-2 rounded-md border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="flex gap-3 mb-4 items-center">
                    <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-48"
                    >
                        <option value="all">All Categories</option>
                        {itemsCategory && itemsCategory.map((_obj) => (
                            <option key={_obj?.value} value={_obj?.value}>{_obj?.label}</option>
                        ))}
                    </Select>

                    <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden text-sm">
                        <button
                            type="button"
                            onClick={() => setWithQty(true)}
                            className={`px-3 py-1.5 font-medium transition ${
                                withQty
                                    ? "bg-orange-500 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            With Qty
                        </button>
                        <button
                            type="button"
                            onClick={() => setWithQty(false)}
                            className={`px-3 py-1.5 font-medium transition ${
                                !withQty
                                    ? "bg-orange-500 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            Without Qty
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Header - hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 text-sm font-semibold text-gray-500 dark:text-gray-300 border-b pb-2 mb-3">
                <div className="col-span-1"></div>
                <div className={withQty ? "col-span-4" : "col-span-5"}>Item</div>
                <div className={withQty ? "col-span-3" : "col-span-6"}>Tamil Name</div>
                {withQty && <div className="col-span-4">Quantity</div>}
            </div>

            {/* Items - Grouped by Category */}
            <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
                {Object.keys(groupedItems).map((categoryKey) => {
                    const categoryItems = groupedItems[categoryKey];

                    if (!categoryItems || categoryItems.length === 0) return null;

                    return (
                        <div key={categoryKey} className="space-y-3">
                            {/* Category Header - Only show when "All" is selected */}
                            {categoryFilter === "all" && (
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-700/50">
                                    <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300">
                                        {getCategoryLabel(categoryKey)}
                                    </h3>
                                </div>
                            )}

                            {/* Category Items */}
                            {categoryItems.map((item) => {
                                const isChecked = !!selected[item.itemId];

                                return (
                                    <div
                                        key={item.itemId}
                                        onClick={() => toggleItem(item)}
                                        className={`p-3 rounded-lg border transition cursor-pointer
                                            ${isChecked
                                                ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
                                                : "border-gray-200 dark:border-white/10 hover:border-orange-200 dark:hover:border-orange-800"
                                            }`}
                                    >
                                        {/* Desktop row: checkbox + name + tamil + qty */}
                                        <div className="grid grid-cols-12 items-center gap-2">
                                            {/* Checkbox */}
                                            <div className="col-span-2 sm:col-span-1 flex justify-center">
                                                <Checkbox
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 accent-orange-500"
                                                />
                                            </div>

                                            {/* Name */}
                                            <div className={`col-span-10 font-medium ${withQty ? "sm:col-span-4" : "sm:col-span-5"}`}>
                                                {item.name}
                                                <p className="text-xs italic opacity-40">{item.description}</p>
                                            </div>

                                            {/* Tamil - hidden on mobile */}
                                            <div className={`hidden sm:block opacity-80 ${withQty ? "sm:col-span-3" : "sm:col-span-6"}`}>
                                                {item.tamilName}
                                            </div>

                                            {/* Quantity - hidden on mobile, only when withQty */}
                                            {withQty && (
                                            <div className="hidden sm:block sm:col-span-4" onClick={(e) => e.stopPropagation()}>
                                                {isChecked ? (
                                                    <div className="flex gap-2 items-center">
                                                        <Input
                                                            type="text"
                                                            value={selected[item.itemId]?.quantity || ""}
                                                            onChange={(e) => updateQty(item.itemId, e.target.value)}
                                                            className="w-20 px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="qty"
                                                        />
                                                        <Input
                                                            type="text"
                                                            value={selected[item.itemId]?.unit || ""}
                                                            onChange={(e) => updateUnit(item.itemId, e.target.value)}
                                                            className="w-20 px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="unit"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCommentFor(item.itemId);
                                                                setCommentText(selected[item.itemId]?.comment || "");
                                                            }}
                                                            className={`shrink-0 ${selected[item.itemId]?.comment ? "text-green-500" : "text-gray-400"}`}
                                                            title="Add comment"
                                                        >
                                                            <MessageSquare size={18} className={selected[item.itemId]?.comment ? "text-green-600" : "text-gray-400"} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm opacity-50">—</span>
                                                )}
                                            </div>
                                            )}
                                        </div>

                                        {/* Mobile-only: Tamil + Quantity row stacked below */}
                                        <div className="sm:hidden mt-2 ml-8">
                                            {item.tamilName && (
                                                <span className="text-xs opacity-60 block mb-1">{item.tamilName}</span>
                                            )}
                                            {isChecked && withQty && (
                                                <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Input
                                                        type="text"
                                                        value={selected[item.itemId]?.quantity || ""}
                                                        onChange={(e) => updateQty(item.itemId, e.target.value)}
                                                        className="w-20 px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                        placeholder="qty"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={selected[item.itemId]?.unit || ""}
                                                        onChange={(e) => updateUnit(item.itemId, e.target.value)}
                                                        className="w-20 px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                        placeholder="unit"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCommentFor(item.itemId);
                                                            setCommentText(selected[item.itemId]?.comment || "");
                                                        }}
                                                        className={`shrink-0 ${selected[item.itemId]?.comment ? "text-green-500" : "text-gray-400"}`}
                                                        title="Add comment"
                                                    >
                                                        <MessageSquare size={18} className={selected[item.itemId]?.comment ? "text-green-600" : "text-gray-400"} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Action */}
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition"
                >
                    <CheckCircle className="w-5 h-5" />
                    Generate List
                </Button>
            </div>

            {commentFor && (
                <Modal onClose={() => setCommentFor(null)}>
                    <ModalCard
                        onClose={() => setCommentFor(null)}
                        title="Add Comment"
                        footer={
                            <Button
                                onClick={() => {
                                    setSelected((prev) => ({
                                        ...prev,
                                        [commentFor]: {
                                            ...prev[commentFor],
                                            comment: commentText,
                                        },
                                    }));
                                    setCommentFor(null);
                                    setCommentText("");
                                }}
                            >
                                Save
                            </Button>
                        }
                    >
                        <Textarea
                            autoFocus
                            rows={3}
                            placeholder="Optional comment for this item"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </ModalCard>
                </Modal>
            )}
        </div>
    );
}