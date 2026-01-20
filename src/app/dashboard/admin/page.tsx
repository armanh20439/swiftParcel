import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

const AdminDashboard = async () => {
  const session = await getServerSession(authOptions);

  // roal varification
  if ((session?.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  // fetch real data
  let stats = { totalParcels: 0, totalUsers: 0, pendingDeliveries: 0 };
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stats`, {
      cache: 'no-store' // for real time data cash are no store
    });
    if (res.ok) {
      stats = await res.json();
    }
  } catch (err) {
    console.error("Stats fetch failed");
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-[#00302E] p-8 rounded-2xl shadow-lg text-white">
        <h2 className="text-3xl font-bold">Admin Overview</h2>
        <p className="opacity-80 mt-1">
          Welcome back, <span className="font-semibold text-[#C8E46E]">{session?.user?.name}</span>. 
          The system is currently monitoring <span className="font-bold">{stats.totalParcels}</span> parcels.
        </p>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Parcels */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Parcels</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.totalParcels}</h3>
            <p className="text-xs text-lime-600 font-medium mt-1">Live Database Status</p>
          </div>
          <div className="p-4 bg-lime-50 rounded-full text-lime-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">System Users</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.totalUsers}</h3>
            <p className="text-xs text-blue-600 font-medium mt-1">Customers & Riders</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Pending Operations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending Tasks</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.pendingDeliveries}</h3>
            <p className="text-xs text-orange-600 font-medium mt-1">Immediate attention required</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-full text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Operational Controls</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/admin/all-users" className="btn bg-lime-500 hover:bg-lime-600 text-white border-none rounded-xl px-6">Manage Users</Link>
          <Link href="/dashboard/admin/cashout-management" className="btn btn-outline border-lime-500 text-lime-600 hover:bg-lime-50 rounded-xl px-6">Payout Requests</Link>
          <button className="btn btn-outline border-gray-300 rounded-xl px-6">Generate Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;