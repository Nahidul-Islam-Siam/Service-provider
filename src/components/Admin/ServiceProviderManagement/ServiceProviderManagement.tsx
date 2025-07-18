'use client';
import React, { useState } from "react";
import { Button, Typography, message, Input, Space,  Dropdown, Menu } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddProviderModal from "@/components/Admin/ServiceProviderManagement/AddProviderModal";
import { ProviderFormValues } from "@/components/Admin/ServiceProviderManagement/AddProviderModal"; 
import ServiceProviderTable from "@/components/Admin/ServiceProviderManagement/Table";
import AssignUserForm from "@/components/Admin/ServiceProviderManagement/AssignForm";
import ComplianceDocuments from "@/components/Admin/ServiceProviderManagement/ComplianceDocuments";
import Link from "next/link"; 
import { toast } from "sonner";

const { Title, Text } = Typography;

const ServiceProviderManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);


  const complianceDocuments: { id: string; name: string; status: "active" | "expired"; expiryDate: string }[] = [
    { id: "1", name: "Provider Agreement", status: "active", expiryDate: "2023-12-01" },
    { id: "2", name: "Service Contract", status: "expired", expiryDate: "2022-05-10" },
    { id: "3", name: "Logistics Contract", status: "active", expiryDate: "2024-01-15" },
  ];


  const handleAddProvider = (values: ProviderFormValues) => {
toast.success("Provider added successfully!",values);
    setIsModalVisible(false);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const handleAssignUser = () => {
    if (!selectedUser || !selectedProvider || !selectedRole) {
      message.error("Please fill in all fields");
      return;
    }
    message.success("User assigned successfully!");
    setSelectedUser("");
    setSelectedProvider("");
    setSelectedRole("");
  };


  const handleUpdateStatus = (docId: string, status: string) => {
    console.log(`Document ID: ${docId} status updated to: ${status}`);
    
  };

  const [selectedProviderService, setSelectedProviderService] = useState<string | undefined>(undefined);

  const handleMenuClick = (e: { key: string }) => {
    setSelectedProviderService(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="healthcare">
        <Link href="provider-types">Add Provider Type</Link>
      </Menu.Item>
      <Menu.Item key="provider-service">
        <Link href="provider-service">Add Providers Service</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: "24px", background: "#ffffff", minHeight: "100vh" }}>
      <div className="flex justify-between items-center mb-4 border p-3 bg-white rounded-2xl shadow-md">
        <div>
          <Title level={4} style={{ margin: 0, color: "#fa8c16" }}>
            🔧 Service Provider Management
          </Title>
          <Text>Create a new provider/company</Text>
        </div>
        <Space>
          <Input.Search
            placeholder="Search service providers..."
            style={{ width: 300 }}
            onSearch={() => {/* Implement search functionality here if needed */}}
            prefix={<SearchOutlined />}
          />
          <Button
            onClick={() => setIsModalVisible(true)}
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
          >
            Add Provider
          </Button>
        </Space>
      </div>

      {/* Provider Service Dropdown */}
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button>
              {selectedProviderService ? `Selected: ${selectedProviderService}` : "Select Provider Service"}
            </Button>
          </Dropdown>
        </Space>
      </div>

      {/* Service Provider Table */}
      <ServiceProviderTable onEdit={() => { /* Implement edit logic here */ }} />

      {/* Assign User Form */}
      <AssignUserForm
        selectedUser={selectedUser}
        selectedProvider={selectedProvider}
        selectedRole={selectedRole}
        onAssignUser={handleAssignUser}
        onChangeUser={setSelectedUser}
        onChangeProvider={setSelectedProvider}
        onChangeRole={setSelectedRole}
      />

      {/* Compliance Documents */}
      <ComplianceDocuments
        complianceDocuments={complianceDocuments}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Add Provider Modal */}
      <AddProviderModal visible={isModalVisible} onCancel={handleCancel} onAddProvider={handleAddProvider} />
    </div>
  );
};

export default ServiceProviderManagement;
