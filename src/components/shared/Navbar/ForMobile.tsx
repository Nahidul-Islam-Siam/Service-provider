"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Drawer, Dropdown, Menu, Avatar, Typography } from "antd";
import { IoMenu } from "react-icons/io5";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import logo from "@/assets/logo/nav-logo.png";

interface ForMobileProps {
  isLoggedIn: boolean;
  role: string;
  pathname: string;
  onLogout: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pack-barrel", label: "Pack a Barrel" },
  { href: "/my-shipments", label: "Current Shipment" },
  { href: "/help-center", label: "Help" },
];

const ForMobile = ({ isLoggedIn, role, pathname,onLogout }: ForMobileProps) => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const Logout = () => {
    onLogout();
    // TODO: Replace with actual logout logic
    console.log("Logging out...");
  };

  const avatarMenu = (
    <Menu className="w-56">
 
      <Menu.Item key="track">
        <Link href="/shipment-tracking">
          <Typography.Text strong>Track a Shipment</Typography.Text>
        </Link>
      </Menu.Item>
      <Menu.Item key="shipments">
        <Link href="/my-shipments">
          <Typography.Text strong>My Shipments</Typography.Text>
        </Link>
      </Menu.Item>
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
      <Menu.Divider />
      <Menu.Item key="logout" onClick={Logout}  >
        <Typography.Text strong className="text-red-600">
          Log Out
        </Typography.Text>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center px-3 lg:hidden h-16 shadow-md bg-white z-999">
      <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          width={100}
          height={100}
          className="rounded object-contain"
        />
      </Link>

      <button onClick={showDrawer} className="p-1">
        <IoMenu size={25} />
      </button>

      <Drawer
        title={
          <div className="flex justify-center">

             <button onClick={onClose} className="text-gray-500 hover:text-black absolute top-2 right-2">
        <CloseOutlined className="text-lg"  />
      </button>
            <Image
              src={logo}
              alt="Logo"
              width={120}
              height={120}
              className="rounded object-contain"
            />
          </div>
        }
        placement="left"
        width="80%"
        open={open}
        onClose={onClose}
        closeIcon={false}
      >
        <div className="h-full flex flex-col justify-between items-start">
          <div className="w-full" onClick={onClose}>
            <div className="flex flex-col gap-6 font-normal ps-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    pathname === link.href
                      ? "text-[#FA8800] font-semibold"
                      : "text-gray-700",
                    "hover:text-[#FA8800] transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full px-4 mb-6">
            {isLoggedIn ? (
              <Dropdown overlay={avatarMenu} trigger={["click"]}>
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar
                    src="https://i.pravatar.cc/150?img=3"
                    size="large"
                    className="border-2 border-gray-200"
                  />
                  <div className="flex flex-col leading-tight">
                    <Typography.Text strong className="text-gray-800">
                      {role === "ADMIN"
                        ? "Admin"
                        : role === "SERVICE_PROVIDER"
                        ? "Service Provider"
                        : "User"}
                    </Typography.Text>
                  </div>
                  <DownOutlined className="text-gray-500 text-xs" />
                </div>
              </Dropdown>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <Link href="/login">
                  <button className="border border-[#FA8800] hover:bg-[#FA8800] transition-all duration-300 ease-in-out hover:text-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base w-full">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-[#FA8800] text-white transition-all duration-300 ease-in-out hover:bg-white border border-[#FA8800] hover:text-[#FA8800] rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base w-full">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ForMobile;
