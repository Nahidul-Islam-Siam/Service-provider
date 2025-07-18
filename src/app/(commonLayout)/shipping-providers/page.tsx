/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { useSearchParams } from "next/navigation";
import SelectProviders from "@/components/Tabs/SelectProviders";
import Step2 from "@/components/Tabs/Step2";
import Step3 from "@/components/Tabs/Step3";

const { Step } = Steps;

enum ItemType {
  BARREL = "BARREL",
  FURNITURE = "FURNITURE",
}

const Page = () => {
  const [current, setCurrent] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [shipmentID, setShipmentID] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState({
    pickupLocation: "",
    destination: "",
    pickupDate: "",
    pickupZip: "",
    destinationZip: "",
    itemType: "",
  });

  const params = useSearchParams();

  useEffect(() => {
    setQueryParams({
      pickupLocation: params.get("pickupLocation") || "",
      destination: params.get("destination") || "",
      pickupDate: params.get("pickupDate") || "",
      pickupZip: params.get("pickupZip") || "",
      destinationZip: params.get("destinationZip") || "",
      itemType: params.get("itemType") || "",
    });
  }, [params]);

  const goToNextStep = (newProvider: any, newShipmentID?: string) => {
    if (newProvider) setSelectedProvider(newProvider);
    if (newShipmentID) setShipmentID(newShipmentID);
    setCurrent((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setCurrent((prev) => prev - 1);
  };

  return (
    <div>
      <div className="md:w-[900px] sm:w-[80%] w-[50%] mx-auto my-4 pt-5 pb-5">
        <Steps current={current}>
          <Step />
          <Step />
          <Step />
        </Steps>
      </div>

      <div className="step-container">
        <div className="content">
          {current === 0 && (
            <SelectProviders
              goToNextStep={(provider) => goToNextStep(provider)}
            />
          )}

          {current === 1 && selectedProvider && (
            <Step2
              goToPreviousStep={goToPreviousStep}
              goToNextStep={(shipmentID) => goToNextStep(null, shipmentID)}
              selectedProviderId={selectedProvider.id}
              pickupDate={queryParams.pickupDate}
              deliveryDate={undefined}
              itemType={
                (ItemType[
                  queryParams.itemType.toUpperCase() as keyof typeof ItemType
                ] as ItemType) || ItemType.BARREL
              }
              originLocation={{
                city: queryParams.pickupLocation,
                zip: queryParams.pickupZip,
              }}
              destinationLocation={{
                city: queryParams.destination,
                zip: queryParams.destinationZip,
              }}
              amount={selectedProvider.price}
              address={{
                street: "",
                city: "",
                state: "",
                zipcode: "",
                country: "BD",
              }}
              takingAvailableService={[]}
            />
          )}

          {current === 2 && shipmentID && (
            <Step3 shipmentID={shipmentID} goToPreviousStep={goToPreviousStep} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
