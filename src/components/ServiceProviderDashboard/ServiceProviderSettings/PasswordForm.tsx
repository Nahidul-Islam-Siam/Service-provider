/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "@/redux/features/user";
import { auth } from "@/lib/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { toast } from "sonner";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}
interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordForm: React.FC = () => {
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { data: responseData } = useGetMeQuery();
  const userData = responseData?.data as UserInfo | undefined;

  const handleSubmit = async(values: PasswordFormValues) => {
    if(values.newPassword !== values.confirmPassword){
      toast.error("New Password do not match!");
      return;
    }

    const user = auth?.currentUser;

    if (!user || !userData?.email){
      toast.error("User not authenticated or email missing.");
      return;
    }

    setPasswordLoading(true);

    try{
      const credential = EmailAuthProvider.credential(
        userData.email,
        values.currentPassword
      )

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, values.newPassword);
      toast.success("Password update successfully!");
      passwordForm.resetFields();
    }
    catch(error: any) {
      console.log("Password update error:", error);
      const friendlyMessage = 
      error?.code === "auth/wrong-password"
      ?"Current Password is incorrect"
      : error?.message || "Failed to update password";
      toast.error(friendlyMessage);
    }finally{
      setPasswordLoading(false)
    }

    // Handle form submission logic here
  };

  return (
    <Form form={passwordForm} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Current Password"
        name="currentPassword"
        rules={[
          { required: true, message: "Please enter your current password" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          size="large"
          placeholder="Enter current password"
        />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[
          { required: true, message: "Please enter your new password" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          size="large"
          placeholder="Enter new password"
        />
      </Form.Item>

      <Form.Item
        label="Confirm New Password"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your new password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          size="large"
          placeholder="Confirm new password"
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        loading= {passwordLoading}
        size="large"
        style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
      >
        Update Password
      </Button>
    </Form>
  );
};

export default PasswordForm;
