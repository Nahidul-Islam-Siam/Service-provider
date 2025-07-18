"use client";
import img from "@/assets/card-icon/img1.png";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { useGetPopularProviderQuery } from "@/redux/features/landingPageApi/PopularShippingAPI";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";

const ShippingSlider: React.FC = () => {
  const swiperRef = useRef<SwiperType>();

  const { data, isLoading, isError } = useGetPopularProviderQuery();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
            ? "fill-yellow-200 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  if (isLoading) return <p className="text-center py-8">Loading...</p>;
  if (isError) return <p className="text-center text-red-500 py-8">Failed to load providers.</p>;

  const providers = data?.data ?? [];

  return (
    <div className="w-full bg-white grid grid-cols-1 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Popular Shipping Provider
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 group z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 group z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
          </div>
        </div>

        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass:
              "swiper-pagination-bullet !w-3 !h-3 !bg-gray-300 !opacity-100 transition-all duration-200",
            bulletActiveClass:
              "swiper-pagination-bullet-active !bg-orange-500 !w-8 !rounded-full",
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          loop={true}
          className="!pb-12"
        >
          {providers.map((provider) => (
            <SwiperSlide key={provider?.providerId}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full border">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    // src={provider.companyImage || img}
                    src={img}
                    alt={provider?.companyname}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between h-[calc(100%-12rem)]">
                  <div className="flex items-center gap-1 text-sm mb-3 justify-center text-gray-700">
                    {renderStars(provider?.totalReview || 0)}
                    <span className="ml-1 font-medium">
                      {provider?.totalReview || 0} ({provider?.reviewCount || 0} Reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-left text-gray-900 mb-4">
                    {provider?.companyname}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                    {["Door Pickup", "Shipping", "Dropoff"].map((name, index) => {
                      const formattedType = name.toUpperCase().replace(" ", "_");
                      const isAvailable = provider?.itemTypes.includes(formattedType);
                      return (
                        <div
                          key={index}
                          className={`flex items-center rounded-[4px] border-[1px] gap-2 justify-center ${
                            isAvailable ? "border-[#E6F5D0]" : "border-red-200"
                          }`}
                        >
                          <span
                            className={`text-base ${
                              isAvailable ? "text-[#A3D26A]" : "text-red-400"
                            }`}
                          >
                            {isAvailable ? "✔" : "✖"}
                          </span>
                          <span className="text-[13px]">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-auto flex flex-col items-start gap-3">
                    <div className="text-2xl font-bold text-gray-900">
                      ${provider?.totalTypeAmount}
                    </div>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md text-sm transition-all">
                      Select Provider
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ShippingSlider;
