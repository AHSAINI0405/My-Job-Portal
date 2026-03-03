import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import DashboardUser from "../components/pages/DashboardUser";
import CompanyDashboard from "../components/pages/CompanyDashboard";
import CompanyProfile from "../components/company/CompanyProfile";
import CreateJob from "../components/pages/CreateJob";
import UserProfile from "../components/pages/UserProfile";
import ActiveJobs from "../components/pages/ActiveJobs";
import JobApplicants from "../components/pages/JobApplicants";
import MyApplications from "../components/pages/MyApplications";
import EmployerApplications from "../components/pages/EmployerApplications";
import EmployerManageJobs from "../components/pages/EmployerManageJobs";
import ForgotPassword from "../components/pages/ForgotPassword";
const AppRoutes = () => {

  // ✅ Safe parsing
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Routes>

      {/* Public Route */}
      <Route path="/" element={<Home />} />

      {/* If NOT logged in → Only allow Home, Login, Register */}
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          {/* Block all other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          {/* If logged in → Block login/register */}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
            
          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardUser />} />
          <Route path="/employer/dashboard" element={<CompanyDashboard />} />
          <Route path="/employer/profile" element={<CompanyProfile />} />
          <Route path="/employer/createjob" element={<CreateJob />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/jobs" element={<ActiveJobs />} />
          <Route path="/company/jobs/:jobId/applicants" element={<JobApplicants />} />
          <Route path="/myapplications" element={<MyApplications />} />
          <Route path="/employer/applications" element={<EmployerApplications />} />
          <Route path="/employer/manage-jobs" element={<EmployerManageJobs />} />

          {/* Unknown route redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

    </Routes>
  );
};

export default AppRoutes;