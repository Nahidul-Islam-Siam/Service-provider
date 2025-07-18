'use client';
import React, { useMemo } from "react";
import { Row, Col, Typography } from "antd";
import StatsCard from "@/components/ServiceProviderDashboard/ServiceDashboard/StatsCard";
import {
  ShoppingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BookingTrendsChart from "@/components/ServiceProviderDashboard/ServiceDashboard/BookingtrendsChart";
import ShipmentsTable from "@/components/Admin/Dashboard/ShipmentTable";
import { useGetAllShipmentsQuery } from "@/redux/features/shipmentApi/shipmentApi";
import dayjs from "dayjs";
import { useGetProviderDashboardCardsQuery } from "@/redux/features/provider/Analytics/analytics";

const Dashboard: React.FC = () => {
  const { data: shipmentsResponse } = useGetAllShipmentsQuery({});
  const { data: cardsResponse } = useGetProviderDashboardCardsQuery(undefined);


  const mapStatus = (status: string): "in-transit" | "delivered" | "failed" | "pending" => {
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

  
  interface ShipmentItem {
    shipmentID: string;
    userName?: string;
    providerName?: string;
    status: string;
    address?: {
      zipcode?: string;
    };
    pickupDate: string;
    deliveryDate: string;
  }

  const shipmentsData = useMemo(() => {
    if (!shipmentsResponse?.data?.data) return [];
    return shipmentsResponse.data.data.map((item: ShipmentItem, index: number) => ({
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
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Typography.Title level={4} style={{ marginBottom: "16px" }}>
        Dashboard Overview
      </Typography.Title>

     
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Customers"
            value={cardsResponse?.data?.activeProviders || 0}  // 
            prefixIcon={<UserOutlined style={{ color: "#1890ff" }} />}
            percentage={5.2}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="New Customers"
            value={cardsResponse?.data?.activeProviders || 0} 
            prefixIcon={<UserAddOutlined style={{ color: "#52c41a" }} />}
            percentage={4.1}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Products"
            value={cardsResponse?.data?.TotalShipment || 0} 
            prefixIcon={<ShoppingOutlined style={{ color: "#fa8c16" }} />}
            percentage={3.5}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Revenue"
            value={cardsResponse?.data?.totalRevenue || 0}  
            prefixIcon="$"
            percentage={10.7}
          />
        </Col>
      </Row>

    
      <BookingTrendsChart
        chartData={[
          { month: "Jan", value: 120 },
          { month: "Feb", value: 150 },
          { month: "Mar", value: 170 },
          { month: "Apr", value: 140 },
          { month: "May", value: 180 },
          { month: "Jun", value: 200 },
        ]}
      />

  
      <ShipmentsTable shipmentsData={shipmentsData} />
    </div>
  );
};

export default Dashboard;
