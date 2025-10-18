// src/app/api/products/bulk/route.ts
export const runtime = "nodejs";           // force Node (firebase-admin requires Node)
export const dynamic = "force-dynamic";    // disable static optimization
export async function GET() {
    return new Response(JSON.stringify({ ok: true, route: "products/bulk" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  
import type { NextRequest } from "next/server";
// Use the named export to avoid default-import issues
import { parse } from "papaparse";

// IMPORTANT: use RELATIVE imports if your tsconfig doesn't define "@/..."
import { ProductSchema } from "../../../../lib/validation";
import { db } from "../../../../server/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    // 1) Read raw CSV text
    const text = await req.text();
    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: "Empty body (expected CSV text)" }),
        { status: 400 }
      );
    }

    // 2) Parse CSV with headers
    const result = parse(text, { header: true, skipEmptyLines: true });
    if (result.errors && result.errors.length) {
      return new Response(
        JSON.stringify({ ok: false, parseErrors: result.errors }),
        { status: 400 }
      );
    }

    const rows = (result.data as any[]) || [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "No rows found in CSV" }),
        { status: 400 }
      );
    }

    // 3) Firestore batch write
    const batch = db.batch();
    const errors: Array<{ row: any; error: string }> = [];
    const now = new Date();

    for (const row of rows) {
      try {
        const payload = ProductSchema.parse({
          title: row.title,
          slug: row.slug,
          sku: row.sku,
          categoryId: row.categoryId,
          price: Number(row.price),
          stock: Number(row.stock ?? 0),
          images: [],
          tags: (row.tags || "").split("|").filter(Boolean),
          unit: row.unit || "pcs",
          active: true,
          taxRate: Number(row.taxRate ?? 0),
        });

        const ref = db.collection("products").doc();
        batch.set(ref, { ...payload, createdAt: now, updatedAt: now });
      } catch (e: any) {
        errors.push({ row, error: String(e?.message || e) });
      }
    }

    await batch.commit();

    return new Response(
      JSON.stringify({ ok: true, rows: rows.length, errors }),
      { status: 200 }
    );
  } catch (e: any) {
    console.error("BULK_IMPORT_ERROR:", e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e?.message || e) }),
      { status: 500 }
    );
  }
}
