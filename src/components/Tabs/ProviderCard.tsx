import React, { useState } from "react";
import { Star, Plus } from "lucide-react";
import Express from "@/components/icons/express";
import Image from "next/image";

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  services: string[];
  additionalServices?: string[];
  price: number;
  deliveryTime?: string;
  isBestValue?: boolean;
  logo?: string;
}

interface ProviderCardProps {
  provider: Provider;
  selected?: boolean;
  onSelect: () => void;
}

const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
};

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  selected,
  onSelect,
}) => {
  const services = provider.services || [];
  const additionalServices = provider.additionalServices || [];
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className={`bg-white border rounded-xl p-6 relative md:py-10 transition-shadow duration-200 mb-6 ${
        selected
          ? "border-[#FA8800] shadow-md"
          : "border-gray-200 hover:border-[#FA8800] hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      {provider.isBestValue && (
        <div className="absolute top-4 right-4 md:top-[25%] md:right-[15%]">
          <span className="bg-[#FFEDC2] text-[#FA8800] px-3 py-2 rounded-full text-xs font-semibold">
            Best Value
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
            {!provider.logo || logoError ? (
              <Express />
            ) : (
              <Image
                src={provider.logo}
                alt={provider.name}
                className="w-12 h-12 rounded-full object-cover"
                width={48}
                height={48}
                onError={() => setLogoError(true)}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="md:text-[28px] text-xl font-semibold text-[#1f2937] mb-2">
              {provider.name}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {renderStars(provider.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {provider.rating} ({provider.reviews} Reviews)
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {services.map((service) => (
                <span
                  key={service}
                  className="bg-gray-100 text-[#1f1f39] px-3 py-1 rounded-full text-sm capitalize"
                >
                  {service}
                </span>
              ))}
            </div>

            {additionalServices.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {additionalServices.map((service) => (
                  <button
                    key={service}
                    className="text-blue-600 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {service}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                No additional services available.
              </p>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0 ml-4 mt-4 md:mt-0">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${provider.price}
          </div>
          <div className="text-sm font-normal text-[#6b7280]">
            Estimated delivery: {provider.deliveryTime || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
