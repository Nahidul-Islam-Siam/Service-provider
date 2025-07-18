/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Input, Form as AntdForm } from "antd";
import { ArrowLeft } from "lucide-react";
import Sender from "@/components/icons/Sender";
import I from "@/components/icons/I";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateShipmentMutation } from "@/redux/features/commonApi/createShipmentAPI/createShipmentApi";
import { useGetMeQuery } from "@/redux/features/user";
import { ItemType } from "@/redux/features/commonApi/createShipmentAPI/createShipmentApi";

interface Step2Props {
  goToPreviousStep: () => void;
  goToNextStep: (shipmentID: string) => void;
  selectedProviderId: string;
  pickupDate: string;
  deliveryDate?: string;
  itemType: ItemType;
  originLocation: any;
  destinationLocation: any;
  amount: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  takingAvailableService?: { id: string; name: string }[];
}

const Step2: React.FC<Step2Props> = ({
  goToPreviousStep,
  goToNextStep,
  selectedProviderId,
  deliveryDate,
  itemType,
  originLocation,
  destinationLocation,
  amount,
  address,
  takingAvailableService = [],
}) => {
  const [form] = AntdForm.useForm();
  const router = useRouter();
  const [createShipment, { isLoading }] = useCreateShipmentMutation();
  const { data: userData } = useGetMeQuery();
  const userId = userData?.data?.id;

  const handleSubmit = async (isContinue: boolean) => {
    try {
      const values = await form.validateFields();
      if (!userId) {
        toast.error("User not found. Please login again.");
        return;
      }

      const payload = {
        userId,
        sProviderID: selectedProviderId,
        pickupDate: "2025-06-15T10:00:00.000Z", // You can replace with your pickupDate prop if needed
        deliveryDate,
        amount,
        originLocation,
        destinationLocation,
        itemType,
        itemDimension: "",
        senderDetails: {
          name: values.sender.fullName,
          phone: values.sender.phoneNumber,
          email: values.sender.email,
        },
        receiverDetails: {
          name: values.receiver.fullName,
          phone: values.receiver.phoneNumber,
          email: values.receiver.email,
        },
        takingAvailableService,
        address,
        deliveryInstraction: values.receiver.specialInstructions,
      };

      const response = await createShipment(payload).unwrap();

      if (response.success && response.data?.shipmentID) {
        toast.success("Data saved successfully!");

        if (isContinue) {
          goToNextStep(response.data.shipmentID);
        } else {
          router.push("/");
        }
      } else {
        toast.error("Failed to get shipment ID from response.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data. Please check the form and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-6 px-4 font-inter">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-semibold monts-font text-[#1F2937]">
              Step 2: Sender & Recipient Details
            </h1>
            <p className="text-sm md:text-base text-[#6B7280] mt-1">
              Please provide information about who’s sending and receiving this shipment.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-[#3B82F6] mb-6">
              <Sender />
              <h2 className="text-lg md:text-xl font-semibold text-[#1F2937]">
                Sender Details
              </h2>
            </div>

            <AntdForm form={form} layout="vertical" requiredMark={false}>
              {/* Sender */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <AntdForm.Item
                  label="Full Name"
                  name={["sender", "fullName"]}
                  rules={[{ required: true, message: "Please enter full name" }]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="Haylie" />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Phone Number"
                  name={["sender", "phoneNumber"]}
                  rules={[{ required: true, message: "Please enter phone number" }]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="012-3456789" />
                </AntdForm.Item>
              </div>

              <AntdForm.Item
                label="Email"
                name={["sender", "email"]}
                rules={[
                  { required: true, message: "Please enter a valid email" },
                  {
                    pattern: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                ]}
                colon={false}
              >
                <Input placeholder="jane.doe@email.com" />
              </AntdForm.Item>

              {/* Receiver */}
              <div className="flex items-center gap-2 text-[#3B82F6] mt-10 mb-6">
                <I />
                <h2 className="text-lg md:text-xl font-semibold text-[#1F2937]">
                  Receiver Details
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <AntdForm.Item
                  label="Full Name"
                  name={["receiver", "fullName"]}
                  rules={[{ required: true, message: "Please enter full name" }]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="John" />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Phone Number"
                  name={["receiver", "phoneNumber"]}
                  rules={[{ required: true, message: "Please enter phone number" }]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="012-3456789" />
                </AntdForm.Item>
              </div>

              <AntdForm.Item
                label="Email"
                name={["receiver", "email"]}
                rules={[
                  { required: true, message: "Please enter a valid email" },
                  {
                    pattern: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                ]}
                colon={false}
              >
                <Input placeholder="john.doe@email.com" />
              </AntdForm.Item>

              <AntdForm.Item
                label="Street Address"
                name={["receiver", "streetAddress"]}
                rules={[{ required: true, message: "Please enter street address" }]}
                colon={false}
              >
                <Input placeholder="123 Main St" />
              </AntdForm.Item>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <AntdForm.Item
                  label="City"
                  name={["receiver", "city"]}
                  rules={[{ required: true, message: "Please enter city" }]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="City" />
                </AntdForm.Item>

                <AntdForm.Item
                  label="District/State/Province"
                  name={["receiver", "district"]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="District" />
                </AntdForm.Item>

                <AntdForm.Item
                  label="Postal/ZIP Code"
                  name={["receiver", "postalCode"]}
                  rules={[{ required: true, message: "Please enter postal code" }]}
                  className="w-full"
                  colon={false}
                >
                  <Input placeholder="ZIP Code" />
                </AntdForm.Item>
              </div>

              <AntdForm.Item
                label="Special Instructions"
                name={["receiver", "specialInstructions"]}
                colon={false}
              >
                <Input.TextArea
                  placeholder="Leave at front door if no one answers"
                  rows={3}
                />
              </AntdForm.Item>

              <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
                <button
                  onClick={goToPreviousStep}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#85CCFF] text-[#3A3A3A] rounded-lg hover:bg-blue-200 transition-colors font-medium w-full md:w-auto"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium w-full"
                    type="button"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#FA8800] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium w-full"
                    type="button"
                  >
                    {isLoading ? "Saving..." : "Continue to next Step"}
                  </button>
                </div>
              </div>
            </AntdForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
