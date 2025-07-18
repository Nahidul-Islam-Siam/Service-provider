/* eslint-disable @typescript-eslint/no-explicit-any */

// pages/Dashboard.tsx
import React, { useMemo } from "react";
import { Row, Col, Card, Spin } from "antd";

import BarrelB from "@/components/icons/BarrelB";
import { ClockIcon, DollarSignIcon, TruckIcon } from "lucide-react";
import StatCard from "@/components/Admin/Dashboard/SlateCard";
import ShipmentTrendsChart from "@/components/Admin/Dashboard/ShipmentTrendsChart";
import ProviderPerformanceChart from "@/components/Admin/Dashboard/ProvidedPerfpormance";
import ShipmentsTable from "@/components/Admin/Dashboard/ShipmentTable";
import { useGetCardAnalyticsQuery } from "@/redux/features/admin/DasboardApi/DashboardApi";
import dayjs from "dayjs";
import { useGetAllShipmentsQuery } from "@/redux/features/shipmentApi/shipmentApi";

// Define the type for the card data
type CardData = {
  TotalShipment?: number;
  activeProviders?: number;
  pendingDelivery?: number;
  totalRevenue?: number;
};

const Dashboard: React.FC = () => {
  const {
    data: cardDataResponse,
    isLoading: isLoadingCard,
    isFetching: isFetchingCard,
  } = useGetCardAnalyticsQuery();

  const {
    data: shipmentsResponse,
    isLoading: isLoadingShipments,
    isFetching: isFetchingShipments,
  } = useGetAllShipmentsQuery({});

  const isLoading = isLoadingCard || isLoadingShipments || isFetchingCard || isFetchingShipments;

  const cardData: CardData =
    cardDataResponse && cardDataResponse.data && !Array.isArray(cardDataResponse.data)
      ? cardDataResponse.data
      : {};

  // Helper function to convert API shipment status to ShipmentsTable status literal
  const mapStatus = (
    status: string
  ): "in-transit" | "delivered" | "failed" | "pending" => {
    switch (status.toUpperCase()) {
      case "AWAITING_PICKUP":
      case "PENDING":
        return "pending";
      case "IN_TRANSIT":
      case "IN-TRANSIT":
        return "in-transit";
      case "DELIVERED":
        return "delivered";
      case "FAILED":
        return "failed";
      default:
        return "pending";
    }
  };

  // Map API data to ShipmentsTable shape
  const shipmentsData = useMemo(() => {
    if (!shipmentsResponse?.data?.data) return [];

    return shipmentsResponse.data.data.map((item: any, index: number) => ({
      key: index.toString(),
      id: item.shipmentID,
      customer: item.userName || "N/A",
      provider: item.providerName || "N/A",
      status: mapStatus(item.status),
      zipCode: item?.address?.zipcode || "N/A",
      pickupDate: dayjs(item.pickupDate).format("YYYY-MM-DD"),
      estDelivery: dayjs(item.deliveryDate).format("YYYY-MM-DD"),
    }));
  }, [shipmentsResponse]);

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Overlay spinner */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" tip="Loading dashboard data..." />
        </div>
      )}

      <h1
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#262626",
          margin: 0,
        }}
      >
        Dashboard Overview
      </h1>

      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <StatCard
            title="Total Shipments"
            value={cardData.TotalShipment || 0}
            percentageChange="+12.5% vs last month"
            icon={<BarrelB />}
            colorClass="bg-blue-50"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Active Providers"
            value={cardData.activeProviders || 0}
            percentageChange="+8.2% vs last month"
            icon={<TruckIcon />}
            colorClass="bg-green-50"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Pending Deliveries"
            value={cardData.pendingDelivery || 0}
            percentageChange="+5.1% vs last month"
            icon={<ClockIcon />}
            colorClass="bg-yellow-50"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Total Revenue"
            value={cardData.totalRevenue || 0}
            percentageChange="+3.7% vs last month"
            icon={<DollarSignIcon />}
            colorClass="bg-purple-50"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <ShipmentTrendsChart />
        </Col>
        <Col span={12}>
          <ProviderPerformanceChart
            providerData={[
              { name: "Provider A", value: 40, color: "#1890ff" },
              { name: "Provider B", value: 30, color: "#52c41a" },
              { name: "Provider C", value: 20, color: "#faad14" },
              { name: "Provider D", value: 10, color: "#eb2f96" },
            ]}
          />
        </Col>
      </Row>

      <Card title="Recent Shipments" style={{ marginTop: "24px" }}>
        <ShipmentsTable shipmentsData={shipmentsData} />
      </Card>
    </div>
  );
};

export default Dashboard;
