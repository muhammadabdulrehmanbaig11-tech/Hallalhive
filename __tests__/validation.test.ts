import { CategorySchema, ProductSchema } from "@/lib/validation";

describe("Zod schemas", () => {
  test("ProductSchema accepts minimal valid payload", () => {
    const ok = ProductSchema.parse({
      title: "Test Product",
      slug: "test-product",
      sku: "SKU-1",
      categoryId: "cat123",
      price: 999,      // pennies
      stock: 0,
      images: [],
      tags: []
    });
    expect(ok.slug).toBe("test-product");
    expect(ok.unit).toBeDefined(); // default "pcs"
  });

  test("ProductSchema rejects bad slug", () => {
    expect(() => ProductSchema.parse({
      title: "X",
      slug: "BAD SLUG!",
      sku: "SKU-2",
      categoryId: "cat123",
      price: 100,
      stock: 0,
      images: [],
      tags: []
    })).toThrow();
  });

  test("CategorySchema accepts minimal", () => {
    const ok = CategorySchema.parse({ name: "Meat", slug: "meat", sort: 0 });
    expect(ok.name).toBe("Meat");
  });
});
