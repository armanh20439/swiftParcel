"use client";

import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from "@/assets/banner/banner1.png";
import banner2 from "@/assets/banner/banner2.png";
import banner3 from "@/assets/banner/banner3.png";

const Banner = () => {
  return (
    
      <Carousel   autoPlay infiniteLoop showThumbs={false}>
        <div>
          <Image  src={banner1} alt="Banner 1" />
        </div>
        <div>
          <Image  src={banner2} alt="Banner 1" />
        </div>
        <div>
          <Image src={banner3} alt="Banner 1" />
        </div>
      </Carousel>
    
  );
};

export default Banner;
