import { useState } from "react";
import { Button, Input, Form, Select, DatePicker, message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import fetchApi from "../utils/api";
import moment from "moment";

const { Option } = Select;

const CreateProject = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "start_date" || key === "end_date") {
          formData.append(key, moment(values[key]).format("YYYY-MM-DD"));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Add image files if they exist
      if (fileList1.length > 0 && fileList1[0].originFileObj) {
        formData.append("image1", fileList1[0].originFileObj);
      }
      if (fileList2.length > 0 && fileList2[0].originFileObj) {
        formData.append("image2", fileList2[0].originFileObj);
      }
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value instanceof File ? value.name : value;
      });

      console.log(formDataObject);
      const response = await fetchApi(
        "/projects/create/",
        "POST",
        formDataObject
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      message.success("Project created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      message.error("Failed to create project. Please try again.");
    }
  };
  // Handle file list updates
  const handleFileChange1 = ({ fileList }) => {
    setFileList1(fileList);
  };

  const handleFileChange2 = ({ fileList }) => {
    setFileList2(fileList);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          priority: "LOW",
          status: "NOT_STARTED",
        }}
      >
        {/* Previous form items remain the same */}
        <Form.Item
          name="title"
          label="Project Title"
          rules={[
            { required: true, message: "Please enter the project title" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter a project description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="start_date"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="end_date"
          label="End Date"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[
            { required: true, message: "Please select the project priority" },
          ]}
        >
          <Select>
            <Option value="LOW">Low</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="HIGH">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[
            { required: true, message: "Please enter the project category" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[
            { required: true, message: "Please select the project status" },
          ]}
        >
          <Select>
            <Option value="NOT_STARTED">Not Started</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Form.Item>

        {/* Updated Upload components */}
        <Form.Item label="Project Images">
          <Form.Item name="image1">
            <Upload
              fileList={fileList1}
              onChange={handleFileChange1}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
            >
              <Button>Upload Image 1</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="image2">
            <Upload
              fileList={fileList2}
              onChange={handleFileChange2}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
            >
              <Button>Upload Image 2</Button>
            </Upload>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Project
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProject;
