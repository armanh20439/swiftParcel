"use client";
import React from "react";
import FeatureCard from "./FeatureCard";
import fimg1 from "@/assets/live-tracking.png"
import fimg2 from "@/assets/safe-delivery.png"


const featuresData = [
  {
    image: fimg1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
  },
  {
    image: fimg2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    image: fimg2,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns — anytime you need us.",
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {featuresData.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
