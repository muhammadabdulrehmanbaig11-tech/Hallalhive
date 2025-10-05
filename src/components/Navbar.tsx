"use client";

import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 px-4">
      {/* Left: Brand */}
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold text-primary">
          HalalHive
        </Link>
      </div>

      {/* Right: Links + Theme Toggle */}
      <div className="flex-none flex items-center gap-4">
        <Link href="/vendors" className="text-sm font-medium hover:underline">
          Vendors
        </Link>
        <Link href="/products" className="text-sm font-medium hover:underline">
          Products
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
}