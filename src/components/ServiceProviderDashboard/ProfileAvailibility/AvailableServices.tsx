"use client"

import type React from "react"
import { Button, Switch, Card, Row, Col, Typography, Space } from "antd"
import { EditOutlined, CarOutlined, GlobalOutlined, SafetyOutlined, TruckOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

interface ServiceData {
  key: string
  service: string
  description: string
  status: boolean
  price: string
  icon: React.ReactNode
}

const AvailableServices: React.FC = () => {
  const servicesData: ServiceData[] = [
    {
      key: "1",
      service: "Door Pickup",
      description: "Collection from customer location",
      status: true,
      price: "49.99",
      icon: <CarOutlined style={{ fontSize: "24px", color: "#666" }} />,
    },
    {
      key: "2",
      service: "Freight Forward",
      description: "International shipping service",
      status: true,
      price: "299.99",
      icon: <GlobalOutlined style={{ fontSize: "24px", color: "#666" }} />,
    },
    {
      key: "3",
      service: "Customs Broker",
      description: "Customs clearance service",
      status: false,
      price: "149.99",
      icon: <SafetyOutlined style={{ fontSize: "24px", color: "#666" }} />,
    },
    {
      key: "4",
      service: "Last-Mile Delivery",
      description: "Drop-off at customer location",
      status: false,
      price: "149.99",
      icon: <TruckOutlined style={{ fontSize: "24px", color: "#666" }} />,
    },
  ]

  const handleStatusChange = (checked: boolean, service: string) => {
    console.log(`${service} ${checked ? "enabled" : "disabled"}`)
  }

  const handleEdit = (service: string) => {
    console.log(`Edit ${service}`)
  }

  return (
    <div style={{ padding: "", backgroundColor: "#f5f5f5", minHeight: "" }}>
      <div style={{ maxWidth: "", margin: "0 auto" }}>
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
            Available Services
          </Title>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#ff8c00",
              borderColor: "#ff8c00",
              borderRadius: "8px",
              height: "40px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            + Add Service
          </Button>
        </div>

        {/* Services Cards */}
        <Row gutter={[0, 16]}>
          {servicesData.map((service) => (
            <Col span={24} key={service.key}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Row align="middle" justify="space-between">
                  <Col flex="auto">
                    <Space size={16} align="start">
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <Title level={4} style={{ margin: 0, marginBottom: "4px", color: "#333" }}>
                          {service.service}
                        </Title>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          {service.description}
                        </Text>
                      </div>
                    </Space>
                  </Col>

                  <Col>
                    <Space size={24} align="center">
                      <div style={{ textAlign: "right" }}>
                        <Text strong style={{ fontSize: "14px", color: "#666" }}>
                          Price:
                        </Text>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>{service.price}</div>
                      </div>

                      <Switch
                        checked={service.status}
                        onChange={(checked) => handleStatusChange(checked, service.service)}
                        style={{
                          backgroundColor: service.status ? "#52c41a" : undefined,
                        }} 
                      />

                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(service.service)}
                        style={{
                          color: "#ff8c00",
                          border: "none",
                          padding: "4px 8px",
                        }}
                      >
                        Edit
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default AvailableServices
