import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

interface StatisticCardProps {
  title: string;
  value: number;
  prefixIcon: React.ReactNode;
  percentageChange: number;
  color?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  prefixIcon,
  percentageChange,
  color = '#52c41a',
}) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={prefixIcon}
        suffix={
          <span style={{ fontSize: '12px', color }}>
            <ArrowUpOutlined /> {percentageChange}%
          </span>
        }
      />
    </Card>
  );
};

export default StatisticCard;
