/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from "react";
import { Button, Input, Table, Space, Pagination, Spin, Alert } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddProviderTypeModal from "@/components/Admin/ServiceProviderManagement/AddProviderTypesModal";
import { useGetProviderTypesQuery, useDeleteProviderTypeMutation } from "@/redux/features/admin/ServiceProvider/ServiceProder"; 
import { ProviderFormValues } from "./AddProviderModal"; 
import { toast } from "sonner";

export default function ProviderTypes() {
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  const { data, isLoading, isError, error, refetch } = useGetProviderTypesQuery();
  
 
  const [deleteProviderType] = useDeleteProviderTypeMutation();

  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle edit action
  const handleEdit = (id: string) => {
    console.log("Edit provider type:", id);
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
    const res =  await deleteProviderType(id).unwrap(); // Call delete mutation
    toast.success(res?.message || "Provider type deleted successfully");
      refetch(); // Refetch data to show updated list
      console.log("Provider type deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting provider type:", error);
    }
  };

  // Handle adding new provider type
  const handleAddType = () => {
    setIsModalVisible(true);
    console.log("Add new provider type");
  };

  // Filter data based on search term
  const filteredTypes = (data?.data?.filter((type) =>
    type.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []).map((type) => ({
    ...type,
    assignedUser: type.assignedUser ?? null,
    providerService: type.providerService ?? null,
  })) as ProviderFormValues[];

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: ProviderFormValues) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => record.id && handleEdit(record.id)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => record.id && handleDelete(record.id)}  // Trigger delete on button click
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  // Handle the modal action for adding a new provider type
  const handleAddProviderType = (newType: ProviderFormValues) => {
    setIsModalVisible(false);
    console.log("Provider Type Added:", newType);
    refetch(); // Refetch data after adding
  };

  return (
    <div style={{ padding: "24px", background: "#fff", minHeight: "100vh" }}>
      <div style={{ marginBottom: "16px" }}>
        <Space
          style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
        >
          <div>
            <h1 style={{ fontSize: "24px", color: "#fa8c16" }}>🔧 Provider Types</h1>
            <p>Create a new provider type</p>
          </div>
          <Space>
            <Input
              placeholder="Search Provider Type"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddType}
              style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
            >
              Add Type
            </Button>
          </Space>
        </Space>

        {/* Loading Spinner or Error Message */}
        {isLoading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : isError ? (
          <Alert
            message="Error"
            description={typeof error === "object" && error !== null
              ? "message" in error
                ? (error as { message: string }).message
                : "data" in error && typeof error.data === "string"
                  ? error.data
                  : "An error occurred while fetching data."
              : "An error occurred while fetching data."}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        ) : (
          // Table
          <Table
            columns={columns}
            dataSource={filteredTypes}
            rowKey="id"
            pagination={false}
          />
        )}

        {/* Pagination */}
        {!isLoading && !isError && (
          <Pagination
            current={currentPage}
            pageSize={5}
            total={filteredTypes.length}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        )}
      </div>

      {/* Modal for adding provider type */}
      <AddProviderTypeModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddProviderType={handleAddProviderType}
      />
    </div>
  );
}
