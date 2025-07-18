import React from "react";
import { Modal, Input, Form, Button, Select, Switch, Row, Col, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/features/user";
import { useCreateBundleDiscountMutation } from "@/redux/features/provider/profileAbilityApi";

interface AddBundleDiscountModalProps {
  visible: boolean;
  onCancel: () => void;
   refetch: () => void
}

const AddBundleDiscountModal: React.FC<AddBundleDiscountModalProps> = ({
  visible,
  onCancel,
  refetch
}) => {
  const [form] = Form.useForm();
  const { data, isLoading, isError } = useGetMeQuery();
  const [createBundleDiscount] = useCreateBundleDiscountMutation();

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !data?.data) {
    return <div>Error: Unable to fetch user data.</div>;
  }

  type UserInfo = {
    id: string;
  };

  const userData = data.data as UserInfo;
  const id = userData.id;

  type BundleFormValues = {
    title: string;
    price: number;
    discount: number;
    description: string;
    status: boolean;
  };

  const handleSubmit = async (values: BundleFormValues) => {
    const bundleData = {
      sProviderId: id,
      name: values.title,
      description: values.description,
      price: parseFloat(values.price.toString()), // Convert price to float
      discount: parseFloat(values.discount.toString()), // Convert discount to float
      isBundle: 1,
      stutus: values.status,
    };

    try {
      const res = await createBundleDiscount(bundleData).unwrap();
      if (res?.message) {
        toast.success(res?.message || "Bundle discount created successfully!");
        refetch()
      }else{
        toast.success(res?.message || "Bundle discount created successfully!");
      }
      toast.success(res?.message || "Bundle discount created successfully!");
      form.resetFields();
      onCancel();
    } catch {
      toast.error("Failed to create bundle discount.");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      destroyOnClose
      closeIcon={<CloseOutlined style={{ fontSize: "16px", color: "#666" }} />}
      title="Add Bundle"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: true,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please select a title" }]}
            >
              <Select
                placeholder="Select service"
                style={{ height: "40px" }}
                dropdownStyle={{ borderRadius: "6px" }}
              >
                <Select.Option value="1+ Service">1+ Service</Select.Option>
                <Select.Option value="2+ Service">2+ Service</Select.Option>
                <Select.Option value="3+ Service">3+ Service</Select.Option>
                <Select.Option value="4+ Service">4+ Service</Select.Option>
                <Select.Option value="5+ Service">5+ Service</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <Input
                type="number"
                placeholder="12345"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Discount %"
              name="discount"
              rules={[{ required: true, message: "Please enter the discount percentage" }]}
            >
              <Input
                type="number"
                placeholder="10"
                suffix="%"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status" valuePropName="checked">
              <Switch
                style={{ backgroundColor: "#52c41a" }}
                size="default"
                defaultChecked
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Added description field */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea
            placeholder="Enter a description for the bundle"
            style={{
              height: "80px",
              borderRadius: "6px",
              border: "1px solid #d9d9d9",
            }}
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            paddingTop: "24px",
            marginTop: "16px",
          }}
        >
          <Button
            onClick={onCancel}
            style={{
              height: "40px",
              paddingLeft: "32px",
              paddingRight: "32px",
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
              paddingLeft: "32px",
              paddingRight: "32px",
              backgroundColor: "#ff8c00",
              borderColor: "#ff8c00",
              borderRadius: "6px",
              fontWeight: 500,
              boxShadow: "none",
            }}
          >
            Add Bundle
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddBundleDiscountModal;
