"use client";

import { useMemo, useState } from "react";
import {
  Card,
  DatePicker,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Typography,
  Pagination,
  message,
  Spin,
} from "antd";
import {
  FileTextOutlined,
  ExportOutlined,
  InboxOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useGetShipmentLogsQuery } from "@/redux/features/admin/shipingLogApi/ShipingLogApi";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;

interface ShipmentLogData {
  key: string;
  userName: string;
  action: string;
  orderId: string;
  timeStample: string;
}

interface ApiLog {
  userName: string;
  action: string;
  orderId: string;
  timeStample: string;
}

export default function LogsMonitoring() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const { data, error, isLoading, isFetching, refetch } = useGetShipmentLogsQuery({
    page: currentPage,
    limit: pageSize,
  });

  if (error) {
    message.error("Failed to load shipment logs.");
  }

  const originalLogs: ApiLog[] = useMemo(() => data?.data?.shippingUserLog || [], [data]);

  const filteredLogs: ShipmentLogData[] = useMemo(() => {
    return originalLogs
      .filter((log) => {
        const matchesSearch = log.orderId
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());

        const logDate = dayjs(log.timeStample);
        const isAfterStart = fromDate ? logDate.isAfter(fromDate, "day") || logDate.isSame(fromDate, "day") : true;
        const isBeforeEnd = toDate ? logDate.isBefore(toDate, "day") || logDate.isSame(toDate, "day") : true;

        return matchesSearch && isAfterStart && isBeforeEnd;
      })
      .map((log, index) => ({
        key: `${log.orderId}-${index}`,
        userName: log.userName,
        action: log.action,
        orderId: log.orderId,
        timeStample: log.timeStample,
      }));
  }, [originalLogs, searchTerm, fromDate, toDate]);

  const columns: ColumnsType<ShipmentLogData> = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => (
        <Tag color="#fa8c16" style={{ borderRadius: 4, fontWeight: 600, textTransform: "capitalize" }}>
          {action}
        </Tag>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Timestamp",
      dataIndex: "timeStample",
      key: "timeStample",
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  const handleExportAll = () => {
    if (!filteredLogs.length) {
      message.warning("No data to export.");
      return;
    }

    const csvHeaders = ["User Name", "Action", "Order ID", "Timestamp"];
    const csvRows = filteredLogs.map((log) => [
      log.userName,
      log.action,
      log.orderId,
      new Date(log.timeStample).toLocaleString(),
    ]);

    const csvContent = [csvHeaders, ...csvRows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shipment_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success("CSV export successful!");
  };

  const handleFilter = () => {
    setCurrentPage(1);
  };

  const isLoadingOverlay = isLoading || isFetching;

  return (
    <div style={{ padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card style={{ position: "relative" }}>
        {/* Overlay spinner */}
        {isLoadingOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
            }}
          >
            <Spin size="large" tip="Loading shipment logs..." />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <FileTextOutlined style={{ color: "#fa8c16" }} />
              Logs & Monitoring
            </Title>
            <Text type="secondary" style={{ fontSize: 14, marginTop: 4, display: "block" }}>
              View and filter shipment logs for full auditability and transparency.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExportAll}
            style={{
              backgroundColor: "#fa8c16",
              borderColor: "#fa8c16",
            }}
          >
            Export All (CSV)
          </Button>
        </div>

        {/* Filter Section */}
        <Space
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <DatePicker placeholder="From (mm/dd/yyyy)" style={{ minWidth: 140 }} onChange={(date) => setFromDate(date)} />
          <DatePicker placeholder="To (mm/dd/yyyy)" style={{ minWidth: 140 }} onChange={(date) => setToDate(date)} />
          <Search
            placeholder="Search order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 200, flex: 1 }}
            enterButton={false}
          />
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={handleFilter}
            style={{
              backgroundColor: "#fa8c16",
              borderColor: "#fa8c16",
            }}
          >
            Filter
          </Button>
          <Button
            icon={<InboxOutlined />}
            onClick={() => refetch()}
            style={{ borderColor: "#fa8c16", color: "#fa8c16" }}
            loading={isFetching}
          >
            Refresh
          </Button>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredLogs}
          loading={false} // Disable AntD table spinner to avoid double spinner with overlay
          pagination={false}
          size="middle"
          style={{ marginBottom: 16 }}
          rowKey={(record) => record.key}
        />

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text type="secondary">
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length}
          </Text>
          <Pagination
            current={currentPage}
            total={filteredLogs.length}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
}
