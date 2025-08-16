"use client";
import ThemeToggle from "./ThemeToggle"; // ✅ Use relative path

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 px-4">
      <div className="flex-1 text-xl font-bold">HalalHive</div>
      <ThemeToggle />
    </div>
  );
}