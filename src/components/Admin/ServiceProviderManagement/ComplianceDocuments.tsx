'use client';
import React, { useState } from "react";
import { Row, Col, Card, Badge, Select,  Typography, Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

interface ComplianceDocument {
  id: string;
  name: string;
  status: "active" | "expired";
  expiryDate: string;
}

interface ComplianceDocumentsProps {
  complianceDocuments: ComplianceDocument[];
  onUpdateStatus: (docId: string, status: string) => void;
}

const ComplianceDocuments: React.FC<ComplianceDocumentsProps> = ({
  complianceDocuments,
  onUpdateStatus,
}) => {
  const [filteredDocuments, setFilteredDocuments] = useState(complianceDocuments);

  // Handle status change
  const handleStatusChange = (docId: string, value: string) => {
    const updatedDocs = [...filteredDocuments];
    const docIndex = updatedDocs.findIndex((doc) => doc.id === docId);
    if (docIndex !== -1) {
      updatedDocs[docIndex].status = value === "Accept" ? "active" : "expired";
      setFilteredDocuments(updatedDocs); // Update the filtered documents
      onUpdateStatus(docId, updatedDocs[docIndex].status); // Notify parent component
    }
  };

  // Handle search functionality
  const handleSearch = (value: string) => {
    const filteredDocs = complianceDocuments.filter((doc) =>
      doc.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDocuments(filteredDocs); // Update the filtered documents based on search
  };

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          📋 Compliance Documents
        </Title>
        <Search
          placeholder="Search compliance documents..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          onSearch={handleSearch} // Trigger search on enter
        />
      </div>

      <Row gutter={[16, 16]}>
        {filteredDocuments.map((doc) => (
          <Col key={doc.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="flex justify-between items-center"
              >
                <Text strong>{doc.name}</Text>
                <Badge
                  status={doc.status === "active" ? "success" : "error"}
                  text={doc.status === "active" ? "Active" : "Expired"}
                />


                       <div style={{ marginTop: 16 }}>
                <Select
                  defaultValue={doc.status === "active" ? "Accept" : "Reject"}
                  style={{ width: 120 }}
                  onChange={(value) => handleStatusChange(doc.id, value)}
                >
                  <Select.Option value="Accept">Accept</Select.Option>
                  <Select.Option value="Reject">Reject</Select.Option>
                </Select>
              </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {doc.status === "active" ? "Expires" : "Expired"}: {doc.expiryDate}
                </Text>
              </div>

              {/* Dropdown for changing status */}
       

           
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default ComplianceDocuments;
