"use client";

import Link from "next/link";
import BrandLogo from "../Logo/BrandLogo";

export default function DashboardNav() {
  return (
    <div className="drawer-side bg-base-100 z-50">
      <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
    <BrandLogo></BrandLogo>
      <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        
        <li><Link href="/dashboard/my-parcels">📦 My Parcels</Link></li>
        <li><Link href="/dashboard/create">➕ Create Parcel</Link></li>
        <li><Link href="/dashboard/profile">👤 Profile</Link></li>
      </ul>
    </div>
  );
}
