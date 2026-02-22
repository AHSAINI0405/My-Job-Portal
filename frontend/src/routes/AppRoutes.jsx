import {Routes, Route} from "react-router-dom";
import Home  from "../components/pages/Home"
import Login  from "../components/pages/Login"
import Register from "../components/pages/Register"
import DashboardUser from "../components/pages/DashboardUser";
import CompanyDashboard from "../components/pages/CompanyDashboard";
import CompanyProfile from "../components/company/CompanyProfile";
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
        </Routes>
        </>
    )
}
export default AppRoutes;