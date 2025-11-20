"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Awlad Hossin",
    role: "Senior Product Designer",
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
  },
  {
    name: "Nasir Uddin",
    role: "CEO",
    quote:
      "Their delivery process is seamless. The real-time tracking feature keeps me confident that my parcels will reach safely.",
  },
  {
    name: "Rasel Ahamed",
    role: "CTO",
    quote:
      "We’ve been using this service for months now. Extremely reliable, fast, and professional. Highly recommended!",
  },
  {
    name: "Sumaiya Rahman",
    role: "E-commerce Merchant",
    quote:
      "Excellent customer support and fast parcel delivery. My customers are happier than ever — it’s a total game changer!",
  },
  {
    name: "Tanvir Ahmed",
    role: "Business Owner",
    quote:
      "I love how they handle every delivery with care. Their return system also saves us a lot of time and effort.",
  },
  {
    name: "Sadia Islam",
    role: "Marketing Manager",
    quote:
      "Best experience so far! The communication, tracking updates, and delivery speed are top-notch.",
  },
  {
    name: "Mehedi Hasan",
    role: "Freelancer",
    quote:
      "Reliable service with excellent communication. Even urgent deliveries are handled smoothly. 5 stars!",
  },
  {
    name: "Tania Akter",
    role: "Online Seller",
    quote:
      "Their parcel pickup and drop-off system works flawlessly. My business runs more efficiently thanks to their service.",
  },
  {
    name: "Arif Hossain",
    role: "Operations Head",
    quote:
      "From logistics to delivery tracking, everything feels perfectly integrated and easy to manage.",
  },
  {
    name: "Nusrat Jahan",
    role: "Entrepreneur",
    quote:
      "I’ve used many courier services, but none come close to their speed and professionalism. Highly satisfied!",
  },
];

const CustomerReviews = () => {
  return (
    <div className="bg-[#F8FAFB] py-20 text-center">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#03373D] mb-4">
          What our customers are saying
        </h2>
        <p className="text-gray-500">
          Enhance posture, mobility, and well-being effortlessly with Pathao
          Courier. Achieve proper alignment, reduce pain, and strengthen your
          business with ease!
        </p>
      </div>

      {/* Swiper Carousel */}
      <div className="max-w-5xl mx-auto relative">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={40}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mySwiper"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white shadow-lg rounded-2xl p-8 text-left hover:scale-[1.02] transition-transform duration-300">
                <span className="text-5xl text-teal-500 font-serif">“</span>
                <p className="text-gray-700 mt-4 mb-6">{item.quote}</p>
                <hr className="border-gray-200 mb-4" />
                <h4 className="font-bold text-[#03373D]">{item.name}</h4>
                <p className="text-gray-500 text-sm">{item.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CustomerReviews;
