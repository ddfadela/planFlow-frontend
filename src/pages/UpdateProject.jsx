import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import fetchApi from "../utils/api";
import moment from "moment";
import ProjectForm from "../components/ProjectForm ";

const UpdateProject = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetchApi(
          `/projects/${projectId}/detail/`,
          "GET"
        );
        const project = response;

        // Set form fields
        form.setFieldsValue({
          title: project.title,
          description: project.description,
          start_date: moment(project.start_date, "YYYY-MM-DD"),
          end_date: moment(project.end_date, "YYYY-MM-DD"),
          priority: project.priority,
          status: project.status,
          category: project.category,
        });

        // Set file lists for images with proper preview URLs
        if (project.images && project.images.length > 0) {
          if (project.images[0]?.image) {
            setFileList1([
              {
                uid: project.images[0].id.toString(),
                name: project.images[0].image.split("/").pop(),
                status: "done",
                url: `${process.env.REACT_APP_API_URL}${project.images[0].image}`,
                thumbUrl: `${process.env.REACT_APP_API_URL}${project.images[0].image}`, // Add thumbUrl for preview
              },
            ]);
          }

          if (project.images[1]?.image) {
            setFileList2([
              {
                uid: project.images[1].id.toString(),
                name: project.images[1].image.split("/").pop(),
                status: "done",
                url: `${process.env.REACT_APP_API_URL}${project.images[1].image}`,
                thumbUrl: `${process.env.REACT_APP_API_URL}${project.images[1].image}`, // Add thumbUrl for preview
              },
            ]);
          }
        }
      } catch (error) {
        message.error("Failed to load project data");
      }
    };

    fetchProjectData();
  }, [projectId, form]);

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

      // Only append images that have been newly added
      if (fileList1.length > 0 && fileList1[0].originFileObj) {
        formData.append("image1", fileList1[0].originFileObj);
      }
      if (fileList2.length > 0 && fileList2[0].originFileObj) {
        formData.append("image2", fileList2[0].originFileObj);
      }

      await fetchApi(`/projects/${projectId}/update/`, "PUT", formData, true);
      message.success("Project updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message || "Failed to update project");
    }
  };

  const handleFileChange = (info, setFileList) => {
    let fileList = [...info.fileList];

    // Limit to one file
    fileList = fileList.slice(-1);

    // Check file size
    if (
      fileList[0] &&
      fileList[0].originFileObj &&
      fileList[0].originFileObj.size > 5 * 1024 * 1024
    ) {
      message.error("Image must be smaller than 5MB");
      return;
    }

    // Update file list with preview
    fileList = fileList.map((file) => {
      if (file.originFileObj) {
        return {
          ...file,
          url: URL.createObjectURL(file.originFileObj),
          thumbUrl: URL.createObjectURL(file.originFileObj),
        };
      }
      return file;
    });

    setFileList(fileList);
  };
  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    listType: "picture-card", // Show as card with preview
    maxCount: 1, // Only allow one file
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
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
      submitButtonText="Update Project"
      isUpdate={true}
    />
  );
};

export default UpdateProject;
