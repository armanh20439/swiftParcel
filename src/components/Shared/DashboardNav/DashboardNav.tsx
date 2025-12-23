"use client";
import Link from "next/link";
import BrandLogo from "../Logo/BrandLogo";
import { useSession } from "next-auth/react";

export default function DashboardNav() {
  
  const { data: session, status } = useSession();
const role = (session?.user as any)?.role;
  if (status === "loading") return <p>Loading...</p>;
  

  return (
    <div className="drawer-side bg-base-100 z-50">
      <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
      <BrandLogo />
      <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        {/* Admin Specific Links */}
        {role === "admin" && (
          <>
            <li className="menu-title text-lime-600">Admin Menu</li>
            <li><Link href="/dashboard/admin">📊 Admin Overview</Link></li>
            <li><Link href="/dashboard/admin/all-parcels">📦 Manage All Parcels</Link></li>
            <li><Link href="/dashboard/admin/all-users">👥 All Users</Link></li>
            <div className="divider"></div>
          </>
        )}

        {/* Regular User Links */}
        {role === "user" && (
          <>
            <li><Link href="/dashboard/my-parcels">📦 My Parcels</Link></li>
            <li><Link href="/dashboard/payment-history">💸 Payment History</Link></li>
          </>
        )}

        <li><Link href="/dashboard/profile">👤 Profile</Link></li>
      </ul>
    </div>
  );
}