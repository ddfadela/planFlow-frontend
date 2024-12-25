import { useState, useEffect } from "react";
import fetchApi from "../utils/api";
import { Table, Spin, message, Tag, Button, Popconfirm, Tooltip } from "antd";
import { Link } from "react-router-dom";

import {
  getPriorityColor,
  capitalizeFirstLetter,
  getStatusColor,
} from "../utils/functions";
import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetchApi("/projects/", "GET");
        setProjects(response);
      } catch (error) {
        message.error("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      const response = await fetchApi(
        `/projects/${projectId}/delete/`,
        "DELETE"
      );
      if (response.status === 204) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        message.success("Project deleted successfully");
      }
    } catch (error) {
      message.error("Failed to delete the project.");
    }
  };
  const handleExport = async (projectId) => {
    try {
      const response = await fetchApi(
        `/projects/${projectId}/export-pdf/`,
        "GET"
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate PDF: ${response.status} ${response.statusText}`
        );
      }

      // Read the blob only once
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Received empty PDF data");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project_${projectId}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      message.success("PDF downloaded successfully!");
    } catch (error) {
      // Improved error handling with more specific messages
      let errorMessage = "Failed to download PDF";
      if (error.message.includes("empty PDF data")) {
        errorMessage = "The generated PDF is empty. Please try again.";
      } else if (error.message.includes("Failed to generate PDF")) {
        errorMessage = `Server error: ${error.message}`;
      }

      message.error(errorMessage);
      console.error("PDF Export Error:", error);
    }
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images.length > 0 ? (
          <img
            src={`${process.env.REACT_APP_API_URL}${images[0].image}`}
            alt="project"
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed #d9d9d9",
              color: "#aaa",
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) =>
        description ? truncateText(description, 50) : "No Description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={getPriorityColor(priority)} className="font-bold">
          {priority ? capitalizeFirstLetter(priority) : "No Priority"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} className="font-bold">
          {status ? capitalizeFirstLetter(status) : "No Status"}
        </Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Link to={`/update-project/${record.id}`}>
            <EditOutlined style={{ fontSize: "20px", color: "inherit" }} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this project?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>

          {/* Export Icon (New Action) */}
          <Tooltip title="Export the PDF">
            <Button
              type="link"
              icon={<ExportOutlined />}
              onClick={() => handleExport(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center over">
        <Spin size="large" />
      </div>
    );
  }

  return <Table dataSource={projects} columns={columns} rowKey="id" />;
};

export default ProjectList;
