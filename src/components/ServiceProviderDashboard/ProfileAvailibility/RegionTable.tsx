import React from "react";
import { Table, Button, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const orange = "#FA6400";

interface RegionData {
  key: string;
  region: string;
  coverage: string;
}

interface RegionsTableProps {
  data: RegionData[];
}

const RegionsTable: React.FC<RegionsTableProps> = ({ data }) => {
  const regionsColumns = [
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Coverage",
      dataIndex: "coverage",
      key: "coverage",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button style={{ backgroundColor: orange, color: "#fff" }} size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => message.success("Region removed")}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return <Table columns={regionsColumns} dataSource={data} pagination={false} size="middle" />;
};

export default RegionsTable;
