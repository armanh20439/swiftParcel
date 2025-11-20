import { ServiceCardProps } from "@/type";
import React from "react";





const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="bg-white text-center hover:text-pink-600 hover:bg-[#CAEB66] text-primary  rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <div className=" text-4xl mb-4 flex justify-center">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2  text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
 