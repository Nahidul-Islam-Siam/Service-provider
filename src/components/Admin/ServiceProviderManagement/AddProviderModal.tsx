import React, { useState } from "react";
import { Modal, Input, Form, Button, Select, Switch, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  useGetProviderTypesQuery,
  useGetServiceProvidersQuery,
  useRegisterProviderMutation,
} from "@/redux/features/admin/ServiceProvider/ServiceProder";
import { toast } from "sonner";

export interface ProviderFormValues {
  name: string;
  email: string; 
  phoneNumber?: string;
  assignedUser: string;
  providerService: string;
  providerStatus?: boolean;
  password: string; 
  providerType: string; 
  id?: string; 
  idToken?: string; // Added idToken for Firebase
  refreshToken?: string; // Added refreshToken for Firebase
  role?: string; // Added role property
}

interface AddProviderModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddProvider: (values: ProviderFormValues) => void;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({
  visible,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState<string | undefined>(undefined);

  const [registerProvider] = useRegisterProviderMutation();

  // Handle form submission
  const handleSubmit = async (values: ProviderFormValues) => {
    console.log("Name:", values.name);

    try {
      if (!auth) throw new Error("Firebase auth not initialized");

      // Register user with Firebase
      const providerCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const provider = providerCredential.user;
      const idToken = await provider.getIdToken();
      const refreshToken = provider.refreshToken;

      // Send the data to parent component for further processing
      await registerProvider({
        name: values.name,
        role: "SERVICE_PROVIDER",
        providerService: values.providerService,
        providerType: values.providerType,
        phoneNumber: phone, // Include the phone number
        idToken,
        refreshToken,
      });

      console.log("Provider created successfully:", values);

      form.resetFields();
      setPhone(undefined);
      onCancel();
      toast.success("Provider added successfully!");
    } catch (error) {
      console.error("Failed to create provider:", error);
      toast.error("Error creating provider.");
    }
  };

  // Fetch provider types and provider services
  const { data: providerTypes, isLoading: loadingProviderTypes } =
    useGetProviderTypesQuery();
  const { data: providerService, isLoading: loadingProviderService } =
    useGetServiceProvidersQuery();

  // Handle cancel action
  const handleCancel = () => {
    form.resetFields();
    setPhone(undefined);
    onCancel();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      closeIcon={<CloseOutlined style={{ fontSize: "16px", color: "#666" }} />}
      title="Add Provider"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          providerStatus: false,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the provider name" },
              ]}
            >
              <Input
                placeholder="Name"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter the provider email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="fasttrack@email.com"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter the phone number" },
              ]}
            >
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
                placeholder="Enter phone number"
                style={{
                  height: "40px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Assigned User"
              name="assignedUser"
              rules={[
                { required: true, message: "Please select an assigned user" },
              ]}
            >
              <Select
                placeholder="Select user"
                style={{ height: "40px" }}
                dropdownStyle={{ borderRadius: "6px" }}
              >
                <Select.Option value="user1">User 1</Select.Option>
                <Select.Option value="user2">User 2</Select.Option>
                <Select.Option value="user3">User 3</Select.Option>
                <Select.Option value="user4">User 4</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Provider Service"
              name="providerService"
              rules={[
                { required: true, message: "Please select a provider service" },
              ]}
            >
              <Select
                placeholder="Select Provider Service"
                style={{ height: "40px" }}
                dropdownStyle={{ borderRadius: "6px" }}
                loading={loadingProviderService}
              >
                {providerService?.data?.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Provider Types"
              name="providerTypes"
              rules={[
                { required: true, message: "Please select a provider type" },
              ]}
            >
              <Select
                placeholder="Select Provider Type"
                style={{ height: "40px" }}
                dropdownStyle={{ borderRadius: "6px" }}
                loading={loadingProviderTypes}
              >
                {providerTypes?.data?.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Provider Status"
              name="providerStatus"
              valuePropName="checked"
            >
              <Switch style={{ backgroundColor: "#52c41a" }} size="default" />
            </Form.Item>
          </Col>
        </Row>

        {/* Password Field */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter a password" }]}
            >
              <Input.Password
                placeholder="Enter password"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            paddingTop: "8px",
            borderTop: "1px solid #f0f0f0",
            marginTop: "8px",
          }}
        >
          <Button
            onClick={handleCancel}
            style={{
              height: "40px",
              paddingLeft: "24px",
              paddingRight: "24px",
              borderRadius: "6px",
              border: "1px solid #d9d9d9",
              color: "#666",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              height: "40px",
              paddingLeft: "24px",
              paddingRight: "24px",
              backgroundColor: "#ff8c00",
              borderColor: "#ff8c00",
              borderRadius: "6px",
              fontWeight: 500,
              boxShadow: "none",
            }}
          >
            Add Provider
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProviderModal;
