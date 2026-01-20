"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function DashboardHome() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-lime-100 rounded-3xl mb-6 animate-bounce">
          <LayoutDashboard className="text-lime-700 w-10 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 uppercase tracking-tight">
          {role} Control Center
        </h1>
        <p className="text-lg text-gray-500 mt-4 font-medium">
          Welcome back, <span className="text-lime-600 font-bold">{session?.user?.name}</span>. 
          Manage your operations with Swift-Parcel's secure ecosystem.
        </p>
      </div>

      {/* Feature Highlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <Zap className="text-yellow-500 mb-4" size={32} />
          <h3 className="font-bold text-xl mb-2 text-gray-800">Real-time Efficiency</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our system optimizes delivery routes and booking processes to ensure maximum speed and operational growth.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <ShieldCheck className="text-green-500 mb-4" size={32} />
          <h3 className="font-bold text-xl mb-2 text-gray-800">Secure Transactions</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Every payment and user role is protected by industry-standard encryption and role-based access control.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <Sparkles className="text-purple-500 mb-4" size={32} />
          <h3 className="font-bold text-xl mb-2 text-gray-800">User Transparency</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Maintaining trust through clear reporting, tracking history, and open communication channels.
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
          Swift-Parcel Management System • v1.0 • 2026
        </p>
      </div>
    </div>
  );
}