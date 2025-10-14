"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">HalalHive</Link>
      </div>
      <div className="flex-none gap-2">
        {role === "vendor" && <Link href="/vendor/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>}
        {!user ? (
          <Link href="/auth-test" className="btn btn-outline btn-sm">Login</Link>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
}
