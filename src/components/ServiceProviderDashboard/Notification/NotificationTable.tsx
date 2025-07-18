"use client";
import React, { useEffect, useState } from "react";
import { Table, Space, Button, Input, Typography } from "antd";
import { SearchOutlined, CopyOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useGetAllNotificationQuery } from "@/redux/features/provider/notificationApi";
import { toast } from "sonner";

interface NotificationData {
  notificationKey: string;
  userName: string;
  message: string;
  time: string;
  date: string;
}

const NotificationTable: React.FC = () => {
  const { data: notifications, isLoading } =
    useGetAllNotificationQuery(undefined);

  const [notificationData, setNotificationData] = useState<NotificationData[]>(
    []
  );

  // Map the API data to the format used in the table
  useEffect(() => {
    if (notifications && notifications.success && notifications.data) {
      interface ApiNotification {
        receviderId: string;
        message: string;
        createdAt: string;
      }
      const mappedData = notifications.data.map(
        (notification: ApiNotification, index: number) => ({
          notificationKey: String(index + 1),
          userName: notification.receviderId, // Replace with actual user name if available
          message: notification.message,
          time: new Date(notification.createdAt).toLocaleTimeString(),
          date: new Date(notification.createdAt).toLocaleDateString(),
        })
      );
      setNotificationData(mappedData);
    }
  }, [notifications]);

  const handleCopy = (id: string,text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied to clipboard!");
     console.log("Copied Notification ID:", id); // Optionally log the ID

    // need the id to console
  };

  const columns: ColumnsType<NotificationData> = [
    {
      title: "Reciver ID",
      dataIndex: "userName",
      key: "userName",
      width: 120,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (text: string) => (
        <Typography.Text ellipsis={{ tooltip: text }} style={{ maxWidth: 280 }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record.notificationKey, record.message)}
            style={{
              backgroundColor: "#fff2e8",
              borderColor: "#fa8c16",
              color: "#fa8c16",
            }}
          >
            Copy
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography.Text strong style={{ fontSize: "16px" }}>
          Notification Table
        </Typography.Text>
        <Input
          placeholder="Search user, time, date..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
      </div>
      <Table
        columns={columns}
        dataSource={notificationData}
        loading={isLoading}
        pagination={{
          total: notificationData.length,
          pageSize: 5,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`,
        }}
        size="middle"
        scroll={{ x: 800 }}
        rowKey="notificationKey"
      />
    </div>
  );
};

export default NotificationTable;
