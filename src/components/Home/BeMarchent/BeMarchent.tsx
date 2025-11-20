"use client"; // Important for Next.js App Router

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import location from "@/assets/location-merchant.png";
import bgImg from "@/assets/merchantbg.png";

const BeMerchant = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <div
      style={{ backgroundImage: `url(${bgImg.src})` }}
      className="bg-no-repeat bg-cover bg-[#03373D] rounded-4xl p-20"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
      
        <Image
          data-aos="fade-left"
          src={location}
          alt="Be Merchant"
          className="max-w-sm rounded-lg shadow-2xl"
        />

        
        <div data-aos="fade-right" className="text-white">
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn btn-primary text-black rounded-full">
            Become A Merchant
          </button> 
          <button className="btn btn-outline hover:bg-primary hober:text-black  border-primary ms-4 rounded-full">
            Become A Merchant
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
