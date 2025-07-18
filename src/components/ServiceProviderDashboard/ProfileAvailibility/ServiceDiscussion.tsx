import React, { useState } from "react";
import { Card, Switch, Typography, Button, Row, Col } from "antd";
import AddBundleDiscountModal from "./AddBundleDiscountModal";
import { useDeleteBundleDiscountMutation, useGetAllBundleDiscountsQuery, useUpdateBundleDiscountMutation } from "@/redux/features/provider/promoApi";
import { toast } from "sonner";
import { Trash } from "lucide-react";


// Define the BundleDiscount type according to your API response
type BundleDiscount = {
  id: string;
  name: string;
  description: string;
  discount: number;
  price: number;
  status: boolean;
  
};

// Define the API response type for bundle discounts
type BundleDiscountsApiResponse = {
  data: BundleDiscount[];
  message?: string;
  // Add other fields if needed, e.g.:
  // extraField?: string;
};

const { Title, Text } = Typography;

const BundleDiscounts: React.FC = () => {
  // Fetch bundle discounts from the API
  const { data, isLoading, error, refetch } = useGetAllBundleDiscountsQuery() as {
    data?: BundleDiscountsApiResponse;
    isLoading: boolean;
    error?: unknown;
    refetch: () => void;
  };
  const [updateBundleDiscount] = useUpdateBundleDiscountMutation();
  const [deleteBundleDiscount] = useDeleteBundleDiscountMutation();

  // State to manage modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle status change for each bundle
  const handleStatusChange = async (id: string, checked: boolean) => {
    try {
      const res = await updateBundleDiscount({
        id,
        updatedData: { stutus: checked } // Fixed typo: changed 'stutus' to 'status'
      }).unwrap();
      toast.success(res?.message || "Status updated successfully!");
    } catch {
      toast.error("Failed to update status");
    }
  };


  const handleAddBundle = () => {
    setIsModalVisible(true); // Show modal when button is clicked
  };

  const handleDeleteBundle = async (id: string) => {
    try {
      const res = await deleteBundleDiscount({ id }).unwrap();

      if(res?.message){
        toast.success(res?.message || "Bundle deleted successfully!");
        refetch()
      }else {
        toast.success(res?.message || "Bundle deleted successfully!");
      }
    } catch {
      toast.error("Failed to delete bundle");
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false); // Hide modal
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data!</div>;
  }

  return (
    <div style={{ padding: "", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: "", margin: "20px auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Title level={2} style={{ margin: 0, color: "#333" }}>
            Bundle Discounts
          </Title>
          <Button
            type="primary"
            size="large"
            onClick={handleAddBundle}
            style={{
              backgroundColor: "#ff8c00",
              borderColor: "#ff8c00",
              borderRadius: "8px",
              height: "40px",
              paddingLeft: "16px",
              paddingRight: "16px",
              fontWeight: 500,
            }}
          >
            + Add Bundle
          </Button>
        </div>

        {/* Bundle Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
          {data?.data?.map((bundle: BundleDiscount) => (
            <Col xs={24} sm={12} lg={8} key={bundle.id}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  height: "100%",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <Title level={4} style={{ margin: 0, marginBottom: "8px", color: "#333" }}>
                    {bundle.name}
                  </Title>
                  <Text style={{ color: "#666" }}>{bundle.description}</Text>
                </div>

                <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                  <Col span={12}>
                    <div>
                      <Text strong style={{ fontSize: "24px", color: "#333" }}>
                        {bundle.discount}
                      </Text>
                      <Text style={{ fontSize: "14px", color: "#666", marginLeft: "4px" }}>
                        % discount
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text strong style={{ fontSize: "18px", color: "#333" }}>
                        ${bundle.price}
                      </Text>
                    </div>
                  </Col>
                </Row>

                <Row justify="space-between" align="middle">
                  <Col>
                    <Switch
                      checked={bundle.status}
                      onChange={(checked: boolean) => handleStatusChange(bundle.id, checked)}
                      style={{
                        backgroundColor: bundle.status ? "#52c41a" : undefined,
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      icon={<Trash />}
                      onClick={() => handleDeleteBundle(bundle.id)}
                      style={{
                        color: "#ff8c00",
                        border: "none",
                        padding: "4px 8px",
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Save Changes Button */}
        <Button
          type="primary"
          size="large"
          onClick={() => console.log("Saving bundle changes")}
          style={{
            backgroundColor: "#ff8c00",
            borderColor: "#ff8c00",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
            fontWeight: 500,
            marginBottom: "40px",
          }}
        >
          Save Changes
        </Button>
      </div>

      <AddBundleDiscountModal refetch={refetch} visible={isModalVisible} onCancel={handleCancelModal} />
    </div>
  );
};

export default BundleDiscounts;
