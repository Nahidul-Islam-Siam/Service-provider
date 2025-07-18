import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  InputNumber,
  TimePicker,
  Input,
  Select,
  
} from "antd"
import {
  ClockCircleOutlined,
  ReloadOutlined,
  CheckOutlined,
  CopyOutlined,
} from "@ant-design/icons"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import {
  useCreateAvailabilityMutation,
  useGetAllAvailibilityQuery,
} from "@/redux/features/provider/CalenderApi/availibility"
import { useGetMeQuery } from "@/redux/features/user"
import { toast } from "sonner"

const { Title, Text } = Typography
const { TextArea } = Input

interface AvailabilityEntry {
  fromDate: string
  toDate: string
  fromTime: string
  toTime: string
  description: string
  status: "Available" | "blocked" | "partially_availble"
  barrelCapacity: number
  hourseAvailabe: number
  
}

interface AvailabilityData {
  [date: string]: AvailabilityEntry[]
}

const ServiceAvailability: React.FC = () => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null)
  const [toDate, setToDate] = useState<Dayjs | null>(null)
  const [fromTime, setFromTime] = useState<Dayjs | null>(null)
  const [toTime, setToTime] = useState<Dayjs | null>(null)
  const [barrels, setBarrels] = useState<number>(1)
  const [description, setDescription] = useState<string>("")
  const [status, setStatus] = useState<"Available" | "blocked" | "partially_availble">("Available")
  const [isBottomVisible, setIsBottomVisible] = useState<boolean>(false)
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({})

  const { data, refetch } = useGetAllAvailibilityQuery()
  const { data: user } = useGetMeQuery()
  const sProviderId = user?.data?.id
  const [createAvailability] = useCreateAvailabilityMutation()

  useEffect(() => {
    if (data?.data) {
      const mapped: AvailabilityData = {}
      const entries = Array.isArray(data.data) ? data.data : []
      entries.forEach((entry) => {
        const start = dayjs(entry.fromDate)
        const end = dayjs(entry.toDate)
        const rangeDays = end.diff(start, "day")

        for (let i = 0; i <= rangeDays; i++) {
          const currentDate = start.add(i, "day").format("YYYY-MM-DD")
          if (!mapped[currentDate]) mapped[currentDate] = []

          mapped[currentDate].push({
            fromDate: entry.fromDate,
            toDate: entry.toDate,
            fromTime: entry.fromTime,
            toTime: entry.toTime,
            description: entry.description,
            status: entry.status as "Available" | "blocked" | "partially_availble",
            barrelCapacity: entry.barrelCapacity,
            hourseAvailabe: entry.hourseAvailabe,
          })
        }
      })
      setAvailabilityData(mapped)
    }
  }, [data])

  const getDateStatus = (date: Dayjs): "Available" | "blocked" | "partially_availble" | undefined => {
    const entries = availabilityData[date.format("YYYY-MM-DD")]
    if (!entries || entries.length === 0) return undefined

    if (entries.some((e) => e.status === "blocked")) return "blocked"
    if (entries.some((e) => e.status === "partially_availble")) return "partially_availble"
    if (entries.some((e) => e.status === "Available")) return "Available"

    return undefined
  }

  const dateCellRender = (date: Dayjs) => {
    const status = getDateStatus(date)
    if (!status) return null

    const statusColors: Record<string, string> = {
      Available: "#52c41a",
      blocked: "#ff4d4f",
      partially_availble: "#faad14",
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: statusColors[status],
          borderRadius: "4px",
          opacity: 0.6,
        }}
      />
    )
  }

  const handleDateSelect = (date: Dayjs) => {
    if (!fromDate) {
      setFromDate(date)
      toast.info("Now select the second date (toDate)")
    } else if (!toDate) {
      if (date.isBefore(fromDate, "day")) {
        setFromDate(date)
        toast.info("fromDate updated. Now pick the toDate")
      } else {
        setToDate(date)
        setIsBottomVisible(true)
      }
    } else {
      setFromDate(date)
      setToDate(null)
      setIsBottomVisible(false)
      toast.info("Selection reset. Pick your toDate again.")
    }
  }

  const handleSave = async () => {
    if (!fromDate || !toDate || !fromTime || !toTime) {
      toast.warning("Please select fromDate, toDate, and time range.")
      return
    }

    const newEntry: AvailabilityEntry = {
      fromDate: fromDate.startOf("day").toISOString(),
      toDate: toDate.endOf("day").toISOString(),
      fromTime: fromTime.format("HH:mm"),
      toTime: toTime.format("HH:mm"),
      description,
      status,
      barrelCapacity: barrels,
      hourseAvailabe: toTime.diff(fromTime, "hour", true),
    }

    if (!sProviderId) {
      toast.error("Service provider ID not found.")
      return
    }

    const payload = {
      sProviderId,
      Availability: [newEntry],
    }

    try {
      const res = await createAvailability(payload).unwrap()
      toast.success(res?.message || "Availability added!")
      refetch()

      setFromDate(null)
      setToDate(null)
      setFromTime(null)
      setToTime(null)
      setDescription("")
      setStatus("Available")
      setBarrels(1)
      setIsBottomVisible(false)
    } catch  {
      toast.error("Failed to save availability.")
    }
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: 24 }}>
      <div>
        <Title level={2}>Service Availability</Title>
        <Text type="secondary">Manage your service dates, blocked periods, and barrel capacity.</Text>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={6}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Card className="flex md:flex-col flex-row" title="Legend" size="small">
                <div className="flex md:flex-col flex-row gap-2">
                  <LegendItem color="#52c41a" label="Available" />
                  <LegendItem color="#ff4d4f" label="Blocked" />
                  <LegendItem color="#faad14" label="Partial" />
                </div>
              </Card>
              <Card title="Quick Actions" size="small">
                <div className="flex md:flex-col gap-2 md:items-start ">
                  <Button type="text" icon={<ClockCircleOutlined />}>Set Regular Hours</Button>
                  <Button type="text" icon={<ReloadOutlined />} onClick={() => setAvailabilityData({})}>Reset Calendar</Button>
                  <Button type="text" icon={<CopyOutlined />}>Copy Schedule</Button>
                </div>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={18}>
            <Card>
              <Calendar
                onSelect={handleDateSelect}
                dateCellRender={dateCellRender}
              />
            </Card>
          </Col>
        </Row>

        {isBottomVisible && (
          <Card style={{ marginTop: 32 }}>
            <Title level={4}>
              Set Availability from {fromDate?.format("YYYY-MM-DD") || "?"} to {toDate?.format("YYYY-MM-DD") || "?"}
            </Title>
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <TimeRangePicker fromTime={fromTime} toTime={toTime} setFromTime={setFromTime} setToTime={setToTime} />
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Description"
              />
              <Select value={status} onChange={(val) => setStatus(val)} style={{ width: "100%" }}>
                <Select.Option value="Available">Available</Select.Option>
                <Select.Option value="blocked">Blocked</Select.Option>
                <Select.Option value="partially_availble">Partial</Select.Option>
              </Select>
              <InputNumber
                value={barrels}
                onChange={(val) => setBarrels(val || 1)}
                min={1}
                max={100}
                style={{ width: "100%" }}
              />
              <Text strong>
                Available Hours: {fromTime && toTime ? `${toTime.diff(fromTime, "hour", true).toFixed(1)}` : "N/A"}
              </Text>
              <Button type="primary" icon={<CheckOutlined />} onClick={handleSave}>
                Save Availability
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </div>
  )
}

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <Space>
    <div
      style={{
        width: 20,
        height: 20,
        backgroundColor: color,
        borderRadius: 4,
        display: "inline-block",
      }}
    />
    <Text>{label}</Text>
  </Space>
)

interface TimeRangePickerProps {
  fromTime: Dayjs | null
  toTime: Dayjs | null
  setFromTime: (time: Dayjs | null) => void
  setToTime: (time: Dayjs | null) => void
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ fromTime, toTime, setFromTime, setToTime }) => (
  <Space>
    <TimePicker
      value={fromTime}
      onChange={setFromTime}
      format="HH:mm"
      placeholder="From"
      style={{ width: 120 }}
    />
    <TimePicker
      value={toTime}
      onChange={setToTime}
      format="HH:mm"
      placeholder="To"
      style={{ width: 120 }}
    />
  </Space>
)

export default ServiceAvailability
