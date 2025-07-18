'use client';

import React from "react";
import { useGetMeQuery } from "@/redux/features/user";
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,

  LogoutOutlined,

} from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Badge, List, Typography, Divider, Button } from "antd";

import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const Header = () => {
  const { data, isLoading, isError } = useGetMeQuery();
  const dispatch = useDispatch();
  const router = useRouter();
  
    const handleLogout = () => {
      dispatch(logout());
      router.push("/");
   
    };


  // Check if data is available
  const user = data?.data;

  if (isLoading) {
    return <div>Loading...</div>; // Handle loading state when the data is not yet available
  }

  if (isError || !user) {
    return <div>Error: Unable to fetch user data.</div>; // Handle error if data is not available
  }

  // Avatar dropdown menu
  const avatarMenu = (
    <Menu className="w-56">
 

   
<Menu.Item key="logout" icon={<LogoutOutlined />} className="text-red-600" onClick={handleLogout}>
  <Text strong className="text-red-600">
    Log Out
  </Text>
</Menu.Item>

    </Menu>
  );

  // Notification data
  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from Sarah Wilson",
      time: "2 minutes ago",
      type: "message",
      icon: <UserOutlined className="text-blue-500" />,
      unread: true,
    },
    // Other notifications...
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Notification dropdown content
  const notificationContent = (
    <div className="w-80 bg-white rounded shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <Text strong className="text-base">
          Notifications
        </Text>
        <Button type="link" size="small" className="p-0">
          Mark all as read
        </Button>
      </div>
      <List
        className="max-h-96 overflow-y-auto"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${item.unread ? "bg-blue-50" : ""}`}
          >
            <List.Item.Meta
              avatar={item.icon}
              title={
                <div className="flex items-center justify-between">
                  <Text strong={item.unread} className={item.unread ? "text-gray-900" : "text-gray-600"}>
                    {item.title}
                  </Text>
                  {item.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              }
              description={
                <div>
                  <Text type="secondary" className="text-sm">
                    {item.description}
                  </Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {item.time}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Divider className="m-0" />
      <div className="p-3 text-center">
        <Button type="link" className="p-0">
          View all notifications
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm roboto">
      <div>
        <h2 className="text-xl font-semibold text-[#2F394D] mb-1 md:text-2xl">
          Welcome Back, {user.name}!
        </h2>
        <Text type="secondary">{user.email}</Text>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Dropdown */}
        <Dropdown
          overlay={notificationContent}
          trigger={["click"]}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <div className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Badge count={unreadCount} size="small">
              <BellOutlined className="text-xl text-gray-700" />
            </Badge>
          </div>
        </Dropdown>

        {/* Avatar Dropdown */}
        <Dropdown overlay={avatarMenu} trigger={["click"]} placement="bottomRight" arrow={{ pointAtCenter: true }}>
          <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar src={user.image || "https://i.pravatar.cc/150?img=3"} size="large" className="border-2 border-gray-200" />
            <div className="flex flex-col leading-tight">
              <Text strong className="text-gray-800">
                {user.name}
              </Text>
              <Text type="secondary" className="text-sm">
                {user.role}
              </Text>
            </div>
            <DownOutlined className="text-gray-500 text-xs" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
