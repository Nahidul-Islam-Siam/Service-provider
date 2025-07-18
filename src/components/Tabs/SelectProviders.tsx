/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Checkbox, Slider, Button, Pagination, Spin, Alert } from "antd";
import ProviderCard from "@/components/Tabs/ProviderCard";
import { useFindProviderQuery } from "@/redux/features/commonApi/getProviderApi";
import { useRouter } from "next/navigation";

interface Provider {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  services: string[];
  additionalServices?: string[];
  deliveryTime?: string;
  isBestValue?: boolean;
  logo?: string;
}

interface SelectProvidersProps {
  goToNextStep: (provider: Provider) => void;
}

const SelectProviders: React.FC<SelectProvidersProps> = ({ goToNextStep }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedProviderTypes, setSelectedProviderTypes] = useState<string[]>(
    []
  );
  const [selectedPopularFilters, setSelectedPopularFilters] = useState<
    string[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const providersPerPage = 5;
  const { data, isLoading, isError } = useFindProviderQuery({});

  console.log(data);

  const providers: Provider[] = useMemo(() => {
    if (!data?.data?.finalData) return [];

    return data?.data?.finalData.map(
      (item: any): Provider => ({
        id: item.providerId,
        name: item.companyName || "Unknown Provider",
        price: item.prices || 0,
        rating: item.avgRatting || 0,
        reviews: item.rattingCount || 0,
        services: item.providerType?.map((t: any) => t.type) || [],
        additionalServices: [],
        deliveryTime: item.estimatedDeliveryType || "N/A",
        isBestValue: true,
        logo: item.companyLogo || undefined,
      })
    );
  }, [data]);

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const inPriceRange = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesType =
        selectedProviderTypes.length === 0 ||
        p.services.some((service) => selectedProviderTypes.includes(service));
      return inPriceRange && matchesType;
    });
  }, [providers, priceRange, selectedProviderTypes]);

  const displayedProviders = filteredProviders.slice(
    (currentPage - 1) * providersPerPage,
    currentPage * providersPerPage
  );

  const router = useRouter();

  const resetFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedProviderTypes([]);
    setSelectedPopularFilters([]);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description="Failed to load providers data."
        type="error"
        showIcon
        className="m-6"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white container font-inter flex flex-col">
      <div className="mb-6">
        <h1 className="md:text-[36px] text-2xl font-bold text-[#1F2937]">
          Step 1: Select Providers
        </h1>
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar Filters */}
        <div className="w-full md:w-80 border-r p-6">
          <h2 className="text-lg font-semibold mb-4">All Filters</h2>

          <h3 className="text-sm font-medium mb-2">Price Range</h3>
          <Slider
            range
            min={0}
            max={50000}
            value={priceRange}
            onChange={(value) => {
              setPriceRange([value[0], value[1]]);
              setCurrentPage(1);
            }}
            tooltip={{ formatter: (value) => `$${value}` }}
          />
          <div className="flex justify-between mb-4">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>

          <h3 className="text-sm font-medium mb-2">Provider Type</h3>
          {[
            "All in one service",
            "Pick-up only",
            "Freight forwarding",
            "Customs clearance",
            "Last-mile delivery",
          ].map((type) => (
            <Checkbox
              key={type}
              checked={selectedProviderTypes.includes(type)}
              onChange={() =>
                setSelectedProviderTypes((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type]
                )
              }
            >
              {type}
            </Checkbox>
          ))}

          <h3 className="text-sm font-medium mt-4 mb-2">Popular Filters</h3>
          {["Door to door", "Port pickup", "Warehouse pickup"].map((filter) => (
            <Checkbox
              key={filter}
              checked={selectedPopularFilters.includes(filter)}
              onChange={() =>
                setSelectedPopularFilters((prev) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter)
                    : [...prev, filter]
                )
              }
            >
              {filter}
            </Checkbox>
          ))}

          <Button
            icon={<RotateCcw />}
            type="text"
            onClick={resetFilters}
            className="mt-4 text-orange-500"
          >
            Reset filters
          </Button>
        </div>

        {/* Providers List */}
        <div className="flex-1 p-6">
          {displayedProviders.map((provider, index) => (
            <ProviderCard
              key={`${provider.id}-${index}`}
              provider={provider}
              selected={selectedProvider?.id === provider.id}
              onSelect={() => {
                setSelectedProvider(provider);
              }}
            />
          ))}

          <div className="mt-6 flex justify-end">
            <Pagination
              current={currentPage}
              total={filteredProviders.length}
              pageSize={providersPerPage}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button
              className="bg-blue-100 text-blue-600"
              onClick={() => router.push("/")}
            >
              Back
            </Button>
            <Button
              type="primary"
              disabled={!selectedProvider}
              className="bg-orange-500 text-white"
              onClick={() => selectedProvider && goToNextStep(selectedProvider)}
            >
              Continue to next Step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProviders;
