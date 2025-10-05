// File: web/src/app/products/page.tsx
import React from "react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Halal Chicken",
    price: 5.99,
    imageUrl: "/images/chicken.jpg",
  },
  {
    id: "2",
    name: "Halal Beef",
    price: 7.49,
    imageUrl: "/images/beef.jpg",
  },
];

export default function ProductsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">£{product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
