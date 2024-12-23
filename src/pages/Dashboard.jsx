import { Layout, Button, Drawer } from "antd";
import { Link } from "react-router-dom";
import {
  AppstoreAddOutlined,
  EditOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Header, Content } = Layout;

const Dashboard = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
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
            >
              <Link to="/logout">Logout</Link>
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
            className="block w-full text-left flex items-center space-x-2"
          >
            <AppstoreAddOutlined />
            <Link to="/create-project">New Project</Link>
          </Button>
          <Button
            type="text"
            className="block w-full text-left flex items-center space-x-2"
          >
            <EditOutlined />
            <Link to="/edit-projects">Edit Projects</Link>
          </Button>
          <Button
            type="text"
            className="block w-full text-left flex items-center space-x-2"
          >
            <LogoutOutlined />
            <Link to="/logout">Logout</Link>
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
