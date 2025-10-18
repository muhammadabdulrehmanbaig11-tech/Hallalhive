"use client";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/categories");
      setItems(await r.json());
    })();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <div className="grid gap-3">
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} />
        <ImageUploader folder="categories" onDone={(urls)=>setImage(urls)} />
        <button
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-800"
          onClick={async ()=>{
            const r = await fetch("/api/categories", {
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({ name, slug, image, sort: 0 })
            });
            if (r.ok) location.reload();
          }}>Create</button>
      </div>

      <ul className="mt-8 divide-y divide-zinc-800">
        {items.map((c)=> (
          <li key={c.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs opacity-70">/{c.slug}</div>
            </div>
            {c.image?.w300 && <img src={c.image.w300} className="h-10 w-10 rounded-lg object-cover" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
