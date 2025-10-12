"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/lib/firestore";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  vendorId?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const p = (await getProducts()) as Product[];
        setProducts(p);
      } catch (e) {
        console.error("Error loading products:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <main className="p-6">Loading products…</main>;

  if (!products.length)
    return <main className="p-6">No products available yet.</main>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">£{product.price?.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
