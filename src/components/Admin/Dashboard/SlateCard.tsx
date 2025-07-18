// components/StatCard.tsx
import React from "react";
import { ArrowUpIcon } from "lucide-react";


interface StatCardProps {
  title: string;
  value: string | number;
  percentageChange: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentageChange, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-green-500 flex items-center">
          <ArrowUpIcon className="h-3 w-3 mr-1" /> {percentageChange}
        </p>
      </div>
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
