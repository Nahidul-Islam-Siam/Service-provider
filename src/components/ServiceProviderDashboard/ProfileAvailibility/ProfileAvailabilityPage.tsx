'use client';

import React from "react";
import { Table, Switch, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";

const orange = "#FA6400";

interface ServiceData {
  key: string;
  service: string;
  status: boolean;
  price: string;
}

interface ServicesTableProps {
  data: ServiceData[];
}

const ServicesTable: React.FC<ServicesTableProps> = ({ data }) => {
  const servicesColumns = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Price Range",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: ServiceData) => (
        <Switch
          checked={status}
          onChange={(checked) => {
            message.success(`${record.service} ${checked ? "enabled" : "disabled"}`);
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Button style={{ backgroundColor: orange, color: "#fff" }} size="small" icon={<EditOutlined />}>
          Edit
        </Button>
      ),
    },
  ];

  return <Table columns={servicesColumns} dataSource={data} pagination={false} size="middle" />;
};

export default ServicesTable;
