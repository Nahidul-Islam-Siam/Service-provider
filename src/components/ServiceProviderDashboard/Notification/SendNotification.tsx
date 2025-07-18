'use client';
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, Button, Typography, message, Input } from "antd";
import { useGetAllNotificationInfoQuery, usePostNotificationMutation } from "@/redux/features/provider/notificationApi"; 
import { toast } from "sonner";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const SendNotification: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>(""); // selectedUser will be treated as receiverId
  const [customMessage, setCustomMessage] = useState<string>(""); 
  const [defaultMessage, setDefaultMessage] = useState<string>(""); 
  const [filteredUsers, setFilteredUsers] = useState<{ id: string; name: string; shipmentId: string }[]>([]);  // Ensure shipmentId is also present
  const [shipmentID, setShipmentID] = useState<string>("");  // State to hold shipment ID

  // Fetch notifications and users from the same API
  const { data, isLoading, isError } = useGetAllNotificationInfoQuery(undefined);
  const [postNotification] = usePostNotificationMutation();

  // Define a type for notification data
  interface NotificationInfo {
    userId: string; // This will be treated as receiverId
    userName: string;
    shipmentId: string; // Ensure shipmentId is included
  }

  // Map notification data to get filtered users
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const users = data.data.map((notification: NotificationInfo) => ({
        id: notification.userId,  // userId is treated as receiverId
        name: notification.userName,
        shipmentId: notification.shipmentId,  // Capture the shipment ID from the notification data
      }));
      setFilteredUsers(users);
    }
  }, [data]);

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data. Please try again.</div>;

  // Handle sending custom message
  const handleSendMessage = async () => { 
    if (!selectedUser || !customMessage || !shipmentID) {
      toast.error("Please select a user, enter a message, and ensure a shipment ID is provided");
      return;
    }
    try {
      const res = await postNotification({
        receviderId: selectedUser,  // Send selectedUser as receviderId
        message: customMessage,
        shipmentID: shipmentID,  // Include shipmentID here
      }).unwrap();
      toast.success(res.message || "Message sent successfully!");

      // Reset the form
      setSelectedUser("");
      setCustomMessage("");
      setShipmentID(""); // Clear shipment ID after sending the message
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message || "Failed to send message");
      } else {
        toast.error("Failed to send message");
      }
    }
  };

  // Handle sending default message, use the same message if defaultMessage is empty
  const handleSendDefaultMessage = async () => {
    const messageToSend = defaultMessage || customMessage;  // If defaultMessage is empty, use customMessage
    if (!selectedUser || !messageToSend || !shipmentID) {
      message.error("Please select a user, enter a message, and ensure a shipment ID is provided");
      return;
    }
    try {
      await postNotification({
        receviderId: selectedUser || defaultMessage, // Send selectedUser as receviderId
        message: messageToSend,   // Use messageToSend here
        shipmentID: shipmentID,  // Include shipmentID here
      }).unwrap();
      toast.success("Message sent successfully!");
      setDefaultMessage(""); // Clear default message after sending
    } catch  {
      toast.error("Failed to send message");
    }
  };

  // Log the selected user ID (receiver) and shipment ID
  const handleUserChange = (value: string) => {
    const selectedUserData = filteredUsers.find(user => user.id === value);
    if (selectedUserData) {
      setSelectedUser(value);  // Set receiverId
      setShipmentID(selectedUserData.shipmentId);  // Set shipment ID for selected user
     
    }
  };

  return (
    <Card style={{ marginBottom: "24px" }}>
      <Title level={4} style={{ marginBottom: "24px" }}>
        Send Notification
      </Title>
      <Row gutter={24}>
        <Col span={12}>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Select user
          </Text>
          <Select
            placeholder="Select user"
            style={{ width: "100%" }}
            size="large"
            value={selectedUser}
            onChange={handleUserChange}  // Directly handle user change
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {filteredUsers.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Message
          </Text>
          <TextArea
            rows={6}
            placeholder="Enter your message here..."
            value={customMessage}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCustomMessage(e.target.value)
            }
            style={{ resize: "none" }}
          />
          <Button
            type="primary"
            size="large"
            onClick={handleSendMessage}
            style={{
              backgroundColor: "#fa8c16",
              borderColor: "#fa8c16",
              marginTop: "16px",
            }}
          >
            Send Message
          </Button>
        </Col>
        <Col span={12}>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Default Message
          </Text>
          <TextArea
            rows={6}
            placeholder="Enter default message here..."
            value={defaultMessage}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDefaultMessage(e.target.value)
            }
            style={{ resize: "none" }}
          />
          <Button
            type="primary"
            size="large"
            onClick={handleSendDefaultMessage}
            style={{
              backgroundColor: "#fa8c16",
              borderColor: "#fa8c16",
              marginTop: "16px",
            }}
          >
            Send Default Message
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default SendNotification;
