/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import type React from "react";
import { Cell, Pie, PieChart } from "recharts";
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
import { useGetShipmentAnalyticsPieQuery } from "@/redux/features/admin/DasboardApi/DashboardApi";


interface ProviderPerformanceChartProps {
  providerData?: { name: string; value: number; color: string }[];
}

// Custom Legend component
const CustomLegend: React.FC<{
  data: { name: string; value: number; color: string }[];
}> = ({ data }) => (
  <div className="flex flex-col gap-2">
    {data.map((entry, index) => (
      <div key={`legend-item-${index}`} className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-xs text-gray-600">{entry.name}</span>
        <span className="text-xs text-gray-500 ml-auto">{entry.value}%</span>
      </div>
    ))}
  </div>
);

const ProviderPerformanceChart: React.FC<ProviderPerformanceChartProps> = () => {
  const { data: pieData, isLoading } = useGetShipmentAnalyticsPieQuery();

  console.log("API Data:", pieData?.data);

  // Transform API data to chart format
  const transformApiData = () => {
    const providerPerformanceArray = pieData?.data?.providerPerformance;

    if (!providerPerformanceArray) return [];

    const colors = [
      "#8B4513",
      "#FF8C00",
      "#87CEEB",
      "#4169E1",
      "#32CD32",
      "#FF6347",
      "#9370DB",
      "#20B2AA",
      "#F4A460",
      "#DA70D6",
    ];

    return providerPerformanceArray.map((provider: any, index: number) => ({
      name: provider.providerName,
      value: provider.providerPerformance,
      color: colors[index % colors.length],
    }));
  };

  const chartData = transformApiData();

  const chartConfig = chartData.reduce((config: any, item: any, index: any) => {
    config[`provider${index}`] = {
      label: item.name,
      color: item.color,
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[280px]">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[280px]">
        <div className="text-sm text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <Select defaultValue="top5">
          <SelectTrigger className="w-20 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top5">Top 5</SelectItem>
            <SelectItem value="top10">Top 10</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-xs text-gray-500 mb-4">This Week</div>

      <div className="flex items-center justify-center gap-8">
        <ChartContainer config={chartConfig} className="h-[280px] w-[60%]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex-shrink-0">
          <CustomLegend data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default ProviderPerformanceChart;
