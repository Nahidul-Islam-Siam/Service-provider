"use client"

import {
  Timeline,
  Input,
  Button,
  Card,
  Tag,
  Spin,
  Empty,
} from "antd"
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TruckOutlined,
} from "@ant-design/icons"
import { useState } from "react"

import dayjs from "dayjs"
import { useGetTrackMyShipmentQuery } from "@/redux/features/commonApi/trackmyShipment/trackMyShipment"

export default function Component() {
  const [searchItem, setSearchItem] = useState("")
  const [query, setQuery] = useState("")

  const { data, isFetching, isSuccess } = useGetTrackMyShipmentQuery(query, {
    skip: !query,
  })

  const shipment = data?.data

  const handleTrack = () => {
    if (searchItem.trim()) {
      setQuery(searchItem.trim())
    }
  }

  const timelineItems = shipment
    ? [
        {
          dot: <CheckCircleOutlined className="text-orange-500" />,
          color: "orange",
          children: (
            <div>
              <div className="font-medium text-gray-900">Shipment Created</div>
              <div className="text-sm text-gray-500">
                {dayjs(shipment.createdAt).format("MMM D, YYYY, h:mm A")}
              </div>
              <div className="text-sm text-gray-600">
                Your shipment has been registered in our system
              </div>
            </div>
          ),
        },
        {
          dot: <CheckCircleOutlined className="text-orange-500" />,
          color: "orange",
          children: (
            <div>
              <div className="font-medium text-gray-900">Pickup Scheduled</div>
              <div className="text-sm text-gray-500">
                {dayjs(shipment.pickupDate).format("MMM D, YYYY, h:mm A")}
              </div>
              <div className="text-sm text-gray-600">
                Pickup from {shipment.originLocation?.city}, {shipment.originLocation?.country}
              </div>
            </div>
          ),
        },
        {
          dot: <CheckCircleOutlined className="text-orange-500" />,
          color: "orange",
          children: (
            <div>
              <div className="font-medium text-gray-900">In Transit</div>
              <div className="text-sm text-gray-500">
                En route to {shipment.destinationLocation?.country}
              </div>
            </div>
          ),
        },
        {
          dot: <ClockCircleOutlined className="text-gray-400" />,
          color: "gray",
          children: (
            <div>
              <div className="font-medium text-gray-400">Out for Delivery</div>
              <div className="text-sm text-gray-400">
                Expected: {dayjs(shipment.deliveryDate).format("MMM D, YYYY")}
              </div>
            </div>
          ),
        },
        {
          dot: <ClockCircleOutlined className="text-gray-400" />,
          color: "gray",
          children: (
            <div>
              <div className="font-medium text-gray-400">Delivered</div>
              <div className="text-sm text-gray-400">
                Expected: {dayjs(shipment.deliveryDate).format("MMM D, YYYY")}
              </div>
            </div>
          ),
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6 border-0 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment</h1>
            <p className="text-gray-600">
              Follow your live (s) journey from origin to destination.
            </p>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Tracking Number or Shipment ID
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter tracking number (e.g., SHIP-12667024)"
                className="flex-1"
                size="large"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
              <Button
                type="primary"
                size="large"
                onClick={handleTrack}
                className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 px-6"
              >
                Track Shipment
              </Button>
            </div>
            <div className="text-xs text-orange-600 mt-1">
              ⚠️ Tracking information is not updated in Real-time
            </div>
          </div>
        </Card>

        {isFetching ? (
          <Spin tip="Fetching Shipment..." className="w-full flex justify-center my-10" />
        ) : isSuccess && shipment ? (
          <>
            <Card className="mb-6 border-0 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">ID</div>
                  <div className="font-semibold">{shipment.shipmentID}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Origin</div>
                  <div className="font-semibold">
                    {shipment.originLocation?.city}, {shipment.originLocation?.country}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Destination</div>
                  <div className="font-semibold">
                    {shipment.destinationLocation?.city}, {shipment.destinationLocation?.country}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Status</div>
                  <div className="font-semibold">{shipment.status}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700">Expected Delivery</div>
                  <div className="font-semibold">
                    {dayjs(shipment.deliveryDate).format("MMM D, YYYY")}
                  </div>
                </div>
                <Tag color="green" className="px-3 py-1 capitalize">
                  {shipment.status.toLowerCase().replaceAll("_", " ")}
                </Tag>
              </div>
            </Card>

            <Card className="mb-6 border-0 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipment Status</h2>
              <Timeline items={timelineItems} />
            </Card>

            <Card className="border-0 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Shipping Team</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TruckOutlined className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Sender</div>
                    <div className="text-sm text-gray-600">{shipment.senderDetails?.name}</div>
                    <div className="text-sm text-blue-600">{shipment.senderDetails?.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Receiver</div>
                    <div className="text-sm text-gray-600">{shipment.receiverDetails?.name}</div>
                    <div className="text-sm text-green-600">{shipment.receiverDetails?.phone}</div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : query ? (
          <Empty className="my-10" description="Shipment not found or invalid ID" />
        ) : null}
      </div>
    </div>
  )
}
