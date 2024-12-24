import { Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fetchApi from "../utils/api";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetchApi("/login/", "POST", {
        username: values.username,
        password: values.password,
      });
      message.success("Login successful!");
      localStorage.setItem("authToken", response.token);
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        LogIn
      </h2>

      <Form
        name="login"
        onFinish={onFinish}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Log in
          </Button>
        </Form.Item>

        <Form.Item>
          <Typography.Text>
            Don't have an account?{" "}
            <Button
              type="link"
              onClick={() => navigate("/register")}
              className="p-0 h-auto"
            >
              Register here
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
