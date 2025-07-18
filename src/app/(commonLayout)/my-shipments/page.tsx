"use client";

import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useRouter } from "next/navigation";
import "@/components/Styles/shipments.css";
import UpCommingShipments from "@/components/Tabs/UpcomingShipments";
import AllShipments from "@/components/Tabs/AllShipments";
import PastShipments from "@/components/Tabs/PastShipments";
import Cookies from "js-cookie";

const { TabPane } = Tabs;

const Page = () => {
  const [current, setCurrent] = useState("1");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    // console.log("🚀 ~ token:", token);

    if (!token) {
      router.push("/login"); // Redirect to login if token not found
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Don't render the page until auth is confirmed
  if (isAuthenticated === null) return null;

  const handleTabChange = (key: string) => {
    setCurrent(key);
  };

  return (
    <div className="container">
      <div className="mt-6">
        <h1 className="md:text-3xl font-bold text-gray-900 mb-2">
          Shipping Label
        </h1>
        <p className="text-gray-600">
          Your label has been generated and is ready for download.
        </p>
      </div>
      <div className="my-4 pt-5 pb-5" style={{ overflowX: "auto" }}>
        <Tabs
          activeKey={current}
          onChange={handleTabChange}
          size="middle"
          className="tabs-container"
        >
          <TabPane tab="Upcoming Shipments" key="1">
            <UpCommingShipments />
          </TabPane>
          <TabPane tab="Past Shipments" key="2">
            <PastShipments />
          </TabPane>
          <TabPane tab="All Shipments" key="3">
            <AllShipments />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
