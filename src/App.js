import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import Dashboard from "../src/pages/Dashboard";
import CreateProject from "../src/pages/CreateProject";

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
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/create-project" element={<CreateProject />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
