/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  Select,
  Button,
  DatePicker,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Modal,
  Input,
  Form,
  message,
  Spin,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useState } from "react";
import dayjs from "dayjs";

import {
  useGetAllUserLogsQuery,
  useUpdateUserLogMutation,
} from "@/redux/features/admin/userLogApi/UserLogApi";

const { Title, Text } = Typography;
const { Option } = Select;

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  userStatus: "ACTIVE" | "INACTIVE" | "SUSPENTED" | "BANNED";
  createdAt: string;
}

export default function UserAccountManagement() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateJoinedFilter, setDateJoinedFilter] = useState<dayjs.Dayjs | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  const {
    data: users,
    isLoading,
    refetch,
  } = useGetAllUserLogsQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  const userData: UserData[] =
    users?.data?.data?.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userStatus: user.userStatus,
      createdAt: user.createdAt,
    })) || [];

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [form] = Form.useForm();
  const [updateUser, { isLoading: updating }] = useUpdateUserLogMutation();

  const handleEditClick = (record: UserData) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updateUser({ id: editingUser?.id, body: values }).unwrap();
      message.success("User updated successfully");
      setEditModalVisible(false);
      refetch();
    } catch (error) {
      console.log("Update error:", error);
      message.error("Failed to update user");
    }
  };

  const filteredData = userData.filter((user) => {
    const isRoleMatch = roleFilter === "all" || user.role === roleFilter;
    const isStatusMatch = statusFilter === "all" || user.userStatus === statusFilter;
    const isDateMatch = dateJoinedFilter
      ? dayjs(user.createdAt).format("MM/DD/YYYY") === dateJoinedFilter.format("MM/DD/YYYY")
      : true;
    return isRoleMatch && isStatusMatch && isDateMatch;
  });

  const roles = [...new Set(userData.map((user) => user.role))];
  const statuses = [...new Set(userData.map((user) => user.userStatus))];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "blue";
      case "SERVICE_PROVIDER":
        return "green";
      case "USER":
        return "purple";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "warning";
      case "SUSPENTED":
        return "orange";
      case "BANNED":
        return "error";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<UserData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "userStatus",
      key: "userStatus",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Date Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("MM/DD/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{ color: "#fa8800" }}
          onClick={() => handleEditClick(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 5,
    });
  };

  return (
    <Spin spinning={isLoading} tip="Loading users..." size="large">
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div>
          {/* Header */}
          <Title level={3}>User Account Management</Title>
          <Text type="secondary">Filter and manage user roles and statuses</Text>

          {/* Filters */}
          <Card style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col>
                <Text strong>Role</Text>
                <Select
                  value={roleFilter}
                  style={{ width: 140 }}
                  onChange={setRoleFilter}
                  placeholder="Select Role"
                >
                  <Option value="all">All Roles</Option>
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Text strong>Status</Text>
                <Select
                  value={statusFilter}
                  style={{ width: 140 }}
                  onChange={setStatusFilter}
                  placeholder="Select Status"
                >
                  <Option value="all">All Statuses</Option>
                  {statuses.map((status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Text strong>Date Joined</Text>
                <DatePicker
                  value={dateJoinedFilter}
                  onChange={setDateJoinedFilter}
                  style={{ width: 140 }}
                  placeholder="Select Date"
                />
              </Col>
              <Col>
                <Button
                  type="default"
                  onClick={() => {
                    setRoleFilter("all");
                    setStatusFilter("all");
                    setDateJoinedFilter(null);
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Card style={{ marginTop: 16 }}>
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: users?.data?.meta?.total,
                showSizeChanger: false,
              }}
              onChange={handleTableChange}
              loading={false} // disabled because global spinner is used
            />
          </Card>

          {/* Edit Modal */}
          <Modal
            open={editModalVisible}
            title="Edit User"
            onCancel={() => setEditModalVisible(false)}
            onOk={handleUpdate}
            confirmLoading={updating}
            okText="Update"
            okButtonProps={{
              style: { backgroundColor: "#fa8800", borderColor: "#fa8800" },
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="userStatus"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="ACTIVE">ACTIVE</Option>
                  <Option value="INACTIVE">INACTIVE</Option>
                  <Option value="SUSPENTED">SUSPENTED</Option>
                  <Option value="BANNED">BANNED</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </Spin>
  );
}
