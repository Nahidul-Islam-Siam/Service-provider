import React from "react";
import icon1 from "@/assets/card-icon/heart.png";
import icon2 from "@/assets/card-icon/trust.png";
import icon3 from "@/assets/card-icon/mobile.png";
import Image from "next/image";

export default function AboutBarrel() {
  const steps = [
    {
      title: "Built for Caribbean Families",
      description:
        "Tailored services and support understanding the unique needs of shipping to and from the Caribbean.",
      icon: icon1,
    },
    {
      title: "Trustworthy, Transparent Services",
      description:
        "Verified providers and clear, upfront pricing ensure a reliable and honest shipping experience every time.",
      icon: icon2,
    },
    {
      title: "Seamless Mobile Experience",
      description:
        "Easily manage, book, and track your shipments on the go with our user-friendly mobile platform.",
      icon: icon3,
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-14 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Why Choose Barrel Link?
          </h2>
          <p className="text-base sm:text-md md:text-lg text-gray-600 max-w-2xl">
            We&apos;re dedicated to providing the Caribbean diaspora with a shipping service they can trust and rely on.
          </p>
        </div>

        {/* Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col items-center text-center h-full"
            >
              {/* Image */}
              <div className="w-14 h-14 relative mb-4">
                <Image
                  src={step.icon}
                  alt={step.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
