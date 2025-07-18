"use client";

import Header from "@/components/shared/Header/Header";
import {
  DashboardOutlined,
  TruckOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth";


const { Sider, Content } = Layout;

const AdminSidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);




    // ADMIN
    // SERVICE_PROVIDER
    // USER


 
  
   const dispatch = useDispatch();
  
    const handleLogout = () => {
      dispatch(logout());
      router.push("/");
   
    };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboards",
    },
    {
      key: "/admin/shipments",
      icon: <TruckOutlined />,
      label: "Shipments",
      roles: ["admin"],
    },
    {
      key: "/admin/service-providers",
      icon: <TeamOutlined />,
      label: "Service Providers",
      roles: ["admin"],
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/admin/logs",
      icon: <FileTextOutlined />,
      label: "Logs",
    },
    {
      key: "/admin/payment",
      icon: <CreditCardOutlined />,
      label: "Payment",
    },
    {
      key: "/admin/reviews",
      icon: <StarOutlined />,
      label: "Reviews",
    },
    {
      key: "/admin/setting",
      icon: <SettingOutlined />,
      label: "Setting",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      console.log("User logged out");
      // Add logout logic here
    } else {
      router.push(key);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
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
        }}
      >
   
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
            className="text-[#FA8800] text-xl cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            »
          </span>
        </div>

        {/* Menu */}
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

        {/* Logout Button */}
        <div className="p-4  absolute bottom-10">
          <div
          
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600 font-medium text-[15px]"
          >
            <LogoutOutlined />
            {!collapsed && <span>Log out</span>}
          </div>
        </div>
      </Sider>

      <Layout>
        <Header />
        <Content
          style={{
            margin: 0,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            padding: 0,
            background: "#ffffff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSidebarLayout;
