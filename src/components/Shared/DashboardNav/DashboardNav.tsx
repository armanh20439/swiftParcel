"use client";
import React from "react";
import Link from "next/link";
import BrandLogo from "../Logo/BrandLogo";
import { useSession } from "next-auth/react";
import { 
  LayoutDashboard, Package, Users, Truck, 
  History, Wallet, UserCircle, UserCheck, 
  Clock, Home, CreditCard 
} from "lucide-react";

export default function DashboardNav() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  if (status === "loading") {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner text-lime-600"></span>
      </div>
    );
  }

  return (
    <div className="drawer-side z-50 shadow-xl">
      <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
      
      <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col">
        <div className="mb-6 px-4">
          <BrandLogo />
        </div>

        <ul className="space-y-2 flex-1">
          {/* Admin Specific Links - High Level Management */}
          {role === "admin" && (
            <>
              <li className="menu-title text-lime-600 font-bold uppercase text-[10px] tracking-widest mb-2">Admin Control</li>
              <li><Link href="/dashboard/admin"><LayoutDashboard size={18}/> Admin Overview</Link></li>
              <li><Link href="/dashboard/admin/parcel-management"><Package size={18}/> Assign Riders</Link></li>
              <li><Link href="/dashboard/admin/all-users"><Users size={18}/> All Users</Link></li>
              <li><Link href="/dashboard/admin/pending-rider"><Clock size={18}/> Pending Riders</Link></li>
              <li><Link href="/dashboard/admin/active-rider"><UserCheck size={18}/> Active Riders</Link></li>
              <li><Link href="/dashboard/admin/cashout-management"><CreditCard size={18}/> Cashout Management</Link></li>
              <div className="divider"></div>
            </>
          )}

          {/* Regular User Links - Personal Logistics */}
          {role === "user" && (
            <>
              <li className="menu-title text-blue-600 font-bold uppercase text-[10px] tracking-widest mb-2">Customer Menu</li>
              <li><Link href="/dashboard"><LayoutDashboard size={18}/> Overview</Link></li>
              <li><Link href="/dashboard/my-parcels"><Package size={18}/> My Parcels</Link></li>
              <li><Link href="/dashboard/payment-history"><Wallet size={18}/> Payment History</Link></li>
            </>
          )}

          {/* Rider Specific Links - Delivery Operations */}
          {role === "rider" && (
            <>
              <li className="menu-title text-orange-600 font-bold uppercase text-[10px] tracking-widest mb-2">Rider Panel</li>
              <li><Link href="/dashboard"><LayoutDashboard size={18}/> Rider Home</Link></li>
              <li><Link href="/dashboard/rider/my-deliveries"><Truck size={18}/> My Deliveries</Link></li>
              <li><Link href="/dashboard/rider/completed-deliveries"><History size={18}/> Completed Deliveries</Link></li>
            </>
          )}

          {/* Shared Links */}
          <div className="divider opacity-50"></div>
          {/* <li><Link href="/dashboard/profile"><UserCircle size={18}/> My Profile</Link></li> */}
          <li><Link href="/"><Home size={18}/> Back to Home</Link></li>
        </ul>

        {/* User Badge Info */}
        <div className="mt-auto p-4 bg-base-200 rounded-2xl flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
              <span className="text-xs">{session?.user?.name?.charAt(0)}</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}