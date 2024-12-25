import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import DashboardLayout from "../src/layouts/DashboardLayout"; // Import the new layout
import Dashboard from "../src/pages/Dashboard";
import CreateProject from "../src/pages/CreateProject";
import UpdateProject from "../src/pages/UpdateProject";
import { PrivateRoute, PublicRoute } from "./components/ProtectedRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route
              path="/update-project/:projectId"
              element={<UpdateProject />}
            />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
