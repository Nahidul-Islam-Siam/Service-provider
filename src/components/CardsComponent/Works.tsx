import React from "react";
import icon1 from "@/assets/card-icon/box.png";
import icon2 from "@/assets/card-icon/car.png";
import icon3 from "@/assets/card-icon/location.png";
import Image from "next/image";

export default function Works() {
  const steps = [
    {
      title: "Plan Your Shipment",
      description: "Pick item type, origin, destination, and pickup date.",
      icon: icon1,
    },
    {
      title: "Pick Your Shipping Team",
      description: "Mix & match verified providers for shipping, customs, and delivery.",
      icon: icon2,
    },
    {
      title: "Track Your Barrel",
      description: "Get real-time tracking updates until it arrives.",
      icon: icon3,
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading Section */}
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-14 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-md md:text-lg text-gray-600 max-w-2xl">
            We&apos;ve simplified the barrel shipping process so you can focus on what matters - sending love back home.
          </p>
        </div>

        {/* Centered Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 place-items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 transition-all shadow-md duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 w-full max-w-sm flex flex-col items-center text-center"
            >
              {/* Centered Image Container */}
              <div className="mb-4 md:mb-6 w-16 h-16 relative mx-auto">
                <Image 
                  src={step.icon} 
                  alt={step.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
                />
              </div>
              
              {/* Centered Text Content */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}