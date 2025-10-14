"use client";
import { useEffect, useState } from "react";
import VendorCard from "@/components/VendorCard";
import { getVendors } from "@/lib/firestore";

type Vendor = { id:string; storeName:string; categories?:string[]; approved?:boolean };

export default function VendorsPage(){
  const [vendors,setVendors] = useState<Vendor[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{ (async()=>{
      const v = (await getVendors()) as Vendor[]
      setVendors(v); setLoading(false)
  })()},[])

  if(loading) return <main className="p-8">Loading vendors…</main>
  if(!vendors.length) return <main className="p-8">No vendors yet.</main>

  return (
    <main className="p-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map(v=> <VendorCard key={v.id} vendor={v} />)}
    </main>
  )
}
