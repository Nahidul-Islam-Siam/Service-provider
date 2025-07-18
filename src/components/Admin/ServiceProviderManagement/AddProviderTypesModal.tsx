'use client';
import React, { useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import { usePostServiceTypesMutation } from "@/redux/features/admin/ServiceProvider/ServiceProder"; // Import the mutation hook
import { toast } from "sonner";
import { ProviderFormValues } from "@/components/Admin/ServiceProviderManagement/AddProviderModal";

interface AddProviderTypeModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddProviderType: (newType: ProviderFormValues) => void;
}
const AddProviderTypeModal: React.FC<AddProviderTypeModalProps> = ({
  visible,
  onCancel,

}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Use the mutation hook
  const [postServiceTypes, { isLoading }] = usePostServiceTypesMutation();

  // Define the expected response type
  interface PostServiceTypesResponse {
    message?: string;
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (name && description) {
      try {
        const response: PostServiceTypesResponse = await postServiceTypes({ name, description }).unwrap();
   

     if(response){
      toast.success(response?.message || "Provider type created successfully");
   
     }else{
      toast.error("Provider type created successfully");
     }
        setName(""); 
        setDescription("");
      } catch {
        toast.error("Failed to create provider type."); 
      }
    }
  };

  return (
    <Modal
      title="Add New Provider Type"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Provider Type Name"
          name="name"
          rules={[{ required: true, message: "Please enter a provider name" }]}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter provider type name"
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

     
    </Modal>
  );
};

export default AddProviderTypeModal;
