import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import formImg from "@/assets/authImage.png"



import "@/app/globals.css";

import Image from "next/image";
import BrandLogo from "@/components/Shared/Logo/BrandLogo";

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  // Specify the weights you plan to use, e.g., 400, 700
  weight: ['400', '700', '900'],
  variable: '--font-urbanist', // Define the CSS variable
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
  title: "swiftparcel Auth",
  description: "Fast & reliable delivery service",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`  max-w-7xl mx-auto ${geistSans.variable} ${geistMono.variable} ${urbanist.variable} antialiased`}
      >
        <div className="p-12 bg-base-200 ">
          <BrandLogo></BrandLogo>


        <div className="hero-content r flex-col lg:flex-row-reverse">
          <div className="flex-1">
            <Image
              src={formImg} alt="Auth Image"
              className="max-w-sm rounded-lg shadow-2xl ml-10"
            />
          </div>
          <main className="flex-1">{children}</main>
        </div>
        </div>


      </body>
    </html>
  );
}
