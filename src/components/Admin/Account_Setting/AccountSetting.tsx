/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Spin,
} from "antd";
import { useGetMeQuery } from "@/redux/features/user";
import { useUpdateAdminMutation } from "@/redux/features/admin/accountSettingApi/AccountSettingApi";
import { auth } from "@/lib/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { toast } from "sonner";

const { Title } = Typography;
const { Option } = Select;

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettings() {
  const [accountForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { data: responseData, isLoading: isUserLoading } = useGetMeQuery();
  const userData = responseData?.data as UserInfo | undefined;
  const [updateUser] = useUpdateAdminMutation();

  const handleSaveChanges = async () => {
    try {
      const values = await accountForm.validateFields();

      const payload = {
        id: userData?.id,
        data: {
          name: values.name,
          phone: values.phoneNumber,
        },
      };

      setLoading(true);
      await updateUser(payload).unwrap();
      toast.success("Account information updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (values: PasswordData) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const user = auth?.currentUser;

    if (!user || !userData?.email) {
      toast.error("User not authenticated or email missing.");
      return;
    }

    setPasswordLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        userData.email,
        values.currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);

      toast.success("Password updated successfully!");
      passwordForm.resetFields();
    } catch (error: any) {
      console.error("Password update error:", error);
      const friendlyMessage =
        error?.code === "auth/wrong-password"
          ? "Current password is incorrect"
          : error?.message || "Failed to update password";
      toast.error(friendlyMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Spin spinning={isUserLoading} tip="Loading account info..." size="large">
      <div
        style={{
          padding: "32px",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          {/* Account Info */}
          <div className="mb-6">
            <Card style={{ marginBottom: "24px", borderRadius: 8 }}>
              <Title level={5} style={{ marginBottom: "24px" }}>
                Account Information
              </Title>

              <Form
                form={accountForm}
                layout="vertical"
                onFinish={handleSaveChanges}
                initialValues={{
                  name: userData?.name,
                  email: userData?.email,
                  role: userData?.role,
                  phoneNumber: userData?.phone,
                }}
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Email Address" name="email">
                      <Input size="large" disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Role" name="role">
                      <Select size="large" disabled>
                        <Option value="ADMIN">Admin</Option>
                        <Option value="MANAGER">Manager</Option>
                        <Option value="USER">User</Option>
                        <Option value="VIEWER">Viewer</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phoneNumber"
                      rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    style={{
                      backgroundColor: "#FA8800",
                      borderColor: "#FA8800",
                      color: "#fff",
                      minWidth: 140,
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Card>
          </div>

          {/* Password Management */}
          <div className="w-[600px] mt-6">
            <Title level={5} style={{ marginBottom: "24px" }}>
              Password Management
            </Title>

            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item label="Current Password" name="currentPassword">
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item label="New Password" name="newPassword">
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: 8,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  size="large"
                  style={{
                    backgroundColor: "#FA8800",
                    borderColor: "#FA8800",
                    color: "#fff",
                    minWidth: 140,
                  }}
                >
                  Update Password
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Spin>
  );
}
