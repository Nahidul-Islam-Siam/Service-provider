/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetShipmentTrendsQuery } from "@/redux/features/admin/DasboardApi/DashboardApi";

const ShipmentTrendsChart: React.FC = () => {
  const { data: shipmentAnalytics } = useGetShipmentTrendsQuery();

  console.log("shipmentAnalytics", shipmentAnalytics);

  if (!shipmentAnalytics || !shipmentAnalytics.data?.allShipmentTrend) {
    return (
      <div className="flex items-center justify-center h-[280px]">Loading...</div>
    );
  }

  const dailyShipmentList =
    shipmentAnalytics.data.allShipmentTrend.dailyShipmentList;
  const dailyIncomeList =
    shipmentAnalytics.data.allShipmentTrend.dailyIncomeList;

  if (!Array.isArray(dailyShipmentList) || !Array.isArray(dailyIncomeList)) {
    return (
      <div className="flex items-center justify-center h-[280px]">
        Data is unavailable
      </div>
    );
  }

  const chartData = dailyShipmentList.map((value, index) => ({
    day: ["S", "M", "T", "W", "T", "F", "S"][index],
    shipments: value,
    income: dailyIncomeList[index],
  }));

  const chartConfig = {
    shipments: {
      label: "Shipments",
      color: "#FF8C00",
    },
    income: {
      label: "Income",
      color: "#000000",
    },
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Shipment Trends</h3>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            left: 12,
            right: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12, fill: "#666" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12, fill: "#666" }}
            tickFormatter={(value) => `${value / 1000}K`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="shipments"
            type="monotone"
            stroke="var(--color-shipments)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-shipments)",
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
          <Line
            dataKey="income"
            type="monotone"
            stroke="var(--color-income)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{
              fill: "var(--color-income)",
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ShipmentTrendsChart;
