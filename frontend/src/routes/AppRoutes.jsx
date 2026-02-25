import {Routes, Route} from "react-router-dom";
import Home  from "../components/pages/Home"
import Login  from "../components/pages/Login"
import Register from "../components/pages/Register"
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
const AppRoutes = () =>{
    const user=JSON.parse(localStorage.getItem("user"));
    return(
        <>
        
        
        <Routes>
            
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/dashboard" element={<DashboardUser />}/>
            <Route path="/employer/dashboard" element={<CompanyDashboard/>}/>
            <Route path="/employer/profile" element={<CompanyProfile/>}/>
            <Route path="/employer/createjob" element={<CreateJob />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/jobs" element={<ActiveJobs/>}/>
            <Route path="/company/jobs/:jobId/applicants" element={<JobApplicants/>}/>
            <Route path="/myapplications" element={<MyApplications/>}/>
            <Route path="/employer/applications" element={<EmployerApplications/>}/>
            <Route path="/employer/manage-jobs" element={<EmployerManageJobs/>}/>
        </Routes>
        </>
    )
}
export default AppRoutes;