import { useState, useEffect } from "react";
// import items from "../../utils/items.json";
import { CheckCircle, ListChecks } from "lucide-react";
import { saveListToDB, getAllItems } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import { Checkbox, Input, Button, Select, Textarea } from "../../Components/BasicComponents";
import { generatedListService } from "../../api/service";
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
    const { showToast } = useToast();

    const [items, setItems] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getAllItems();
        setItems(data);
    };

    const filteredItems =
        categoryFilter === "all"
            ? items
            : items.filter((i) => i.category === categoryFilter);

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
                quantity: selected[i.itemId].quantity,
                unit: selected[i.itemId].unit,
                comment: selected[i.itemId].comment,
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
            // 1️⃣ Save offline
            await saveListToDB(payload);

            // 2️⃣ Save to MongoDB (online)
            if (navigator.onLine) {
                await generatedListService.saveGeneratedList(payload);
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
        <div className="card p-6 w-full max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-orange-400" />
                    Generate Item List
                </h2>

                {/* Name + Date */}
                <div className="flex gap-3">
                    <Input
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        placeholder="List name"
                        className="px-3 py-2 rounded-md border text-sm
        bg-transparent focus:outline-none focus:ring-2
        focus:ring-orange-400"
                    />

                    <Input
                        type="date"
                        value={listDate}
                        onChange={(e) => setListDate(e.target.value)}
                        className="px-3 py-2 rounded-md border text-sm
        bg-transparent focus:outline-none focus:ring-2
        focus:ring-orange-400"
                    />
                </div>

                <div className="flex gap-3 mb-4">
                    <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-48"
                    >
                        <option value="all">All Categories</option>
                        {itemsCategory && itemsCategory.map((_obj) => (
                            <option value={_obj?.value}>{_obj?.label}</option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-sm font-semibold text-gray-500 dark:text-gray-300 border-b pb-2 mb-3">
                <div className="col-span-1"></div>
                <div className="col-span-5">Item</div>
                <div className="col-span-3">Tamil Name</div>
                <div className="col-span-3">Quantity</div>
            </div>

            {/* Items */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {filteredItems && filteredItems.map((item) => {
                    const isChecked = !!selected[item.itemId];

                    return (
                        <div
                            key={item.itemId}
                            onClick={() => toggleItem(item)}
                            className={`grid grid-cols-12 items-center gap-2 p-3 rounded-lg border
                transition
                ${isChecked
                                    ? "border-orange-400 bg-orange-50 dark:bg-white/5"
                                    : "border-gray-200 dark:border-white/10"
                                }`}
                        >
                            {/* Checkbox */}
                            <div className="col-span-1 flex justify-center">
                                <Checkbox
                                    type="checkbox"
                                    checked={isChecked}
                                    // onChange={() => toggleItem(item)}
                                    className="w-4 h-4 accent-orange-500"
                                />
                            </div>

                            {/* Name */}
                            <div className="col-span-5 font-medium" >
                                {item.name}
                                <p className="text-xs italic opacity-40">
                                    {item.description}
                                </p>
                            </div>

                            {/* Tamil */}
                            <div className="col-span-3 opacity-80">
                                {item.tamilName}
                            </div>

                            {/* Quantity */}
                            <div className="col-span-3" onClick={(e) => e.stopPropagation()}>
                                {isChecked ? (
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="text"
                                            value={selected[item.itemId]?.quantity || ""}
                                            onChange={(e) => updateQty(item.itemId, e.target.value)}
                                            className="
                                                        min-w-[52px]
                                                        sm:min-w-[72px]
                                                        px-2 py-2
                                                        text-base
                                                        text-black
                                                        bg-white
                                                        border
                                                        rounded-md
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-orange-400
                                                        "
                                        />

                                        <Input
                                            type="text"
                                            value={selected[item.itemId]?.unit || ""}
                                            onChange={(e) => updateUnit(item.itemId, e.target.value)}
                                            className="
                                                        min-w-[52px]
                                                        sm:min-w-[72px]
                                                        px-2 py-2
                                                        text-base
                                                        text-black
                                                        bg-white
                                                        border
                                                        rounded-md
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-orange-400
                                                        "
                                            placeholder="unit"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCommentFor(item.itemId);
                                                setCommentText(selected[item.itemId]?.comment || "");
                                            }}
                                            className={`text-lg ${selected[item.itemId]?.comment
                                                ? "text-green-500"
                                                : "text-gray-400"
                                                }`}
                                            title="Add comment"
                                        >
                                            <MessageSquare
                                                size={18}
                                                className={
                                                    selected[item.itemId]?.comment
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-sm opacity-50">—</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action */}
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600
            text-white px-6 py-2.5 rounded-lg font-semibold transition"
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