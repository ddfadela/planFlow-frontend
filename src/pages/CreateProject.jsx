import { useState } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import fetchApi from "../utils/api";
import moment from "moment";
import ProjectForm from "../components/ProjectForm ";

const CreateProject = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append form values
      Object.keys(values).forEach((key) => {
        if (key === "start_date" || key === "end_date") {
          formData.append(key, moment(values[key]).format("YYYY-MM-DD"));
        } else if (
          key !== "image1" &&
          key !== "image2" &&
          values[key] != null
        ) {
          formData.append(key, values[key]);
        }
      });

      // Append images
      if (fileList1.length > 0 && fileList1[0].originFileObj) {
        formData.append("image1", fileList1[0].originFileObj);
      }
      if (fileList2.length > 0 && fileList2[0].originFileObj) {
        formData.append("image2", fileList2[0].originFileObj);
      }

      await fetchApi("/projects/create/", "POST", formData, true);
      message.success("Project created successfully!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message || "Failed to create project");
    }
  };

  const handleFileChange = (fileList, setFileList) => {
    const newFile = fileList[0];
    if (newFile && newFile.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB");
      return;
    }
    setFileList(fileList);
  };

  return (
    <ProjectForm
      form={form}
      initialValues={{
        priority: "LOW",
        status: "NOT_STARTED",
      }}
      onSubmit={handleSubmit}
      fileList1={fileList1}
      fileList2={fileList2}
      setFileList1={setFileList1}
      setFileList2={setFileList2}
      submitButtonText="Create Project"
      isUpdate={false}
    />
  );
};

export default CreateProject;
