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
import FindJobs from "../components/pages/FindJobs";
import Companies from "../components/pages/Companies";
const AppRoutes = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* ================= NOT LOGGED IN ================= */}
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/find-jobs" element={<FindJobs/>}/>
          <Route path="/companies" element={<Companies/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          {/* Block login/register */}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />

          {/* ================= USER ROLE ================= */}
          {user.role === "user" && (
            <>
              {!user.profileCompleted ? (
                <>
                  <Route path="/profile" element={<UserProfile />} />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/profile"
                        state={{
                          message:
                            "Please complete your profile before accessing other sections.",
                        }}
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Route path="/dashboard" element={<DashboardUser />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/jobs" element={<ActiveJobs />} />
                  <Route path="/myapplications" element={<MyApplications />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              )}
            </>
          )}

          {/* ================= COMPANY ROLE ================= */}
          {user.role === "company" && (
            <>
              {!user.profileCompleted ? (
                <>
                  <Route path="/employer/profile" element={<CompanyProfile />} />
                  <Route
                    path="*"
                    element={<Navigate to="/employer/profile" state={{
                          message:
                            "Please complete your profile before accessing other sections.",
                        }}/> }
                  />
                </>
              ) : (
                <>
                  <Route
                    path="/employer/dashboard"
                    element={<CompanyDashboard />}
                  />
                  <Route
                    path="/employer/createjob"
                    element={<CreateJob />}
                  />
                  <Route
                    path="/employer/applications"
                    element={<EmployerApplications />}
                  />
                  <Route
                    path="/employer/manage-jobs"
                    element={<EmployerManageJobs />}
                  />
                  <Route
                    path="/company/jobs/:jobId/applicants"
                    element={<JobApplicants />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/employer/dashboard" />}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;