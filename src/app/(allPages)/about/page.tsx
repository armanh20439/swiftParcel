"use client";
import React from 'react';
import { ShieldCheck, Truck, Users, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Project Vision */}
      <section className="bg-[#00302E] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
          About Swift-Parcel
        </h1>
        <p className="max-w-2xl mx-auto text-gray-300 text-lg">
          Revolutionizing logistics through real-time tracking, secure payments, and operational transparency.
        </p>
      </section>

      {/* Core Mission Section */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Swift-Parcel is designed to bridge the gap between customers and reliable delivery services. 
              Our platform ensures **Data Privacy** by using advanced encryption, providing a secure 
              environment for both senders and riders.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We focus on **Social Sustainability** by improving the workplace for riders and making 
              parcel tracking accessible for everyone in the community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-gray-50 rounded-3xl text-center border border-gray-100 shadow-sm">
              <ShieldCheck className="mx-auto text-lime-600 mb-2" size={40} />
              <h4 className="font-bold text-gray-800">Secure</h4>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl text-center border border-gray-100 shadow-sm">
              <Truck className="mx-auto text-blue-600 mb-2" size={40} />
              <h4 className="font-bold text-gray-800">Fast</h4>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl text-center border border-gray-100 shadow-sm">
              <Users className="mx-auto text-orange-600 mb-2" size={40} />
              <h4 className="font-bold text-gray-800">Reliable</h4>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl text-center border border-gray-100 shadow-sm">
              <Globe className="mx-auto text-purple-600 mb-2" size={40} />
              <h4 className="font-bold text-gray-800">Scalable</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 uppercase">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="font-bold text-xl mb-4">Economic Health</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Automating orders and inventory management reduces operational costs and minimizes human errors, 
                ensuring long-term profitability.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="font-bold text-xl mb-4">Auditability</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every action in our system is logged, creating a transparent audit trail that prevents 
                fraud and ensures accountability.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="font-bold text-xl mb-4">Eco-Friendly</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                By digitizing all paperwork, we reduce waste and optimize delivery routes to decrease 
                the carbon footprint of our logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-6 italic text-gray-400">Join the future of Logistics.</h2>
        <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-300">
          Swift-Parcel Management System • 2026
        </p>
      </section>
    </div>
  );
};

export default AboutPage;