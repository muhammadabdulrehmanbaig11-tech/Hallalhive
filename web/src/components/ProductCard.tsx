import Image from "next/image";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-base-100">
      <div className="w-full h-44 relative mb-3 overflow-hidden rounded">
        <Image
          src={product.image || "/images/placeholder.png"}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 mt-1">£{Number(product.price).toFixed(2)}</p>
    </div>
  );
}
