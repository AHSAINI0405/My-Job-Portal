import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import api from "../api/axios";
const CompanyNavbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyData,setData]=useState({
    name:"",
    logo:"ABC"
    })
  useEffect(() => {
    const storedCompany = JSON.parse(localStorage.getItem("company"));
    setCompany(storedCompany);
  }, []);

  useEffect(()=>{
    fetchCompany();
  },[]);
  const fetchCompany=async () =>{
    try{
      const res=await api.get("/api/profile/company");
      console.log(res);
      setData(res.data);
    }
    catch(error)
    {
      console.log(error);
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("company");
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-white text-purple-600 font-semibold shadow-md"
        : "hover:bg-white/20"
    }`;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-8 py-3 flex justify-between items-center">

        {/* Logo + Brand */}
        <div
          onClick={() => navigate("/employer/dashboard")}
          className="flex items-center gap-3 text-2xl font-bold cursor-pointer"
        >
          {/* Company Logo */}
          {company?.logo ? (
            <img
              src={company.logo}
              alt="Company Logo"
              className="w-10 h-10 object-cover rounded-lg border border-white"
            />
          ) : (
            <div className="w-10 h-10 bg-white text-purple-600 flex items-center justify-center rounded-lg font-bold shadow">
              {company?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
          )}

          <span>CompanyPanel</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">

          <NavLink to="/employer/dashboard" className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/employer/createjob" className={linkClass}>
            <Briefcase size={18} />
            Post Job
          </NavLink>

          <NavLink to="/employer/manage-jobs" className={linkClass}>
            <FileText size={18} />
            Manage Jobs
          </NavLink>

          <NavLink to="/employer/applications" className={linkClass}>
            <Users size={18} />
            Applications
          </NavLink>

          <NavLink to="/employer/profile" className={linkClass}>
            <Building2 size={18} />
            Profile
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <div className="bg-white text-purple-600 px-4 py-1 rounded-full font-semibold shadow flex items-center gap-2">
             {companyData?.name || "Company"}
             <img src={companyData.logo} alt="logo" className="w-15 h-15"/>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-purple-700 px-6 py-4 space-y-3">
          <NavLink to="/employer/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/employer/post-job" className={linkClass} onClick={() => setOpen(false)}>Post Job</NavLink>
          <NavLink to="/employer/manage-jobs" className={linkClass} onClick={() => setOpen(false)}>Manage Jobs</NavLink>
          <NavLink to="/employer/applications" className={linkClass} onClick={() => setOpen(false)}>Applications</NavLink>
          <NavLink to="/employer/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>

          <div className="pt-3 border-t border-white/30">
            <div className="mb-2 font-semibold flex items-center gap-2">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt="Company Logo"
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-white text-purple-600 flex items-center justify-center rounded font-bold">
                  {company?.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}
              {company?.name || "Company"}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;