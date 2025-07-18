'use client'; // Explicitly declare this as a client-side component

import React from "react";
import { Form, Input, Button, InputNumber, message, Spin } from "antd";
import { useGetMeQuery } from "@/redux/features/user";
import { useCreateBundleDiscountMutation } from "@/redux/features/provider/promoApi";
import { toast } from "sonner";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface PromoFormValues {
  promoCode: string;
  discount: number;
  deletePromoCode: string;
  name: string;
  description: string;
  price: number;
}

const PromoCodeForm: React.FC = () => {
  const [promoForm] = Form.useForm<PromoFormValues>();
  const { data, isLoading, isError } = useGetMeQuery(); // Destructure loading and error states
  const [createBundleDiscount] = useCreateBundleDiscountMutation();

  // Check if data is available before accessing it
  if (isLoading) {
    return <Spin size="large" />; // Show a loading spinner while data is being fetched
  }

  if (isError || !data?.data) {
    return <div>Error: Unable to fetch user data.</div>; // Handle error if data is not available
  }

  const userData = data.data as UserInfo; // Now data is guaranteed to be defined
  const id = userData.id; // Extract provider ID

  const handleSubmit = async (values: PromoFormValues) => {
    const bundleData = {
      sProviderId: id,
      name: values.name,
      description: values.description,
      price: values.price,
      discount: values.discount,
      isBundle: 1,
    };

    try {
      const res = await createBundleDiscount(bundleData).unwrap();
      toast.success(res?.message || "Bundle discount created successfully!");
       promoForm.resetFields(); // Clear the form fields
    } catch {
      message.error("Failed to create bundle discount.");
    }
  };

  return (
    <Form form={promoForm} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Bundle Name" name="name" rules={[{ required: true, message: "Please enter the bundle name" }]}>
        <Input size="large" placeholder="Enter bundle name" />
      </Form.Item>

      <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter a description" }]}>
        <Input size="large" placeholder="Enter bundle description" />
      </Form.Item>

      <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
        <InputNumber size="large" min={0} placeholder="Enter price" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Discount Percentage" name="discount" rules={[{ required: true, message: "Please enter discount percentage" }]}>
        <InputNumber
          size="large"
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          parser={(value) => {
            const num = value ? Number(value.replace("%", "")) : 0;
            return num >= 100 ? 100 : 0;
          }}
          placeholder="Enter discount %"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Promo Code" name="promoCode">
        <Input size="large" placeholder="Enter promo code (optional)" />
      </Form.Item>

      <Button type="primary" htmlType="submit" size="large" style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}>
        Create Bundle Discount
      </Button>
    </Form>
  );
};

export default PromoCodeForm;
