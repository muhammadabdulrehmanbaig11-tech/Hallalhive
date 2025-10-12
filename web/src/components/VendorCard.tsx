export default function VendorCard({ vendor }: { vendor: any }) {
  const cats = Array.isArray(vendor.categories) ? vendor.categories.join(", ") : vendor.categories;
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-base-100">
      <h3 className="font-semibold text-lg">{vendor.storeName}</h3>
      <p className="text-sm text-gray-500 mt-1">{cats}</p>
    </div>
  );
}
