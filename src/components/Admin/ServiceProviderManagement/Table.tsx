import React from "react";
import {
  Table,
  Tag,
  Badge,
  Space,
  Avatar,
  Button,
  Tooltip,
  Modal,
  notification,
  Spin,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import {
  useDeleteProviderMutation,
  useGetProviderQuery,
} from "@/redux/features/admin/ServiceProvider/ServiceProder";
import { toast } from "sonner";

interface ProviderData {
  key: string | undefined;
  providerName: string | undefined;
  contact: string;
  type: string;
  assignedUser: string | undefined;
  services: (string | undefined)[];
  statuses: string[];
}

interface ServiceProviderTableProps {
  onEdit: (key: string) => void;
}

const ServiceProviderTable: React.FC<ServiceProviderTableProps> = ({
  onEdit,
}) => {
  // Fetch data from the API using RTK Query
  const { data, isLoading, error } = useGetProviderQuery();
  const [deleteProvider, { isLoading: isDeleting }] =
    useDeleteProviderMutation();

  // Map API data to the format expected by the table
  const formattedData = data?.data?.map((provider) => ({
    key: provider.sProviderId ?? "",
    providerName: provider.name ?? "",
    contact: `${provider.email ?? ""} ${provider.phone ?? ""}`,
    type: provider.providerService || "Unknown",
    assignedUser: provider.name ?? "",
    services: [provider.providerService ?? ""],
    statuses: [provider.status ?? ""],
  }));

  // Columns configuration for the table
  const columns: ColumnsType<ProviderData> = [
    {
      title: "Provider Name",
      dataIndex: "providerName",
      key: "providerName",
      width: 150,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: 200,
      render: (contact: string) => {
        const [email, phone] = contact.split(" ");
        return (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <MailOutlined style={{ marginRight: "4px", color: "#1890ff" }} />
              <span>{email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <PhoneOutlined style={{ marginRight: "4px", color: "#52c41a" }} />
              <span>{phone}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: string) => {
        const colorMap: { [key: string]: string } = {
          "Digital Marketing": "blue",
          "General Dealer": "green",
          "Lift Aids": "purple",
        };
        return <Tag color={colorMap[type] || "default"}>{type}</Tag>;
      },
    },
    {
      title: "Assigned user",
      dataIndex: "assignedUser",
      key: "assignedUser",
      width: 150,
      render: (user: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{user}</span>
        </Space>
      ),
    },
    {
      title: "Statuses",
      dataIndex: "statuses",
      key: "statuses",
      width: 150,
      render: (statuses: string[]) => (
        <Space wrap>
          {statuses.map((status, index) => (
            <Badge
              key={index}
              status={status === "ACTIVE" ? "success" : "default"}
              text={status}
              style={{ fontSize: "12px" }}
            />
          ))}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (text, record) => (
        <Space>
          <Tooltip title="Edit Provider">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => record.key && onEdit(record.key)}
              style={{ color: "#fa8c16" }}
            />
          </Tooltip>
          <Tooltip title="Delete Provider">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => record.key && handleDelete(record.key)} // Handle delete
              danger
              loading={isDeleting}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handle the deletion process
  const handleDelete = async (providerId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this provider?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          const response = await deleteProvider(providerId).unwrap();
          toast.success("Provider deleted successfully");
          notification.success({
            message: "Provider deleted successfully",
            description: response.message,
          });
        } catch (err: unknown) {
          toast.error("Error deleting provider");
          notification.error({
            message: "Error deleting provider",
            description:
              err && typeof err === "object" && "message" in err
                ? (err as { message?: string }).message
                : "Something went wrong.",
          });
        }
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    ); // Using Spin component from Ant Design
  if (error) return <div>Error fetching data</div>;

  return (
    <Table
      columns={columns}
      dataSource={formattedData}
      pagination={{ pageSize: 5 }}
      rowKey={(record) => record.key || Math.random().toString(36)}
    />
  );
};

export default ServiceProviderTable;
