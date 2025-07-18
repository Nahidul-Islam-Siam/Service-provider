"use client"

import type React from "react"
import { useState } from "react"
import { Card, Button, Upload, Typography, Row, Col, Tag } from "antd"
import { CloudUploadOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"

const { Title, Text } = Typography
const { Dragger } = Upload

interface DocumentRecord {
  key: string
  document: string
  status: "approved" | "rejected" | "pending"
  expiryDate?: string
  pendingText?: string
}

const UploadComplianceDocuments: React.FC = () => {
  const [documentsData] = useState<DocumentRecord[]>([
    {
      key: "1",
      document: "Business License",
      status: "approved",
      expiryDate: "Dec 31, 2024",
    },
    {
      key: "2",
      document: "Insurance Certificate",
      status: "rejected",
      expiryDate: "Jan 15, 2024",
    },
    {
      key: "3",
      document: "Government-Issued ID",
      status: "approved",
      expiryDate: "Mar 20, 2025",
    },
    {
      key: "4",
      document: "Customs Permit",
      status: "pending",
      pendingText: "Pending",
    },
  ])

  const getStatusConfig = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return { color: "#52c41a", backgroundColor: "#f6ffed", text: "Approve" }
      case "rejected":
        return { color: "#ff4d4f", backgroundColor: "#fff2f0", text: "Reject" }
      case "pending":
        return { color: "#1890ff", backgroundColor: "#e6f7ff", text: "Pending Approval" }
      default:
        return { color: "#d9d9d9", backgroundColor: "#fafafa", text: "Unknown" }
    }
  }

  const handleReplace = (documentKey: string) => {
    console.log(`Replace document: ${documentKey}`)
    // Add replace logic here
  }

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "/upload",
    accept: ".jpeg,.jpg,.png,.pdf,.doc,.docx",
    onChange(info) {
      const { status } = info.file
      if (status === "done") {
        console.log(`${info.file.name} file uploaded successfully.`)
      } else if (status === "error") {
        console.log(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  return (
    <div style={{ padding: "", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "", margin: "0 auto" }}>
        {/* Header */}
        <Title level={2} style={{ textAlign: "center", marginBottom: "32px", color: "#333" }}>
          Upload Compliance Documents
        </Title>

        {/* Upload Area */}
        <Card
          style={{
            borderRadius: "12px",
            border: "2px dashed #ff8c00",
            backgroundColor: "#fefefe",
            marginBottom: "32px",
          }}
          bodyStyle={{ padding: "40px 20px", textAlign: "center" }}
        >
          <Dragger {...uploadProps} style={{ border: "none", backgroundColor: "transparent" }}>
            <div style={{ marginBottom: "16px" }}>
              <CloudUploadOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
            </div>
            <Text strong style={{ fontSize: "16px", color: "#333", display: "block", marginBottom: "8px" }}>
              Drag and drop compliance doc... here
            </Text>
            <Text type="secondary" style={{ fontSize: "14px", display: "block", marginBottom: "20px" }}>
              Format: jpeg, png & Max file size: 25 MB
            </Text>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: "#ff8c00",
                borderColor: "#ff8c00",
                borderRadius: "8px",
                height: "40px",
                paddingLeft: "24px",
                paddingRight: "24px",
                fontWeight: 500,
              }}
            >
              Browse Files
            </Button>
          </Dragger>
        </Card>

        {/* Documents Grid */}
        <Row gutter={[16, 16]}>
          {documentsData.map((document) => {
            const statusConfig = getStatusConfig(document.status)
            return (
              <Col xs={24} sm={12} lg={12} key={document.key}>
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
                      {document.document}
                    </Title>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <Tag
                      style={{
                        color: statusConfig.color,
                        backgroundColor: statusConfig.backgroundColor,
                        border: `1px solid ${statusConfig.color}`,
                        borderRadius: "6px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {statusConfig.text}
                    </Tag>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    {document.expiryDate ? (
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Expires: {document.expiryDate}
                      </Text>
                    ) : (
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        {document.pendingText}
                      </Text>
                    )}
                  </div>

                  {document.status !== "pending" && (
                    <Button
                      type="text"
                      onClick={() => handleReplace(document.key)}
                      style={{
                        color: "#ff8c00",
                        border: "none",
                        padding: "4px 0",
                        height: "auto",
                        fontWeight: 500,
                      }}
                    >
                      Replace
                    </Button>
                  )}
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
    </div>
  )
}

export default UploadComplianceDocuments
