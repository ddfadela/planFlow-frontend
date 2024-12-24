import { Form, Input, Button, message, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchApi from "../utils/api";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await fetchApi("/register/", "POST", {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      message.success("Registration successful!");

      navigate("/login");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Register
      </h2>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          label={<span className="text-gray-700">Username</span>}
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-700">Email</span>}
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-700">Password</span>}
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-10 bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? <Spin className="mr-2" /> : null}
            Register
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Button
            type="link"
            onClick={() => navigate("/login")}
            className="p-0 h-auto"
          >
            Login here
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
