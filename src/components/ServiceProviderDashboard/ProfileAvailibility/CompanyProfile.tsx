"use client"

import { Form, Input, Button, Upload, Card, Row, Col, Typography, message } from "antd"
import { UploadOutlined, InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { toast } from "sonner"

const { Title } = Typography
const { Dragger } = Upload

const orange = "#FA6400"

export default function CompanyProfileForm() {
  const [form] = Form.useForm()

  const uploadProps: UploadProps = {
    name: "logo",
    multiple: false,
    accept: ".jpeg,.jpg,.png,.csv", // Added .csv support
    beforeUpload: (file) => {
      const isImage = file.type === "image/jpeg" || file.type === "image/png"
      const isCSV = file.type === "text/csv" || file.name.endsWith(".csv")
      
      // Check for valid file type (either image or CSV)
      if (!isImage && !isCSV) {
        message.error("You can only upload JPEG/PNG images or CSV files!")
        return false
      }

      const isLt25M = file.size / 1024 / 1024 < 25
      if (!isLt25M) {
        message.error("File must be smaller than 25MB!")
        return false
      }
      
      return false // Prevent auto upload, handle manually
    },
    onChange(info) {
      const { status } = info.file
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  interface CompanyProfileFormValues {
    companyName: string
    contactPersonName: string
    businessEmail: string
    phoneNumber: string
  }

  const onFinish = async (values: CompanyProfileFormValues) => {
    try {
      console.log("Form values:", values)
   
      toast.success("Company profile updated successfully!")

    } catch {
      toast.error("Failed to update company profile. Please try again.")
    }
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <Card style={{ margin: "0 auto" }}>
        <Title level={3} style={{ marginBottom: 32, color: "#333", fontWeight: 600 }}>
          Company Profile Information
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            companyName: "Caribbean Logistics Ltd",
            contactPersonName: "John Smith",
            businessEmail: "jhon@cariblogistics.com",
            phoneNumber: "+1 (876) 555-0123",
          }}
        >
          <Row gutter={32}>
            {/* Left side - Form fields */}
            <Col xs={24} lg={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: true, message: "Please input company name!" }]}
              >
                <Input
                  size="large"
                  style={{
                    borderColor: orange,
                    borderRadius: 8,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = orange
                    e.target.style.boxShadow = `0 0 0 2px ${orange}20`
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Contact Person Name"
                name="contactPersonName"
                rules={[{ required: true, message: "Please input contact person name!" }]}
              >
                <Input
                  size="large"
                  style={{
                    borderColor: orange,
                    borderRadius: 8,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = orange
                    e.target.style.boxShadow = `0 0 0 2px ${orange}20`
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Business Email"
                name="businessEmail"
                rules={[
                  { required: true, message: "Please input business email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  size="large"
                  style={{
                    borderColor: orange,
                    borderRadius: 8,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = orange
                    e.target.style.boxShadow = `0 0 0 2px ${orange}20`
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: "Please input phone number!" }]}
              >
                <Input
                  size="large"
                  style={{
                    borderColor: orange,
                    borderRadius: 8,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = orange
                    e.target.style.boxShadow = `0 0 0 2px ${orange}20`
                  }}
                />
              </Form.Item>
            </Col>

            {/* Right side - Logo upload */}
            <Col xs={24} lg={12}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Dragger
                  {...uploadProps}
                  style={{
                    flex: 1,
                    border: `2px dashed ${orange}`,
                    borderRadius: 12,
                    backgroundColor: "#fafafa",
                    padding: "40px 20px",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <InboxOutlined style={{ fontSize: 24, color: "#999" }} />
                    </div>

                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#333",
                        marginBottom: 8,
                      }}
                    >
                      Drag and drop your company logo or CSV file here
                    </p>

                    <p
                      style={{
                        fontSize: 14,
                        color: "#999",
                        marginBottom: 20,
                      }}
                    >
                      Format: .jpeg, .png, .csv & Max file size: 25 MB
                    </p>

                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      size="large"
                      style={{
                        backgroundColor: orange,
                        borderColor: orange,
                        borderRadius: 8,
                        fontWeight: 500,
                        height: 44,
                        paddingLeft: 24,
                        paddingRight: 24,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#e55a00"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = orange
                      }}
                    >
                      Browse Files
                    </Button>
                  </div>
                </Dragger>
              </div>
            </Col>
          </Row>

          {/* Save button */}
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                backgroundColor: orange,
                borderColor: orange,
                borderRadius: 8,
                fontWeight: 500,
                height: 44,
                paddingLeft: 32,
                paddingRight: 32,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e55a00"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = orange
              }}
            >
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
