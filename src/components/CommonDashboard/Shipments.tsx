/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Pagination,
  Spin,
} from "antd"
import {
  FilterOutlined,
  InboxOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import type { Moment } from "moment"
import ShipmentsTable from "@/components/Admin/Dashboard/ShipmentTable"

import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
dayjs.extend(isBetween)

import { useGetAllShipmentsQuery } from "@/redux/features/shipmentApi/shipmentApi"

const { RangePicker } = DatePicker

interface SearchValues {
  providerName?: string
  customerAccount?: string
  status?: string
  zipCode?: string
  dateRange?: [Moment, Moment]
}

export default function ShipmentManagement() {
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<SearchValues>({})

  const { data, refetch, isLoading } = useGetAllShipmentsQuery(undefined)

  const convertStatus = (status: string): any => {
    switch (status) {
      case "AWAITING_PICKUP":
        return "pending"
      case "IN_TRANSIT":
        return "in-transit"
      case "DELIVERED":
        return "delivered"
      case "FAILED":
        return "failed"
      default:
        return "pending"
    }
  }

  const filteredData = useMemo(() => {
    const allData = data?.data?.data || []

    return allData
      .filter((item: any) => {
        const matchProvider = filters.providerName
          ? item.providerName.toLowerCase().includes(filters.providerName.toLowerCase())
          : true
        const matchCustomer = filters.customerAccount
          ? item.userName.toLowerCase().includes(filters.customerAccount.toLowerCase())
          : true
        const matchStatus =
          filters.status && filters.status !== "all"
            ? item.status.toLowerCase() === filters.status
            : true
        const matchZip = filters.zipCode
          ? item?.address?.zipcode === filters.zipCode
          : true

        const matchDate =
          filters.dateRange && filters.dateRange.length === 2
            ? dayjs(item.pickupDate).isBetween(
                dayjs(filters.dateRange[0]?.toDate()),
                dayjs(filters.dateRange[1]?.toDate()),
                "day",
                "[]"
              )
            : true

        return matchProvider && matchCustomer && matchStatus && matchZip && matchDate
      })
      .map((item: any, index: number) => ({
        key: index.toString(),
        id: item.shipmentID,
        customer: item.userName,
        provider: item.providerName,
        status: convertStatus(item.status),
     zipCode: item?.address ? `${item?.address.city}, ${item?.address.zipcode}` : "N/A",
        pickupDate: dayjs(item.pickupDate).format("YYYY-MM-DD"),
        estDelivery: dayjs(item.deliveryDate).format("YYYY-MM-DD"),
      }))
  }, [data, filters])

  const handleSearch = (values: SearchValues) => {
    setFilters(values)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    form.resetFields()
    setFilters({})
    refetch()
  }

  return (
    <Spin spinning={isLoading} tip="Loading Shipments..." size="large">
      <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Filter Shipments */}
        <Card
          title={
            <Space>
              <FilterOutlined style={{ color: "#fa8c16" }} /> Filter Shipments
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            initialValues={{ status: "all" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                alignItems: "end",
              }}
            >
              <Form.Item label="Provider Name" name="providerName">
                <Input placeholder="Provider" />
              </Form.Item>
              <Form.Item label="Customer Account" name="customerAccount">
                <Input placeholder="Customer" />
              </Form.Item>
              <Form.Item label="Status" name="status">
                <Select placeholder="All">
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="in-transit">In Transit</Select.Option>
                  <Select.Option value="delivered">Delivered</Select.Option>
                  <Select.Option value="failed">Failed</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Zip Code" name="zipCode">
                <Input placeholder="Zip Code" />
              </Form.Item>
              <Form.Item label="Date Range" name="dateRange">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#fa8c16",
                    borderColor: "#fa8c16",
                    width: "100%",
                  }}
                >
                  Search
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>

        {/* Table Section */}
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Space>
                <InboxOutlined style={{ color: "#fa8c16" }} />
                Ongoing Shipments
              </Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ color: "#8c8c8c" }}
                type="text"
              >
                Refresh
              </Button>
            </div>
          }
        >
          <ShipmentsTable shipmentsData={filteredData} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <span style={{ color: "#8c8c8c" }}>
              Showing {(currentPage - 1) * 5 + 1}-
              {Math.min(currentPage * 5, filteredData.length)} of {filteredData.length}
            </span>
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={5}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </Card>
      </div>
    </Spin>
  )
}
