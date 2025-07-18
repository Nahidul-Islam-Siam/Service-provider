"use client";

import Image from "next/image";
import React, { useRef } from "react";
import UserImg from "@/assets/card-icon/userImg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StarRating from "@/components/StarRating/StarRating";
import type { Swiper as SwiperType } from "swiper";
import { useGetPublicReviewsQuery } from "@/redux/features/landingPageApi/TestimonialApi";

const TestimonialSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data, isLoading, isError } = useGetPublicReviewsQuery();

  const testimonialData = data?.data || [];

  return (
    <section className="py-12 sm:py-16 grid grid-cols-1 bg-[#FFF0CC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center text-[#FF6B00] font-bold mb-4">
          Testimonials
        </h2>
        <p className="text-center text-sm sm:text-base max-w-3xl mx-auto text-gray-600 mb-8 sm:mb-10">
          Lorem ipsum dolor sit amet consectetur. Fermentum in risus tortor
          cursus vivamus nunc. Nullam dui arcu suscipit posuere malesuada quam.
          Magna scelerisque id massa sed ultricies. Vestibulum.
        </p>

        {isLoading ? (
          <p className="text-center">Loading reviews...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load reviews.</p>
        ) : (
          <div className="w-full overflow-hidden relative px-4 sm:px-10 md:px-12">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition">
                <FaChevronLeft className="text-[#FF6F3C] text-lg" />
              </div>
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition">
                <FaChevronRight className="text-[#FF6F3C] text-lg" />
              </div>
            </button>

            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={1}
              spaceBetween={16}
              loop={false}
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 16 },
                640: { slidesPerView: 1.2, spaceBetween: 24 },
                768: { slidesPerView: 1.5, spaceBetween: 24 },
                1024: { slidesPerView: 2, spaceBetween: 32 },
              }}
              modules={[Navigation, Pagination]}
              className="!pb-10"
            >
              {testimonialData?.map((review) => (
                <SwiperSlide key={review?.id}>
                  <div className="h-full flex flex-col items-center px-2">
                    <div className="w-full flex flex-col relative">
                      <div className="bg-white shadow rounded-xl p-4 sm:p-5 md:p-6 relative">
                        <div
                          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 z-20 shadow"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                            backgroundColor: "white",
                          }}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 559.27 546.15"
                          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto mb-2 sm:mb-3 text-[#F98120] fill-current"
                        >
                          <path d="M336.63,250.54V33.44H553.71v217.1S587.7,503,364.37,512.71V392s85.76,35.63,74.55-141.49Z" />
                          <path d="M3.71,250.54V33.44H220.79v217.1S254.78,503,31.46,512.71V392S117.21,427.66,106,250.54Z" />
                        </svg>

                        <div className="flex justify-center items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                          <StarRating rating={review?.rating} />
                          <span className="ml-1 sm:ml-2">
                            <span className="font-bold text-base sm:text-lg md:text-xl">
                              {review?.rating}
                            </span>
                            <span className="text-xs sm:text-sm md:text-base ml-1">
                              Rating
                            </span>
                          </span>
                        </div>

                        <p className="text-[#555] text-xs sm:text-sm md:text-base lg:text-lg text-center mb-4 sm:mb-5 md:mb-6 leading-relaxed px-2">
                          {review?.comment}
                        </p>
                      </div>

                      <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col items-center">
                        <Image
                          src={review?.user?.picture || UserImg}
                          alt="User Profile"
                          width={40}
                          height={40}
                          className="rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover"
                        />
                        <p className="font-semibold text-black text-sm sm:text-base mt-1 sm:mt-2">
                          {review?.user?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <style jsx global>{`
        .swiper-pagination-bullets {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 1rem;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: #ddd;
          opacity: 1;
          border-radius: 9999px;
        }
        .swiper-pagination-bullet-active {
          background-color: #fa8800;
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
