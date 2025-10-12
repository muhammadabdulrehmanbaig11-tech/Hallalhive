import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getVendors() {
  const snap = await getDocs(collection(db, "vendors"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductsByVendor(vendorId: string) {
  const q = query(collection(db, "products"), where("vendorId", "==", vendorId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
