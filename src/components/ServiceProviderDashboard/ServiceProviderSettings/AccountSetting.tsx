'use client';
import React from "react";
import { Card, Row, Col, Typography } from "antd";

import AccountInfoForm from "@/components/ServiceProviderDashboard/ServiceProviderSettings/AccountInfoForm";
import PasswordForm from "@/components/ServiceProviderDashboard/ServiceProviderSettings/PasswordForm";


const { Title } = Typography;



const AccountSettings: React.FC = () => {



  
    // const handlePasswordUpdate = (values: PasswordFormValues) => {
    //   console.log("Password values:", values);
    //   message.success("Password updated successfully!");
    // };

  // interface PromoCodeFormValues {
   
  //   promoCode: string;

  // }

  // const handlePromoUpdate = (values: PromoCodeFormValues) => {
  //   console.log("Promo values:", values);
  //   message.success("Promo code changes updated successfully!");
  // };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Account Information */}
      <Card style={{ marginBottom: "24px" }}>
        <Title level={4} style={{ marginBottom: "24px" }}>
          Account Information
        </Title>
        <AccountInfoForm  />
      </Card>

      {/* Password Management and Promo Code Management */}
      <Row gutter={24}>
        <Col span={12}>
          <Card>
            <Title level={4} style={{ marginBottom: "24px" }}>
              Password Management
            </Title>
            <PasswordForm  />
          </Card>
        </Col>

        {/* <Col span={12}>
          <Card>
            <Title level={4} style={{ marginBottom: "24px" }}>
              Promo Code Management
            </Title>
            <PromoCodeForm />
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default AccountSettings;
