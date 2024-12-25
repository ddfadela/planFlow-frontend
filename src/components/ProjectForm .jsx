// ProjectForm.js
import { Form, Input, DatePicker, Select, Upload, Button, message } from "antd";
import { PROJECT_STATUS, PROJECT_PRIORITY } from "../utils/functions";
const { Option } = Select;

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
  const handleFileChange = (info, setFileList) => {
    let fileList = [...info.fileList];
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
                  fileList={fileList1}
                  onChange={({ fileList }) =>
                    handleFileChange(fileList, setFileList1)
                  }
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                >
                  <Button>Upload Image 1</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="image2">
                <Upload
                  fileList={fileList2}
                  onChange={({ fileList }) =>
                    handleFileChange(fileList, setFileList2)
                  }
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                >
                  <Button>Upload Image 2</Button>
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
