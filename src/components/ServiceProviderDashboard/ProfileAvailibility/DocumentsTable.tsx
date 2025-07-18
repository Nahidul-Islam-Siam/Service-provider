import React from "react";
import { Table, Button, Tag, Upload, message, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const orange = "#FA6400";

interface DocumentData {
  key: string;
  document: string;
  status: string;
  statusColor: string;
  expiryDate: string;
}

interface DocumentsTableProps {
  data: DocumentData[];
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ data }) => {
  const documentsColumns = [
    {
      title: "Document Type",
      key: "document",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: DocumentData) => <Tag color={record.statusColor}>{status}</Tag>,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Button style={{ backgroundColor: orange, color: "#fff" }} size="small" icon={<UploadOutlined />}>
          Upload
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table columns={documentsColumns} dataSource={data} pagination={false} size="middle" />
      <Divider />
      <Upload.Dragger
        name="files"
        multiple
        action="/upload"
        onChange={(info) => {
          const { status } = info.file;
          if (status === "done") message.success(`${info.file.name} uploaded successfully.`);
          else if (status === "error") message.error(`${info.file.name} upload failed.`);
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for PDF, DOC, DOCX, JPG, PNG</p>
      </Upload.Dragger>
    </>
  );
};

export default DocumentsTable;
