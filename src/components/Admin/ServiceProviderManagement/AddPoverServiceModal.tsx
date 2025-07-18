import React, { useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import { useCreateServiceMutation } from "@/redux/features/admin/ServiceProvider/ServiceProder"; 
import { toast } from "sonner"; 
import { ProviderFormValues } from "./AddProviderModal";



export interface AddProviderServiceModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddProviderType: (newType: ProviderFormValues) => void;
}

const AddProviderServiceModal: React.FC<AddProviderServiceModalProps> = ({
  visible,
  onCancel,

}) => {
  const [name, setName] = useState<string>(""); // State for the service name
  const [description, setDescription] = useState<string>(""); // State for the service description

  // Use the mutation hook for creating a service provider
  const [createService, { isLoading, isSuccess, error }] = useCreateServiceMutation();

  // Handle form submission for creating a new service provider
  const handleSubmit = async () => {
    if (name && description) {
      const providerData = { name, description };

      try {
        const response = await createService(providerData).unwrap(); // Trigger the POST request
        toast.success(response?.message || "Service Provider Created Successfully"); // Success message
        setName(""); // Clear the name field
        setDescription(""); // Clear the description field
      } catch (err) {
        console.error("Failed to create service provider:", err); // Handle error
        toast.error("Failed to create service provider.");
      }
    }
  };

  return (
    <Modal
      title="Add New Service Provider"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Service Provider Name"
          name="name"
          rules={[{ required: true, message: "Please enter a service provider name" }]}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter service provider name"
            style={{ height: "40px" }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            style={{ height: "40px" }}
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <Button onClick={onCancel} style={{ height: "40px" }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              height: "40px",
              backgroundColor: "#ff8c00",
              borderColor: "#ff8c00",
            }}
            loading={isLoading} // Show loading state while mutation is in progress
          >
            Submit
          </Button>
        </div>
      </Form>

      {/* Success or Error feedback */}
      {isSuccess && <p>Service Provider Created Successfully!</p>}
      {error && (
        <p>
          Error:{" "}
          {"status" in error
            ? typeof error.data === "string"
              ? error.data
              : JSON.stringify(error.data)
            : error.message || "An error occurred"}
        </p>
      )}
    </Modal>
  );
};

export default AddProviderServiceModal;
