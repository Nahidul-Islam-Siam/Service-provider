"use client";

import type React from "react";
import { useState } from "react";
import {
  Button,
  Input,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Upload,

} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "@/redux/features/user";
import { useCreateServiceRegionMutation } from "@/redux/features/provider/serviceRegion/serviceRegionApi";
import { RcFile } from "antd/es/upload/interface"; 
import { toast } from "sonner";

const { Title } = Typography;

interface RegionData {
  key?: string;
  region?: string;
  id?: string;
}

const ServiceRegions: React.FC = () => {
  const [regions, setRegions] = useState<RegionData[]>([
    { key: "1", region: "Kingston, Jamaica" },
    { key: "2", region: "Montego Bay, Jamaica" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState<RcFile | null>(null); // For handling file uploads

  const { data: user } = useGetMeQuery();
  const [createServiceRegion] = useCreateServiceRegionMutation();

  const sProviderId = user?.data?.id;

  // Add Region to the list
  const handleAddRegion = () => {
    if (inputValue.trim()) {
      const newRegion: RegionData = {
        key: Date.now().toString(),
        region: inputValue.trim(),
      };
      setRegions([...regions, newRegion]);
      setInputValue("");
    }
  };

  // Delete Region from the list
  const handleDeleteRegion = (key: string) => {
    setRegions(regions.filter((region) => region.key !== key));
  };

  // Save Regions and Uploaded File
  const handleSaveChanges = async () => {
    console.log(
      "Saving regions and file...",
      sProviderId,
      regions,
      uploadedFile
    ); // Add this for debugging

    // return;
    if (!sProviderId) {
      toast.error("User ID is missing!");
      return;
    }

    const placeNames = regions.map((region) => region.region);

    // Prepare the form data (for uploaded file and regions)
    const formData = new FormData();

    const newData = {
      sProviderId: sProviderId,
      placeName: placeNames,
    };
    formData.append("bodyData", JSON.stringify(newData));
    if (uploadedFile) {
      formData.append("zipeFile", uploadedFile);
    }

    // Log FormData entries for debugging (can't log FormData directly)
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      const response = await createServiceRegion(formData).unwrap();
  

  if (response) {
    toast.success(response?.message);
  } else {
    toast.error(response?.message);
  }
      setRegions([]); 
      setUploadedFile(null); 
    } catch  {
  
      toast.error("Failed to save service regions");
    }
  };

  // Handle file selection
  const handleFileUpload = (file: RcFile) => {
    setUploadedFile(file);
    return false; 
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddRegion();
    }
  };

  return (
    <div style={{ padding: "", backgroundColor: "#f5f5f5", minHeight: "" }}>
      <div style={{ maxWidth: "", margin: "0 auto" }}>
        {/* Header */}
        <Title level={2} style={{ marginBottom: "32px", color: "#333" }}>
          Service Regions
        </Title>

        {/* Input Section */}
        <Row gutter={16} style={{ marginBottom: "32px" }}>
          <Col flex="auto">
            <Input
              placeholder="Add city, state, or zip code"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                border: "2px solid #ff8c00",
              }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={handleAddRegion}
              style={{
                backgroundColor: "#ff8c00",
                borderColor: "#ff8c00",
                borderRadius: "8px",
                height: "48px",
                paddingLeft: "20px",
                paddingRight: "20px",
                fontWeight: 500,
              }}
            >
              + Add Region
            </Button>
          </Col>
          <Col>
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false} // Disable the upload list
            >
              <Button
                size="large"
                icon={<UploadOutlined />}
                style={{
                  borderColor: "#ff8c00",
                  color: "#ff8c00",
                  borderRadius: "8px",
                  height: "48px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  fontWeight: 500,
                }}
              >
                Upload File
              </Button>
            </Upload>
          </Col>
        </Row>

        {/* Regions List */}
        <div style={{ marginBottom: "32px" }}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {regions.map((region) => (
              <Card
                key={region.key}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e8e8e8",
                  backgroundColor: "#f8f9fa",
                }}
                bodyStyle={{ padding: "16px 20px" }}
              >
                <Row justify="space-between" align="middle">
                  <Col flex="auto">
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#333",
                        fontWeight: 500,
                      }}
                    >
                      {region.region}
                    </span>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteRegion(region.key!)}
                      style={{
                        color: "#ff4d4f",
                        padding: "4px 8px",
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </div>

        {/* Save Button */}
        {regions.length > 0 && (
          <Button
            type="primary"
            size="large"
            onClick={handleSaveChanges}
            style={{
              backgroundColor: "#ff8c00",
              borderColor: "#ff8c00",
              borderRadius: "8px",
              height: "48px",
              paddingLeft: "24px",
              paddingRight: "24px",
              fontWeight: 500,
            }}
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceRegions;
