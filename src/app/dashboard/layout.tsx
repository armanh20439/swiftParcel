import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "../Provider";
import DashboardNav from "@/components/Shared/DashboardNav/DashboardNav";

// Fonts
const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
  variable: "--font-urbanist",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard | Swift-Parcel",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`max-w-7xl mx-auto ${geistSans.variable} ${geistMono.variable} ${urbanist.variable} antialiased`}
      >
        <AuthProvider>
          {/* MAIN DASHBOARD WRAPPER */}
          <div className="drawer lg:drawer-open min-h-screen">
            {/* Mobile Drawer Toggle */}
            <input
              id="dashboard-drawer"
              type="checkbox"
              className="drawer-toggle"
            />

            {/* CONTENT AREA */}
            <div className="drawer-content flex flex-col">
              {/* TOP NAV */}
              <div className="w-full bg-base-100 shadow p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Dashboard</h1>

                {/* Mobile Menu Button */}
                <label
                  htmlFor="dashboard-drawer"
                  className="btn btn-primary drawer-button lg:hidden"
                >
                  Menu
                </label>
              </div>

              {/* PAGE CONTENT */}
              <main className="p-5 bg-base-200 flex-1 rounded-lg mt-4">
                {children}
              </main>
            </div>

            {/* SIDEBAR */}
            <DashboardNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
