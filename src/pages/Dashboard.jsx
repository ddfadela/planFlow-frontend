import { Layout, Button, Drawer, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreAddOutlined,
  EditOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import fetchApi from "../utils/api";

const { Header, Content } = Layout;

const Dashboard = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleLogout = async () => {
    try {
      await fetchApi("/logout/", "POST");

      localStorage.removeItem("authToken");
      message.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
      message.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Layout className="h-screen">
      <Layout>
        <Header className="bg-blue-500 p-4 text-white flex justify-between items-center">
          <h1 className="text-xl">PlanFlow Dashboard</h1>
          <div className="hidden md:flex space-x-4">
            <Button
              type="text"
              icon={<AppstoreAddOutlined />}
              className="text-white hover:text-gray-200"
            >
              <Link to="/create-project">New Project</Link>
            </Button>
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-white hover:text-gray-200"
            >
              <Link to="/edit-projects">Edit Projects</Link>
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              className="text-white hover:text-gray-200"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="text-white md:hidden"
            onClick={showDrawer}
          />
        </Header>
        <Drawer
          title="PlanFlow"
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          className="md:hidden"
        >
          <Button
            type="text"
            className="w-full text-left flex items-center space-x-2"
          >
            <AppstoreAddOutlined />
            <Link to="/create-project">New Project</Link>
          </Button>
          <Button
            type="text"
            className="w-full text-left flex items-center space-x-2"
          >
            <EditOutlined />
            <Link to="/edit-projects">Edit Projects</Link>
          </Button>
          <Button
            type="text"
            className="w-full text-left flex items-center space-x-2"
            onClick={handleLogout}
          >
            <LogoutOutlined />
            Logout
          </Button>
        </Drawer>
        <Content className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
