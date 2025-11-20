import Image from "next/image";
import React from "react";
// import image from "@/assets/illustation/Illustration.png"
interface Feature {
  image: string;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const { image, title, description } = feature;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 gap-6 hover:shadow-md transition">
      <div className="flex-shrink-0 w-40 h-40 flex justify-center items-center ">
        
        <Image  className="w-full h-full object-contain" src={image} width={200}height={200} alt={title}/>
      </div>
      <div className="hidden md:block w-px  h-24 border-l-2 border-dashed border-gray-300"></div>
      <div className="text-center md:text-left pt-5 px-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
