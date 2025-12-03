import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoleCreation from "./pages/admin/RoleCreation";
import AdminVisitorForm from "./pages/admin/VisitorForm";
import AdminVisitorDetails from "./pages/admin/VisitorDetails";
import SecurityVisitorIn from "./pages/security/VisitorIn";
import SecurityVisitorOut from "./pages/security/VisitorOut";
import SecurityReport from "./pages/security/Report";
import ManagerVisitorForm from "./pages/manager/VisitorForm";
import ManagerVisitorList from "./pages/manager/VisitorList";
import ProtectedRoute from "./components/routing/ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/role-creation"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <RoleCreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/visitor-form"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminVisitorForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/visitor-details"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminVisitorDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security/visitor-in"
        element={
          <ProtectedRoute allowedRoles={["security"]}>
            <SecurityVisitorIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security/visitor-out"
        element={
          <ProtectedRoute allowedRoles={["security"]}>
            <SecurityVisitorOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security/report"
        element={
          <ProtectedRoute allowedRoles={["security"]}>
            <SecurityReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/visitor-form"
        element={
          <ProtectedRoute allowedRoles={["manager", "hr"]}>
            <ManagerVisitorForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/visitor-list"
        element={
          <ProtectedRoute allowedRoles={["manager", "hr"]}>
            <ManagerVisitorList />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
