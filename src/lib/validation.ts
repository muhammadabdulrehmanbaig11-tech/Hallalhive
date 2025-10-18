import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: z.string().nullable().optional(),
  image: z.object({
    original: z.string().url(),
    w1200: z.string().url(),
    w600: z.string().url(),
    w300: z.string().url()
  }).nullable().optional(),
  sort: z.number().int().default(0),
});

export const ProductSchema = z.object({
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sku: z.string().min(1),
  barcode: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  brand: z.string().optional().nullable(),
  unit: z.enum(["kg","g","lb","ml","l","pcs"]).default("pcs"),
  price: z.number().int().nonnegative(),
  salePrice: z.number().int().nonnegative().nullable().optional(),
  taxRate: z.number().min(0).max(25).default(0),
  stock: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
  images: z.array(z.object({
    original: z.string().url(),
    w1200: z.string().url(),
    w600: z.string().url(),
    w300: z.string().url(),
    keyBase: z.string(),
  })).default([]),
  tags: z.array(z.string()).default([]),
});
