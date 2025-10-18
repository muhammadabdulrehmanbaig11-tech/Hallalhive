"use client";
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<any[]>([]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">New Product</h1>

      <div className="grid gap-3">
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="SKU" value={sku} onChange={(e)=>setSku(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Category ID" value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" type="number" placeholder="Price (pennies)" value={price} onChange={(e)=>setPrice(parseInt(e.target.value||"0",10))} />
        <input className="border rounded px-3 py-2 bg-transparent" type="number" placeholder="Stock" value={stock} onChange={(e)=>setStock(parseInt(e.target.value||"0",10))} />

        <ImageUploader folder="products" onDone={(u)=>setImages((p)=>[...p, u])} />
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i)=> (
            <img key={i} src={img.w300} className="h-24 w-full object-cover rounded-xl" />
          ))}
        </div>

        <button
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-800 mt-2"
          onClick={async()=>{
            const payload = {
              title, slug, sku,
              categoryId, price, stock,
              images, tags: [], unit: "pcs",
              active: true, taxRate: 0
            };
            const r = await fetch("/api/products", {
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify(payload)
            });
            if (r.ok) location.href = "/(admin)/products";
          }}>
          Save
        </button>
      </div>
    </div>
  );
}
