/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Space,
  Typography,
  Card,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useGetSPreviewQuery } from "@/redux/features/provider/ReviewApi/ReviewApi";


const { Search } = Input;
const { Text } = Typography;

interface ReviewData {
  key: string;
  customerName: string;
  reviewText: string;
  date: string;
  rating: number;
}

const ReviewsTable: React.FC = () => {
  const { data, isLoading } = useGetSPreviewQuery();
  const [filteredData, setFilteredData] = useState<ReviewData[]>([]);

  // Transform API response to match the table's structure
  useEffect(() => {
    if (data?.data) {
      const mappedData: ReviewData[] = data.data.map((item: any) => ({
        key: item.id,
        customerName: item.user?.name || "Unknown",
        reviewText: item.comment,
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        rating: item.rating,
      }));
      setFilteredData(mappedData);
    }
  }, [data]);

  // Search filter
  const handleSearch = (value: string) => {
    if (!data?.data) return;

    const filtered = data.data
      .filter(
        (item: any) =>
          item.user?.name?.toLowerCase().includes(value.toLowerCase()) ||
          item.comment?.toLowerCase().includes(value.toLowerCase())
      )
      .map((item: any) => ({
        key: item.id,
        customerName: item.user?.name || "Unknown",
        reviewText: item.comment,
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        rating: item.rating,
      }));
    setFilteredData(filtered);
  };

  const columns: ColumnsType<ReviewData> = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      render: (name: string) => (
        <Space>
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Review Text",
      dataIndex: "reviewText",
      key: "reviewText",
      width: 300,
      render: (text: string) => (
        <Text type="secondary" ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating: number) => `${rating}⭐`,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card>
        <div style={{ marginBottom: "16px" }}>
          <Search
            placeholder="Search Reviews"
            allowClear
            size="large"
            style={{ maxWidth: 400 }}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            pageSize: 9,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total}`,
            showSizeChanger: false,
          }}
          scroll={{ x: 800 }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "ant-table-row-even" : "ant-table-row-odd"
          }
        />
      </Card>

      <style jsx global>{`
        .ant-table-row-even {
          background-color: #fafafa;
        }
        .ant-table-row-odd {
          background-color: #ffffff;
        }
        .ant-table-row-even:hover,
        .ant-table-row-odd:hover {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default ReviewsTable;
