import React from "react";
import { Card, Statistic } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

interface StatsCardProps {
  title: string;
  value: number;
  prefixIcon: React.ReactNode;
  percentage: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, prefixIcon, percentage }) => (
  <Card>
    <Statistic
      title={title}
      value={value}
      prefix={prefixIcon}
      suffix={
        <div style={{ fontSize: "14px", marginTop: "8px" }}>
          <ArrowUpOutlined style={{ color: "#52c41a" }} />
          <span style={{ color: "#52c41a", marginLeft: "4px" }}>{percentage}%</span>
          <span style={{ color: "rgba(0,0,0,0.45)", marginLeft: "4px" }}>vs last month</span>
        </div>
      }
    />
  </Card>
);

export default StatsCard;
