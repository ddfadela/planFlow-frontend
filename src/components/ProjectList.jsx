import { useState, useEffect } from "react";
import fetchApi from "../utils/api";
import { Card, Col, Row, Spin, message } from "antd";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {projects.map((project) => (
        <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
          <Card hoverable title={project.title}>
            <p>{project.description}</p>{" "}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProjectList;
