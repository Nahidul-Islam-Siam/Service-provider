'use client';
import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useUpdateProviderAccountMutation } from "@/redux/features/provider/providerApi";
import { useGetMeQuery } from "@/redux/features/user";
import { toast } from "sonner";

interface AccountFormValues {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const AccountInfoForm: React.FC = () => {
  const [accountForm] = Form.useForm<AccountFormValues>();
  const { data, isLoading, isError } = useGetMeQuery();
  const [updateProviderAccount, { isLoading: isUpdating }] = useUpdateProviderAccountMutation();

  useEffect(() => {
    if (data) {
      const phone = "phone" in data.data ? (data.data.phone as string | undefined) ?? "" : "";
      accountForm.setFieldsValue({
        name: data.data.name,
        email: data.data.email,
        phone,
      });
    }
  }, [data, accountForm]);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading user data. Please try again later.</div>;
  }

  // Safely access user data
  const userData = data?.data as UserData | null;
  const id = userData?.id || ""; // Get the id safely

  const onSubmit = async (values: AccountFormValues) => {
    if (!id) {
      message.error("Provider ID is missing");
      return;
    }

    try {
      const res = await updateProviderAccount({ id, providerData: values }).unwrap();
      if (res?.message) {
        toast.success(res.message);
        accountForm.resetFields(); // Clear the form fields after successful update
      } else {
        toast.success("Account information updated successfully!");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update account information.";
      toast.error(errorMessage);
    }
  };

  return (
    <Form form={accountForm} layout="vertical" onFinish={onSubmit}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input prefix={<UserOutlined />} size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email" }]}
          >
            <Input disabled prefix={<MailOutlined />} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
            <Input prefix={<PhoneOutlined />} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
        loading={isUpdating}
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </Button>
    </Form>
  );
};

export default AccountInfoForm;
