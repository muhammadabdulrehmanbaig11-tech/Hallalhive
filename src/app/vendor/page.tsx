import VendorCard from "@/components/VendorCard";

export default function VendorsPage() {
  return (
    <main className="p-8 grid gap-4">
      <VendorCard name="Zaytun Foods" category="Halal Groceries" />
      <VendorCard name="ModestWear UK" category="Islamic Clothing" />
    </main>
  );
}