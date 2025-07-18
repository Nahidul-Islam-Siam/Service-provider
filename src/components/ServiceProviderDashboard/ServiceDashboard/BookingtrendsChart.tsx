"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock hook - replace with your actual hook
const useGetProviderDashboardShipmentAnalyticsQuery = () => {
  // Mock data for demonstration
  const mockData = {
    success: true,
    data: {
      allShipmentTrend: {
        dailyShipmentList: [15000, 8000, 12000, 18000, 25000, 22000, 28000],
      },
    },
  };
  return { data: mockData };
};

interface BookingTrendsChartProps {
  chartData?: { month: string; value: number }[];
}

const BookingTrendsChart: React.FC<BookingTrendsChartProps> = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7days");
  const { data } = useGetProviderDashboardShipmentAnalyticsQuery();
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>([]);

 
  useEffect(() => {
    if (data && data.success && data.data && data.data.allShipmentTrend) {
      const { dailyShipmentList } = data.data.allShipmentTrend;

   
      let timeLabels: string[] = [];
      if (selectedPeriod === "7days") {
        timeLabels = ["S", "M", "T", "W", "T", "F", "S"];
      } else if (selectedPeriod === "30days") {
        timeLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      } else {
        timeLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      }

      // Only update the state if the data has actually changed
      const processedData = dailyShipmentList.slice(0, timeLabels.length).map((value: number, index: number) => ({
        month: timeLabels[index] || "Unknown",
        value: value,
      }));


      setChartData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(processedData)) {
          return processedData;
        }
        return prevData;
      });
    }
  }, [data, selectedPeriod]);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
  };

  const chartConfig = {
    value: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Booking Trends</CardTitle>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="value"
              type="monotone"
              fill="var(--color-value)"
              fillOpacity={0.2}
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--chart-2))",
                stroke: "var(--color-value)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--chart-2))",
                stroke: "var(--color-value)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BookingTrendsChart;
