'use client';
import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Space,
  Modal,
  Spin,
  Input,
  Form,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  TruckOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  GiftOutlined,
  ArrowRightOutlined,
  EyeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useGetMeQuery, useUpdateProfileMutation } from "@/redux/features/user";
import { useGetAllShipmentQuery } from "@/redux/features/commonApi/createShipmentAPI/createShipmentApi";
import { toast } from "sonner";

const { Title, Text, Paragraph } = Typography;

interface ShipmentLocation {
  city: string;
  zip: string;
}

interface ShipmentSenderReceiverDetails {
  name: string;
  phone: string;
  email: string;
}

interface Shipment {
  key: string;
  shipmentID: string;
  originLocation: ShipmentLocation;
  destinationLocation: ShipmentLocation;
  status: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  senderDetails: ShipmentSenderReceiverDetails;
  receiverDetails: ShipmentSenderReceiverDetails;
  deliveryInstraction?: string;
  createdAt: string;
  updatedAt: string;
  IsPaymentDone: string;
  id: string;
  type: string;
}

interface DashboardCard {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

const AccountDashboard: React.FC = () => {
  const { data } = useGetMeQuery();
  const { data: fetchedShipmentData, isLoading, isError } = useGetAllShipmentQuery('');
  const id = data?.data?.id;

  const [updateProfile] = useUpdateProfileMutation();
  const [modalVisible, setModalVisible] = useState(false);
  // Removed unused selectedShipment state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [form] = Form.useForm();

  const showModal = () => {
    form.setFieldsValue({
      name: data?.data?.name || "",
      email: data?.data?.email || "",
      phone: data?.data?.phone || "",
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const profileData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
if (id) {
  type UpdateProfileResponse = { message?: string };
  const res: UpdateProfileResponse = await updateProfile({ id, data: profileData }).unwrap();
  if (res) {
    toast.success(res?.message || "Profile updated successfully!");
  } else {
    toast.error("Profile update failed!");
  }

  setModalVisible(false); // Close modal after save
}
    } catch (error) {
      console.log("Failed to save:", error);
    }
  };

  const shipmentColumns = [
    {
      title: "Shipment ID",
      dataIndex: "shipmentID",
      key: "shipmentID",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Origin",
      dataIndex: "originLocation",
      key: "origin",
      render: (origin: ShipmentLocation) => origin.city,
    },
    {
      title: "Destination",
      dataIndex: "destinationLocation",
      key: "destination",
      render: (destination: ShipmentLocation) => destination.city,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "AWAITING_PICKUP") color = "red";
        if (status === "IN_TRANSIT") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Shipment) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setSelectedShipment(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const shipmentData = fetchedShipmentData?.data?.map((shipment: Shipment) => ({
    key: shipment.id,
    shipmentID: shipment.shipmentID,
    originLocation: shipment.originLocation,
    destinationLocation: shipment.destinationLocation,
    status: shipment.status,
  })) || [];

  const dashboardCards: DashboardCard[] = [
    {
      title: "My Shipments",
      description: "View and manage all your current and past shipments",
      icon: <TruckOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      color: "#e6f7ff",
    },
    {
      title: "Saved Addresses",
      description: "Manage your pickup and delivery addresses",
      icon: <EnvironmentOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      color: "#f6ffed",
    },
    {
      title: "Payment Methods",
      description: "Add, edit, or remove your payment methods",
      icon: <CreditCardOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />,
      color: "#fff7e6",
    },
    {
      title: "Referrals & Rewards",
      description: "Invite friends and earn rewards for referrals",
      icon: <GiftOutlined style={{ fontSize: "24px", color: "#eb2f96" }} />,
      color: "#fff0f6",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading user data. Please try again later.
      </div>
    );
  }

  const { name, email, role } = data?.data || {};

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ marginBottom: "8px" }}>
          Account Dashboard
        </Title>
        <Paragraph type="secondary" style={{ fontSize: "16px", marginBottom: 0 }}>
          Manage your account and shipments in one place
        </Paragraph>
      </div>

      {/* Profile Overview */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ marginBottom: "16px" }}>
              Profile Overview
            </Title>
            <Space direction="vertical" size="small">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <UserOutlined style={{ color: "#666" }} />
                <Text>{name}</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MailOutlined style={{ color: "#666" }} />
                <Text>{email}</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button className="p-2 bg-gray-200 text-gray-600 rounded">{role}</button>
              </div>
            </Space>
          </div>
          <Button type="primary" size="large" onClick={showModal}>
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Dashboard Cards */}
      <Row gutter={16} style={{ marginBottom: "32px" }}>
        {dashboardCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index} style={{ marginBottom: "16px" }}>
            <Card
              hoverable
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                height: "100%",
              }}
              bodyStyle={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "160px",
              }}
            >
              <div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  {card.icon}
                </div>
                <Title level={5} style={{ marginBottom: "8px" }}>
                  {card.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "13px", lineHeight: "1.4" }}>
                  {card.description}
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <Button className="" type="link" style={{ padding: 0, height: "auto" }}>
                    <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Active Shipments */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Active Shipments
          </Title>
          <Button type="link">
            View All Shipments <ArrowRightOutlined />
          </Button>
        </div>
        <Table
          columns={shipmentColumns}
          dataSource={shipmentData}
          pagination={false}
          size="middle"
          style={{ marginTop: "16px" }}
          scroll={{ y: 400, x: "max-content" }}
        />
      </Card>

      {/* Modal to Edit Account Settings */}
      <Modal
        title="Update Account Settings"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="account-settings">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
     
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" disabled/>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: false, message: "Please enter your phone number!" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountDashboard;


