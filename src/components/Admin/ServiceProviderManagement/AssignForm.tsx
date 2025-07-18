'use client';
import React from "react";
import { Row, Col, Select, Button, Typography, Card } from "antd";
import Title from "antd/es/typography/Title";

const { Text } = Typography;

interface AssignUserFormProps {
  selectedUser: string;
  selectedProvider: string;
  selectedRole: string;
  onAssignUser: () => void;
  onChangeUser: (value: string) => void;
  onChangeProvider: (value: string) => void;
  onChangeRole: (value: string) => void;
}

const AssignUserForm: React.FC<AssignUserFormProps> = ({
  selectedUser,
  selectedProvider,
  selectedRole,
  onAssignUser,
  onChangeUser,
  onChangeProvider,
  onChangeRole,
}) => {
  return (
    <Card>
      <Title level={4} style={{ margin: 0 }}>
        👥 Assign Users as Providers
      </Title>
      <div className="flex justify-center items-center mt-4">
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          {/* Select User */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Select User</Text>
            </div>
            <Select
              placeholder="Select user..."
              style={{ width: "100%" }}
              size="large"
              value={selectedUser}
              onChange={onChangeUser}
            >
              <Select.Option value="john">John Doe</Select.Option>
              <Select.Option value="jane">Jane Smith</Select.Option>
              <Select.Option value="bob">Bob Johnson</Select.Option>
              <Select.Option value="alice">Alice Brown</Select.Option>
            </Select>
          </Col>

          {/* Select Provider */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Select Provider</Text>
            </div>
            <Select
              placeholder="Select provider..."
              style={{ width: "100%" }}
              size="large"
              value={selectedProvider}
              onChange={onChangeProvider}
            >
              <Select.Option value="fasttrack">FastTrack Logistics</Select.Option>
              <Select.Option value="quickship">QuickShip Express</Select.Option>
              <Select.Option value="reliable">Reliable Services</Select.Option>
            </Select>
          </Col>

          {/* Select Role */}
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Assign Role</Text>
            </div>
            <Select
              placeholder="Select role..."
              style={{ width: "100%" }}
              size="large"
              value={selectedRole}
              onChange={onChangeRole}
            >
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="operator">Operator</Select.Option>
              <Select.Option value="supervisor">Supervisor</Select.Option>
            </Select>
          </Col>

          {/* Empty Column for Layout Adjustments */}
          <Col xs={24} sm={12} md={6}></Col>
        </Row>

        {/* Button Row */}
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              onClick={onAssignUser}
              style={{
                backgroundColor: "#fa8c16",
                borderColor: "#fa8c16",
                width: "100%", // Ensures the button is the same width as the Select columns
                marginTop: "20px", // Adds space between the button and fields
              }}
            >
              👤 Assign User
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default AssignUserForm;
