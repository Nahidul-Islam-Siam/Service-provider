/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import {
  Star,
  Printer,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ProhibitedItemsModal from "@/components/Modal/ProhibitedItemsModal";
import Location from "@/components/icons/Location";
import Flag from "@/components/icons/Flag";
import Barrel from "@/components/icons/Barrel";
import Profile from "@/components/icons/Profile";
import Delivery from "@/components/icons/Delivery";
import { useGetSingleShipmentQuery } from "@/redux/features/shipmentApi/shipmentApi";
import { usePaymentCheckoutMutation } from "@/redux/features/commonApi/paymentApi/paymentApi";
import { toast } from "sonner";

interface Step3Props {
  shipmentID: string;
  goToPreviousStep: () => void;
}

function Step3({ shipmentID, goToPreviousStep }: Step3Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const { data: response, error, isLoading } = useGetSingleShipmentQuery(shipmentID);
  const [paymentCheckout, { isLoading: paymentLoading }] = usePaymentCheckoutMutation();

  const shipment = response?.data;

  // Save shipmentID to localStorage when shipment is loaded
  useEffect(() => {
    if (shipment?.shipmentID) {
      localStorage.setItem("shipmentID", shipment.shipmentID);
    }
  }, [shipment]);
  console.log("Shipment Data:", shipment);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handlePrint = () => {
    if (summaryRef.current) {
      const opt = {
        margin: 0.5,
        filename: `Shipment_Summary_${shipment.shipmentID}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(summaryRef.current).save();
    }
  };

  const handleConfirm = async () => {
    setIsModalVisible(false);

    try {
      if (!shipment) {
        toast.error("Shipment data is missing!");
        return;
      }

      const payload = {
        userId: shipment.userId,
        providerId: shipment.sProviderID,
        shipmentId: shipment.shipmentID,
        amount: shipment.amount,
      };

      const res = await paymentCheckout(payload).unwrap();
      const checkoutUrl = res?.data?.session?.url;

      if (checkoutUrl) {
        toast.success("Redirecting to Stripe Checkout...");
        window.location.href = checkoutUrl;
      } else {
        toast.error("Stripe checkout URL not found.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Payment failed.");
    }
  };

  const formatLocation = (loc: any) => {
    if (!loc) return "N/A";
    if (typeof loc === "string") return loc;
    return (
      loc.city ||
      loc.state ||
      loc.district ||
      loc.postalCode ||
      loc.zipcode ||
      loc.street ||
      loc.fullAddress ||
      "N/A"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading shipment details...</p>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">
          Failed to load shipment details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 monts-font">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Review & Confirm</h1>
          <p className="text-gray-600">Please review your shipment details before proceeding to checkout.</p>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            Shipment ID: <span className="text-orange-600">{shipment.shipmentID}</span>
          </p>
        </div>

        {/* Printable Summary */}
        <div ref={summaryRef}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Shipment Summary</h2>
              <button onClick={handlePrint} className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
                <Printer size={16} />
                <span className="text-sm font-medium">Print Summary</span>
              </button>
            </div>

            {/* Origin & Destination */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3 border p-4 bg-[#85CCFF1A] rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Location /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Origin</p>
                    <p className="font-medium text-gray-900">{formatLocation(shipment.originLocation)}</p>
                    {shipment.originLocation?.street && <p className="text-sm text-gray-600">{shipment.originLocation.street}</p>}
                  </div>
                </div>
                <div className="flex gap-3 border p-4 bg-[#85CCFF1A] rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Flag /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Destination</p>
                    <p className="font-medium text-gray-900">{formatLocation(shipment.destinationLocation)}</p>
                    {shipment.destinationLocation?.street && <p className="text-sm text-gray-600">{shipment.destinationLocation.street}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex gap-3 border p-4 bg-[#85CCFF1A] rounded-2xl">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Barrel /></div>
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Item Type</p>
                    <p className="font-medium text-gray-900">{shipment.itemType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                    <p className="font-medium text-gray-900">{shipment.itemDimension || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sender & Recipient */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3 border p-4 bg-[#85CCFF1A] rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Profile /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sender</p>
                    <p className="font-medium text-gray-900">{shipment.senderDetails?.name}</p>
                    <p className="text-sm text-gray-600">{shipment.senderDetails?.phone}</p>
                    <p className="text-sm text-gray-600">{shipment.senderDetails?.email}</p>
                  </div>
                </div>
                <div className="flex gap-3 border p-4 bg-[#85CCFF1A] rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Profile /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Recipient</p>
                    <p className="font-medium text-gray-900">{shipment.receiverDetails?.name}</p>
                    <p className="text-sm text-gray-600">{shipment.receiverDetails?.phone}</p>
                    <p className="text-sm text-gray-600">{shipment.receiverDetails?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Provider */}
            <div className="px-6 py-5">
              <h3 className="font-medium text-gray-900 mb-4">Selected Provider</h3>
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><Delivery /></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{shipment.sProviderID || "Provider Name"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className="text-[#FA8800] fill-[#FA8800]" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(724)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <button onClick={goToPreviousStep} className="flex items-center gap-2 px-6 py-3 bg-[#85CCFF] text-[#3A3A3A] rounded-lg hover:bg-blue-200 transition-colors font-medium">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <button
            onClick={showModal}
            disabled={paymentLoading}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium shadow-lg"
          >
            {paymentLoading ? "Redirecting..." : (
              <>
                <span>Continue to next Step</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Confirmation Modal */}
        <ProhibitedItemsModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}

export default Step3;
