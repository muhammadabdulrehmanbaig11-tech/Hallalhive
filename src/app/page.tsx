"use client";

import React, { useEffect, useState } from "react";
import { getProducts, getVendors } from "@/lib/firestore";
import ProductCard from "@/components/ProductCard";
import VendorCard from "@/components/VendorCard";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, v] = await Promise.all([getProducts(), getVendors()]);
        setProducts(p);
        setVendors(v);
      } catch (err) {
        console.error("Firestore load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-12">
      {/* ✅ Header + Dashboard Button */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">🕌 HalalHive</h1>
        <p className="text-gray-500 mb-6">
          Find trusted Halal vendors and certified products near you.
        </p>
        <div className="flex justify-center">
          <Link href="/vendor/dashboard" className="btn btn-primary">
            Vendor Dashboard
          </Link>
        </div>
      </section>

      {/* ✅ Vendors Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Vendors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vendors.length > 0 ? (
            vendors.map((v) => <VendorCard key={v.id} vendor={v} />)
          ) : (
            <p className="text-gray-500">No vendors found.</p>
          )}
        </div>
      </section>

      {/* ✅ Products Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-gray-500">No products available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
