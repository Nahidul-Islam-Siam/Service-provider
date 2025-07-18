"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  Menu,
  Badge,
  Avatar,
  Typography,
  List,
  Divider,
  Button,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import logo from "@/assets/logo/nav-logo.png";
import { useSelector } from "react-redux";

interface ForPcProps {
  isLoggedIn: boolean;
  role: string;
  pathname: string;
  onLogout: () => void;
  userName?: string;
}

const navLinks = [
  { href: "/", label: "Home" },
  // Conditionally add these based on `accessToken`
  { href: "/shipment-tracking", label: "Track a Shipment" },
  { href: "/my-shipments", label: "My Shipments" },
  { href: "/help-center", label: "Help" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/about-us", label: "About Us" },
];

const ForPc = ({ isLoggedIn, role, pathname, onLogout, userName }: ForPcProps) => {
  interface RootState {
    auth: {
      accessToken: string | null;
      // add other auth properties if needed
    };
    // add other slices if needed
  }

  const accessToken = useSelector((state: RootState) => state.auth.accessToken); // Get access token from Redux

  // Notifications for the user
  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from Sarah Wilson",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Avatar menu for logged-in users
  const avatarMenu = (
    <Menu className="w-56 bg-white">
 
      {accessToken && (
        <>
          <Menu.Item key="shipment-tracking">
            <Link href="/shipment-tracking">
              <Typography.Text strong>Track a Shipment</Typography.Text>
            </Link>
          </Menu.Item>
          <Menu.Item key="my-shipments">
            <Link href="/my-shipments">
              <Typography.Text strong>My Shipments</Typography.Text>
            </Link>
          </Menu.Item>
        </>
      )}
      {role === "ADMIN" ? (
        <Menu.Item key="admin">
          <Link href="/admin">
            <Typography.Text strong>Admin Dashboard</Typography.Text>
          </Link>
        </Menu.Item>
      ) : role === "SERVICE_PROVIDER" ? (
        <Menu.Item key="service_provider">
          <Link href="/dashboard">
            <Typography.Text strong>Service Provider Dashboard</Typography.Text>
          </Link>
        </Menu.Item>
      ) : (
        <Menu.Item key="user">
          <Link href="/user-dashboard">
            <Typography.Text strong>User Dashboard</Typography.Text>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="logout" className="text-red-600" onClick={onLogout}>
        <Typography.Text strong className="text-red-600">
          Log Out
        </Typography.Text>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  return (
    <div className="container hidden lg:flex py-3 items-center justify-between">
      <Link href={"/"} className="flex items-center">
        <Image
          src={logo}
          alt="Barrel.Link"
          width={100}
          height={100}
          className="rounded object-contain"
        />
      </Link>

      <div className="flex items-center gap-5 text-base text-[#808080]">
        <div className="flex gap-6 font-normal ps-3">
          {navLinks.map((link) => {
            // Conditionally render links based on `accessToken`
            if (
              (link.label === "Track a Shipment" || link.label === "My Shipments") &&
              !accessToken
            ) {
              return null; // Do not render these links if no access token
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  pathname === link.href
                    ? "text-[#FA8800] font-semibold"
                    : "text-[#808080]",
                  "hover:text-[#FA8800] transition-colors"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="notifications">
                <div className="w-80 bg-white rounded-md border-spacing-5 scrollbar shadow-md">
                  <div className="p-4 border-b">
                    <Typography.Text strong className="text-base">
                      Notifications
                    </Typography.Text>
                  </div>
                  <List
                    className="max-h-96 overflow-y-auto"
                    dataSource={notifications}
                    renderItem={(item) => (
                      <List.Item className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <List.Item.Meta
                          title={<Typography.Text>{item.title}</Typography.Text>}
                          description={<Typography.Text>{item.description}</Typography.Text>}
                        />
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <div className="p-3 text-center">
                    <Button type="link">View all notifications</Button>
                  </div>
                </div>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Badge count={unreadCount} size="small">
              <BellOutlined className="text-xl text-gray-700" />
            </Badge>
          </div>
        </Dropdown>

        {isLoggedIn ? (
          <Dropdown overlay={avatarMenu} trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              <Avatar src="https://i.pravatar.cc/150?img=3" />
              <Typography.Text className="ml-2">Hi, {userName}</Typography.Text>
            </div>
          </Dropdown>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <button className="border border-[#FA8800] hover:bg-[#FA8800] transition-all duration-300 ease-in-out hover:text-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-[#FA8800] text-white transition-all duration-300 ease-in-out hover:bg-white border border-[#FA8800] hover:text-[#FA8800] rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForPc;
