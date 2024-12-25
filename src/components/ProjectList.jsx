import { useState, useEffect } from "react";
import fetchApi from "../utils/api";
import { Table, Spin, message, Tag, Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";

import {
  getPriorityColor,
  capitalizeFirstLetter,
  getStatusColor,
} from "../utils/functions";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(process.env.REACT_APP_API_URL);
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
        <Tag color={getPriorityColor(priority)}>
          {priority ? capitalizeFirstLetter(priority) : "No Priority"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
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
          {/* Using icons for actions */}
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
