"use client";
import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Role } from "@/types/user";

export default function RequireRole({
  role: required,
  children,
}: PropsWithChildren<{ role: Role }>) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth-test"); // not logged in
      return;
    }
    if (role !== required && role !== "admin") {
      router.replace("/"); // logged in but not allowed
    }
  }, [loading, user, role, required, router]);

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user) return null; // redirected
  if (role !== required && role !== "admin") return null; // redirected
  return <>{children}</>;
}
