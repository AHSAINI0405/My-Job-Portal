import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
  { path: "/company/dashboard", label: "Dashboard" },
  { path: "/company/jobs", label: "My Jobs" },
  { path: "/company/applicants", label: "Applicants" },
];

const CompanySidebar = () => {
  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-64 min-h-screen bg-indigo-900 text-white p-5"
    >
      <h2 className="text-xl font-bold mb-8 text-center">Company Panel</h2>

      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-indigo-600" : "hover:bg-indigo-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default CompanySidebar;
