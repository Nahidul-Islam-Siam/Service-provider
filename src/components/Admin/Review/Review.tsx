/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Table,
  Input,
  Rate,
  Switch,
  Typography,
  Pagination,
  Button,
  Spin,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
} from "@/redux/features/admin/ReviewAPI/ReviewApi";
import { toast } from "sonner";

const { Search } = Input;
const { Text } = Typography;

export default function ReviewsManagement() {
  const { data, isLoading, refetch } = useGetAdminReviewsQuery();
  const [updateReviewStatus] = useUpdateReviewStatusMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [hovered, setHovered] = useState(false);

  const reviewsData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((review) => ({
      id: review.id,
      key: review.id,
      customerName: review.userID || "Anonymous",
      reviewText: review.comment,
      date: new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      rating: review.rating,
      published: review.status,
    }));
  }, [data]);

  const handlePublishToggle = async (id: string, checked: boolean) => {
    try {
      await updateReviewStatus({ id, status: checked }).unwrap();
      toast.success(`Review ${checked ? "published" : "unpublished"} successfully`);
      refetch(); // Refresh the list
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review status");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Customer ID",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "Review Text",
      dataIndex: "reviewText",
      key: "reviewText",
      width: 240,
      ellipsis: true,
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
      width: 120,
      render: (rating: number) => (
        <Rate
          disabled
          defaultValue={rating}
          style={{ fontSize: "14px", color: "#fadb14" }}
        />
      ),
    },
    {
      title: "Publish",
      dataIndex: "published",
      key: "published",
      width: 80,
      render: (published: boolean, record: any) => (
        <Switch
          checked={published}
          onChange={(checked) => handlePublishToggle(record.id, checked)}
          style={{
            backgroundColor: published ? "#52c41a" : "#d9d9d9",
          }}
        />
      ),
    },
  ];

  const filteredReviews = reviewsData.filter((review) =>
    review.customerName.toLowerCase().includes(searchText.toLowerCase())
  );

  const pageSize = 9;
  const paginatedData = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Card style={{ position: "relative" }}>
        {/* Loader Overlay */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
            }}
          >
            <Spin size="large" tip="Loading reviews..." />
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: "24px" }}>
          <Search
            placeholder="Search Reviews..."
            allowClear
            enterButton={
              <Button
                icon={<SearchOutlined />}
                size="large"
                style={{
                  color: "#FA8800",
                  borderColor: hovered ? "#FA8800" : "#bfbfbf",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              />
            }
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          loading={false} // Disable Table's own spinner since we're using overlay
          size="middle"
          style={{ marginBottom: "16px" }}
          scroll={{ x: 800 }}
          rowKey="key"
        />

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">
            Showing {currentPage * pageSize - (pageSize - 1)}–{Math.min(currentPage * pageSize, filteredReviews.length)} of{" "}
            {filteredReviews.length}
          </Text>
          <Pagination
            current={currentPage}
            total={filteredReviews.length}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
}
