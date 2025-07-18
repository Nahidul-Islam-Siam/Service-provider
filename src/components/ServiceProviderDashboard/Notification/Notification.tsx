import React from "react";

import SendNotification from "@/components/ServiceProviderDashboard/Notification/SendNotification";
import NotificationTable from "@/components/ServiceProviderDashboard/Notification/NotificationTable";



const NotificationManagement = () => {
  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
  <SendNotification 
   
  />
      <NotificationTable  />
    </div>
  );
};

export default NotificationManagement;
