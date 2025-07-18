"use client";

import Header from "@/components/shared/Header/Header";
import { logout } from "@/redux/features/auth";
import {
  DashboardOutlined,
  TruckOutlined,
  TeamOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

const { Sider, Content } = Layout;

const ServiceProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutClicked, setLogoutClicked] = useState(false);

    const dispatch = useDispatch();

  const menuItems = [ 
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboards",
    },
    {
      key: "/dashboard/shipments",
      icon: <TruckOutlined />,
      label: "Shipments",
    },
    {
      key: "/dashboard/profile-&-availability",
      icon: <TeamOutlined />,
      label: "Profile & Availability",
    },
    {
      key: "/dashboard/reviews",
      icon: <StarOutlined />,
      label: "Reviews",
    },
    {
      key: "/dashboard/notification",
      icon: <BellOutlined/>,
      label: "Notification",
    },
    {
      key: "/dashboard/setting",
      icon: <SettingOutlined />,
      label: "Setting",
    },
  ];

    const handleLogout = () => {
        dispatch(logout());
        router.push("/");
     
      };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      setLogoutClicked(true);
      setTimeout(() => {
        setLogoutClicked(false);
        console.log("User logged out");
      }, 1000);
    } else {
      router.push(key);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{
          background: "#fff",
          boxShadow: "2px 0 5px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Logo and Toggle */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ height: 64 }}
        >
          {!collapsed && (
             <Link href="/">
         <button className="text-xl font-bold text-[#092c4c]">
              Barrel<span className="text-orange-500">Link</span>
            </button>
        </Link>
          )}
          <span
            className="text-orange-500 text-xl cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            »
          </span>
        </div>

        {/* Menu - Scrollable */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Menu
            mode="inline"
            selectedKeys={[pathname ?? ""]}
            onClick={handleMenuClick}
            style={{
              borderRight: 0,
              paddingTop: 12,
              fontSize: 15,
              fontWeight: 500,
            }}
            items={menuItems}
            rootClassName="custom-menu"
          />
        </div>

        {/* Logout Button */}
        <div className="p-4 absolute bottom-10">
          <div
            onClick={handleLogout}
            className={`flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600 font-medium text-[15px] ${
              logoutClicked ? "animate-ping" : ""
            }`}
          >
            <LogoutOutlined />
            {!collapsed && <span>Log out</span>}
          </div>
        </div>
      </Sider>

      <Layout className="">
        <Header />
        <Content
          style={{
            margin: 0,
            height: "calc(100vh - 64px)", // header is 64px
            overflowY: "auto",
            padding: 24,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ServiceProviderLayout;
