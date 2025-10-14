"use client";
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";

export default function VendorDashboard() {
  const { user, profile, logout } = useAuth();

  return (
    <RequireRole role="vendor">
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <p>Welcome, {profile?.displayName || user?.phoneNumber || "Vendor"} 👋</p>

        {/* Starter cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Products</h3>
              <p>Manage your product list and inventory.</p>
              <button className="btn btn-primary btn-sm">Open</button>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Orders</h3>
              <p>Track incoming orders and statuses.</p>
              <button className="btn btn-primary btn-sm">Open</button>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Payouts</h3>
              <p>Connect Stripe and view payouts.</p>
              <button className="btn btn-primary btn-sm">Open</button>
            </div>
          </div>
        </div>

        <button className="btn btn-error" onClick={logout}>Logout</button>
      </main>
    </RequireRole>
  );
}
