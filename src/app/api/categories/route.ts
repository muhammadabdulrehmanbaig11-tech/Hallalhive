// src/app/api/categories/route.ts
import type { NextRequest } from "next/server";
import { db } from "@/server/firebaseAdmin"; // or use relative: "../../../../server/firebaseAdmin"

const col = () => db.collection("categories");

export async function GET() {
  const snap = await col().orderBy("sort").get();
  return new Response(JSON.stringify(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // If you validate, import CategorySchema and parse here
  // const data = CategorySchema.parse(body);
  const now = new Date();
  const ref = await col().add({ ...body, createdAt: now, updatedAt: now });
  return new Response(JSON.stringify({ id: ref.id }), { status: 201 });
}
