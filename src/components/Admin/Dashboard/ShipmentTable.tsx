/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Table, Button, Tag, Modal, Descriptions, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGetSingleShipmentQuery } from "@/redux/features/shipmentApi/shipmentApi";

interface Shipment {
  key: string;
  id: string;
  customer: string;
  provider: string;
  status: "in-transit" | "delivered" | "failed" | "pending";
  zipCode: string;
  pickupDate: string;
  estDelivery: string;
}

interface ShipmentsTableProps {
  shipmentsData: Shipment[];
}

const getStatusTag = (status: Shipment["status"]) => {
  const colors = {
    "in-transit": "#faad14",
    delivered: "#52c41a",
    failed: "#ff4d4f",
    pending: "#8c8c8c",
  };
  const texts = {
    "in-transit": "In Transit",
    delivered: "Delivered",
    failed: "Failed",
    pending: "Pending",
  };
  return <Tag color={colors[status]}>{texts[status]}</Tag>;
};

const formatAddress = (addr: any) => {
  if (!addr || typeof addr !== "object") return "N/A";
  return (
    addr.fullAddress ||
    `${addr.street ?? ""}, ${addr.city ?? ""}, ${addr.state ?? ""}, ${addr.country ?? ""}, ${addr.postalCode ?? ""}`
  ).replace(/^, |, ,/g, "").trim();
};   

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipmentsData }) => {
  const [selectedShipmentID, setSelectedShipmentID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: shipmentDetail, isLoading } = useGetSingleShipmentQuery(selectedShipmentID ?? "", {
    skip: !selectedShipmentID,
  });

  const handleHistoryClick = (id: string) => {
    setSelectedShipmentID(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedShipmentID(null);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Provider", dataIndex: "provider", key: "provider" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Shipment["status"]) => getStatusTag(status),
    },
    { title: "Zip Code", dataIndex: "zipCode", key: "zipCode" },
    { title: "Pick-up Date", dataIndex: "pickupDate", key: "pickupDate" },
    { title: "Est. Delivery", dataIndex: "estDelivery", key: "estDelivery" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Shipment) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleHistoryClick(record.id)}>
          History
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={shipmentsData}
        pagination={false}
        size="middle"
        rowKey="id"
      />

      <Modal
        open={isModalOpen}
        onCancel={handleModalClose}
        title="Shipment History"
        footer={null}
        width={600}
      >
        {isLoading ? (
          <Spin tip="Loading shipment details..." />
        ) : shipmentDetail?.data ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Shipment ID">
              {shipmentDetail.data.shipmentID}
            </Descriptions.Item>
            <Descriptions.Item label="Origin">
              {formatAddress(shipmentDetail.data.originLocation)}
            </Descriptions.Item>
            <Descriptions.Item label="Destination">
              {formatAddress(shipmentDetail.data.destinationLocation)}
            </Descriptions.Item>
            <Descriptions.Item label="Item Type">
              {shipmentDetail.data.itemType}
            </Descriptions.Item>
            <Descriptions.Item label="Sender">
              {shipmentDetail.data.senderDetails?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Receiver">
              {shipmentDetail.data.receiverDetails?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Pickup Date">
              {shipmentDetail.data.pickupDate}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Date">
              {shipmentDetail.data.deliveryDate}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Instruction">
              {shipmentDetail.data.deliveryInstraction || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          "No data found."
        )}
      </Modal>
    </>
  );
};

export default ShipmentsTable;
