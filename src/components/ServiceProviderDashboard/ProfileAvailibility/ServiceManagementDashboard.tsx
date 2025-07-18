'use client';
import React from "react"
import { Row, Col } from "antd";
import CompanyProfile from "@/components/ServiceProviderDashboard/ProfileAvailibility/CompanyProfile";
import AvailableServices from "@/components/ServiceProviderDashboard/ProfileAvailibility/AvailableServices";
import ServiceRegions from "@/components/ServiceProviderDashboard/ProfileAvailibility/ServiceRegions";
import ServiceDiscussion from "@/components/ServiceProviderDashboard/ProfileAvailibility/ServiceDiscussion";
import ServiceAvailability from "@/components/ServiceProviderDashboard/ProfileAvailibility/ServiceAvailability";
import UploadComplianceDocuments from "@/components/ServiceProviderDashboard/ProfileAvailibility/UploadComplianceDocuments";

const ServiceManagementDashboard: React.FC = () => {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", margin: "0 auto", padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <CompanyProfile />
        </Col>
        <Col span={24}>
          <AvailableServices />
        </Col> 
        <Col span={24}>
          <ServiceRegions />
        </Col>
        <Col span={24}>
          <ServiceDiscussion />
        </Col>
        <Col span={24}>
          <ServiceAvailability />
        </Col>
        <Col span={24}>
          <UploadComplianceDocuments />
        </Col>
      </Row>
    </div>
  );
};

export default ServiceManagementDashboard;
