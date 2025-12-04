import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import "aos/dist/aos.css";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



import "@/app/globals.css";
import Navbar from "@/components/Shared/Navbare/Navbar";
import Footer from "@/components/Shared/Footer/Footer";
import { AuthProvider } from "../Provider";

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
  title: "Swift-Parcel",
  description: "Fast & reliable delivery service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`  max-w-7xl mx-auto ${geistSans.variable} ${geistMono.variable} ${urbanist.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar></Navbar>
          <main>{children}</main>
        </AuthProvider>
        <Footer></Footer>
      </body>
    </html>
  );
}
