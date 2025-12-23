// src/app/dashboard/admin/page.tsx
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const AdminDashboard = async () => {
  const session = await getServerSession(authOptions);
if ((session?.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">Admin Overview</h2>
        <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-semibold text-lime-600">{session?.user?.name}</span>. 
          Manage your parcel system operations here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow bg-white border border-gray-100">
          <div className="stat">
            <div className="stat-figure text-lime-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="stat-title text-gray-500">Total Parcels</div>
            <div className="stat-value text-gray-800">1,240</div>
            <div className="stat-desc text-lime-600">↗︎ 400 (22%)</div>
          </div>
        </div>

        <div className="stats shadow bg-white border border-gray-100">
          <div className="stat">
            <div className="stat-figure text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div className="stat-title text-gray-500">New Users</div>
            <div className="stat-value text-gray-800">4,200</div>
            <div className="stat-desc text-gray-400">Since last month</div>
          </div>
        </div>

        <div className="stats shadow bg-white border border-gray-100">
          <div className="stat">
            <div className="stat-figure text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div className="stat-title text-gray-500">Pending Deliveries</div>
            <div className="stat-value text-gray-800">86</div>
            <div className="stat-desc text-orange-600">Requires attention</div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="btn bg-lime-500 hover:bg-lime-600 text-white border-none">Manage All Users</button>
          <button className="btn btn-outline border-lime-500 text-lime-600 hover:bg-lime-50">View System Logs</button>
          <button className="btn btn-outline border-gray-300">Revenue Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;