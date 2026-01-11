export default function ItemDetails({ item }) {
  return (
    <div className="space-y-4 text-sm">
      <Detail label="Name" value={`${item.name}/${item.tamilName}`} />
      <Detail label="Code" value={item.code} />
      <Detail label="Category" value={item.category} />
      <Detail label="Price" value={`₹${item.price}`} />
      <Detail label="Default Quantity" value={`${item.defaultQuantity} ${item.unit}`} />
      <Detail label="Description" value={item.description} />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs opacity-60 mb-1">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}