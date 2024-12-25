import { useState, useEffect } from "react";
import fetchApi from "../utils/api";
import { Table, Spin, message, Tag } from "antd";
import {
  getPriorityColor,
  capitalizeFirstLetter,
  getStatusColor,
} from "../utils/functions";

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

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images.length > 0 ? (
          <img
            src={images[0].image}
            alt="project"
            style={{ width: 100, height: 100, objectFit: "cover" }}
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
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return <Table dataSource={projects} columns={columns} rowKey="id" />;
};

export default ProjectList;
