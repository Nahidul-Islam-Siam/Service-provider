/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Pagination,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  DollarOutlined,
  GiftOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useGetPaymentCardQuery, useGetPaymentHistoryQuery, useGetUpcomingPaymentsQuery } from "@/redux/features/admin/PaymentApi/PaymentApi";

const { Title, Text } = Typography;

// Utility to show status as color-coded tags
const getStatusTag = (status: string) => {
  const statusConfig = {
    pending: { color: "#fa8c16", text: "Pending" },
    succeeded: { color: "#52c41a", text: "Succeeded" },
    completed: { color: "#52c41a", text: "Completed" },
    failed: { color: "#ff4d4f", text: "Failed" },
  };
  const key = status.toLowerCase();
  const config = statusConfig[key as keyof typeof statusConfig];
  return <Tag color={config?.color || "default"}>{config?.text || status}</Tag>;
};

export default function EarningsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API
  const { data: paymentCardData, isLoading: isLoadingCard } = useGetPaymentCardQuery({});
  const { data: paymentHistoryData, isLoading: isLoadingHistory } = useGetPaymentHistoryQuery({});
  const { data: upcomingPayoutData, isLoading: isLoadingUpcoming } = useGetUpcomingPaymentsQuery({});

  const paymentStatus = paymentCardData?.data?.paymentStatus;

  const transactionHistory = paymentHistoryData?.data || [];
  const upcomingPayouts = upcomingPayoutData?.data || [];

  const transactionColumns: ColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 200,
    },
    {
      title: "Shipment ID",
      dataIndex: "shipmentId",
      key: "shipmentId",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: getStatusTag,
    },
  ];

  const upcomingPayoutsColumns: ColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 200,
    },
    {
      title: "Shipment ID",
      dataIndex: "shipmentId",
      key: "shipmentId",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount: number) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: getStatusTag,
    },
  ];

  const handleViewStripeAccount = () => {
    console.log("Opening Stripe dashboard...");
  };

  if (isLoadingCard || isLoadingHistory || isLoadingUpcoming) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space className="flex justify-between text-lg font-bold">
                  <span className="text-black">Total Earnings</span>
                  <DollarOutlined style={{ color: "#5C33CF" }} />
                </Space>
              }
              value={paymentStatus?.totalEarning || 0}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#262626", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space className="flex justify-between text-lg font-bold">
                  <span className="text-black">Payouts Pending</span>
                  <ClockCircleOutlined style={{ color: "#FA8C16" }} />
                </Space>
              }
              value={paymentStatus?.payoutsPending || 0}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#262626", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space className="flex justify-between text-lg font-bold">
                  <span className="text-black">Last Payout</span>
                  <DollarCircleOutlined style={{ color: "#FADB14" }} />
                </Space>
              }
              value={paymentStatus?.lastPayout || 0}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#262626", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space className="flex justify-between text-lg font-bold">
                  <span className="text-black">Next Payout</span>
                  <GiftOutlined style={{ color: "#1890FF" }} />
                </Space>
              }
              value={paymentStatus?.nextPayout || 0}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#262626", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Stripe Account */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={5} style={{ margin: 0, marginBottom: "8px" }}>
              Stripe Account Status
            </Title>
            <Space>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <Text style={{ color: "#52c41a" }}>Connected and Verified</Text>
            </Space>
          </div>
          <Button
            type="primary"
            icon={<LinkOutlined />}
            onClick={handleViewStripeAccount}
            style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
          >
            View Stripe Dashboard
          </Button>
        </div>
      </Card>

      {/* Upcoming Payouts */}
      <Card style={{ marginBottom: "24px" }}>
        <Title level={5} style={{ marginBottom: "16px" }}>
          Upcoming Payouts
        </Title>
        <Table
          columns={upcomingPayoutsColumns}
          dataSource={upcomingPayouts}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Transaction History */}
      <Card>
        <Title level={5} style={{ marginBottom: "16px" }}>
          Transaction History
        </Title>
        <Table
          columns={transactionColumns}
          dataSource={transactionHistory}
          pagination={false}
          size="middle"
          style={{ marginBottom: "16px" }}
          rowKey="transactionId"
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            current={currentPage}
            total={transactionHistory?.length || 0}
            pageSize={10}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
}
