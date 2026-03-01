import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Home,
  FileText,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-white text-blue-600 font-semibold shadow-md"
        : "hover:bg-white/20"
    }`;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-8 py-3 flex justify-between items-center">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-2xl font-bold cursor-pointer"
        >
          <Briefcase size={28} />
          JobPortal
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">

          <NavLink to="/dashboard" className={navLinkClass}>
            <Home size={18} />
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass}>
            <Briefcase size={18} />
            Jobs
          </NavLink>

          <NavLink to="/myapplications" className={navLinkClass}>
            <FileText size={18} />
            Applications
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            <User size={18} />
            Profile
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">

          {/* Username */}
          <div className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold shadow-sm">
            👤 {username}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 shadow-md"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-3">

          <NavLink to="/" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Home size={18} />
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Briefcase size={18} />
            Jobs
          </NavLink>

          <NavLink to="/applications" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <FileText size={18} />
            Applications
          </NavLink>

          <NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <User size={18} />
            Profile
          </NavLink>

          <div className="pt-3 border-t border-white/30">
            <div className="mb-2 font-semibold">👤 {username}</div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg w-full"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;