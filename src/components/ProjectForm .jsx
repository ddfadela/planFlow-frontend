import {
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  message,
  Spin,
} from "antd";
import { PROJECT_STATUS, PROJECT_PRIORITY } from "../utils/functions";
import { useState } from "react";
const { Option } = Select;
const { TextArea } = Input;

const ProjectForm = ({
  form,
  initialValues,
  onSubmit,
  fileList1,
  fileList2,
  setFileList1,
  setFileList2,
  submitButtonText,
  isUpdate = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  const handleFileChange = (info, setFileList) => {
    let fileList = Array.isArray(info.fileList) ? [...info.fileList] : [];
    fileList = fileList.slice(-1);

    if (
      fileList[0] &&
      fileList[0].originFileObj &&
      fileList[0].originFileObj.size > 5 * 1024 * 1024
    ) {
      message.error("Image must be smaller than 5MB");
      return;
    }

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

  const generateDescription = async () => {
    const projectTitle = form.getFieldValue("title");
    if (!projectTitle) {
      message.warning("Please enter a project title first");
      return;
    }

    setIsGenerating(true);
    try {
      const api_key = process.env.REACT_APP_HUGGING_FACE_API_KEY;
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-large",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${api_key}`,
          },
          body: JSON.stringify({
            inputs: `Write a clear and professional project description for a project called "${projectTitle}". 
                  Include the main goal, key features, and expected outcomes. 
                  Keep it concise but informative.`,
            parameters: {
              max_length: 200,
              min_length: 50,
              do_sample: true,
              temperature: 0.8,
              top_p: 0.9,
            },
          }),
        }
      );

      const data = await response.json();

      if (data[0]?.generated_text) {
        setGeneratedDescription(data[0].generated_text);
        form.setFieldsValue({ description: data[0].generated_text });
        message.success("Description generated successfully!");
      } else {
        throw new Error("Failed to generate description");
      }
    } catch (error) {
      console.error("Error generating description:", error);
      message.error(
        "Failed to generate description. Please try again or enter manually."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    listType: "picture-card",
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isUpdate ? "Update Project" : "Create New Project"}
      </h2>
      <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
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
          label={
            <div className="flex items-center justify-between w-full">
              <span>Description</span>
              <Button
                type="default"
                onClick={generateDescription}
                disabled={isGenerating}
                className="ml-2"
              >
                {isGenerating ? (
                  <Spin size="small" />
                ) : (
                  "Generate AI Description"
                )}
              </Button>
            </div>
          }
          rules={[
            { required: true, message: "Please enter a project description" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Enter description manually or generate one using AI"
          />
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
            {Object.values(PROJECT_PRIORITY).map((priority) => (
              <Option key={priority.value} value={priority.value}>
                {priority.label}
              </Option>
            ))}
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
            {Object.values(PROJECT_STATUS).map((status) => (
              <Option key={status.value} value={status.value}>
                {status.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Project Images">
          {isUpdate ? (
            <>
              <Upload
                {...uploadProps}
                fileList={fileList1}
                onChange={(info) => handleFileChange(info, setFileList1)}
              >
                {fileList1.length === 0 && <div>Upload Image 1</div>}
              </Upload>

              <Upload
                {...uploadProps}
                fileList={fileList2}
                onChange={(info) => handleFileChange(info, setFileList2)}
              >
                {fileList2.length === 0 && <div>Upload Image 2</div>}
              </Upload>
            </>
          ) : (
            <>
              <Form.Item name="image1">
                <Upload
                  {...uploadProps}
                  fileList={fileList1}
                  onChange={(info) => handleFileChange(info, setFileList1)}
                >
                  <div>Upload Image 1</div>
                </Upload>
              </Form.Item>
              <Form.Item name="image2">
                <Upload
                  {...uploadProps}
                  fileList={fileList2}
                  onChange={(info) => handleFileChange(info, setFileList2)}
                >
                  <div>Upload Image 2</div>
                </Upload>
              </Form.Item>
            </>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {submitButtonText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectForm;
