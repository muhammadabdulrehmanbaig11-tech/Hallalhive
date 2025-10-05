// src/components/VendorCard.tsx
export default function VendorCard({ name, category }: { name: string; category: string }) {
  return (
    <div className="card bg-base-100 shadow-md p-4 border border-base-300">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>
    </div>
  );
}