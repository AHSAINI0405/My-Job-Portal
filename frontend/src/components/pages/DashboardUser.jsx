import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
import { ReceiptText } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { NavLink } from "react-router-dom";

const DashboardUser = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchApplications();
  }, []);
useEffect(() => {
  if (selectedApp) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}, [selectedApp]);
  const fetchApplications = async () => {
    const res = await api.get("/api/applications/me");
    setApplications(res.data);
  };

  // ===== Counts =====

  const applied = applications.length;

  const shortlisted = applications.filter(
    (a) => a.status === "shortlisted"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "rejected"
  ).length;

  const pending = applications.filter(
    (a) => a.status === "applied"
  ).length;

  // ===== Chart data =====

  const data = [
    { name: "Applied", value: applied },
    { name: "Shortlisted", value: shortlisted },
    { name: "Rejected", value: rejected },
    { name: "Pending", value: pending },
  ];

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#ef4444",
    "#f59e0b",
  ];

  return (
    <>
      <Navbar username={user?.name} />

      <div className="flex min-h-screen bg-gray-100">

        {/* ================= SIDEBAR ================= */}

        <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-xl p-5">

  <div className="text-center">

  
    <h2 className="mt-3 font-bold text-lg">
      {user?.name}
    </h2>

    <p className="text-sm text-indigo-200">
      {user?.email}
    </p>

  </div>

  <hr className="my-5 border-indigo-400" />

 <div className="space-y-2 bg-indigo-600 p-3 rounded-xl">

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg font-semibold transition 
          ${
            isActive
              ? "bg-white text-indigo-700"
              : "text-white hover:bg-indigo-700"
          }`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/myapplications"
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg transition 
          ${
            isActive
              ? "bg-white text-indigo-700"
              : "text-white hover:bg-indigo-700"
          }`
        }
      >
        My Applications
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg transition 
          ${
            isActive
              ? "bg-white text-indigo-700"
              : "text-white hover:bg-indigo-700"
          }`
        }
      >
        Profile
      </NavLink>

    </div>
</div>

        {/* ================= MAIN ================= */}

        <div className="flex-1 p-6">

          <h1 className="text-2xl font-bold mb-5">
            Dashboard
          </h1>

          {/* ===== Stats ===== */}

          <div className="grid grid-cols-4 gap-4 mb-6">

            <StatCard
              title="Applied"
              value={applied}
              color="bg-indigo-500"
            />

            <StatCard
              title="Shortlisted"
              value={shortlisted}
              color="bg-green-500"
            />

            <StatCard
              title="Rejected"
              value={rejected}
              color="bg-red-500"
            />

            <StatCard
              title="Pending"
              value={pending}
              color="bg-yellow-500"
            />

          </div>

          {/* ===== Chart ===== */}

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-6">

  <h2 className="font-semibold mb-3 text-lg">
    Applications Overview
  </h2>

            <PieChart width={420} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>

          </div>

          {/* ===== Applications list ===== */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-4">
              Recent Applications
            </h2>

            {applications.map((app) => (
              <div
  key={app._id}
  className="border border-gray-200 p-5 rounded-xl mb-3 shadow hover:shadow-lg transition bg-white"
>
                <h3 className="font-bold">
                  {app.job?.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {app.job?.description}
                </p>

                <p className="text-sm">
                  Status: {app.status}
                </p>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="flex gap-2 mt-2 bg-violet-500 text-white px-3 py-1 rounded hover:bg-violet-600"
                >
                  <ReceiptText size={18} />
                  View Details
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* ================= MODAL ================= */}

      {selectedApp && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white w-[750px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">

      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        Job Details
      </h2>

      <p className="font-semibold text-lg">
        {selectedApp.job?.title}
      </p>

      <p className="text-gray-500">
        {selectedApp.job?.company?.companyName}
      </p>

      <hr className="my-3" />

      <Info label="Description" value={selectedApp.job?.description} />
      <Info label="Location" value={selectedApp.job?.location} />
      <Info label="Salary" value={selectedApp.job?.salary} />
      <Info label="Job Type" value={selectedApp.job?.jobType} />
      <Info label="Vacancy" value={selectedApp.job?.vacancy} />
      <Info label="Qualifications" value={selectedApp.job?.qualifications} />
      <Info label="Responsibilities" value={selectedApp.job?.responsibilities} />

      <Info
        label="Due Date"
        value={
          new Date(
            selectedApp.job?.dueDate
          ).toLocaleDateString()
        }
      />

      <hr className="my-3" />

      <h3 className="font-semibold">
        Your Resume
      </h3>

      {selectedApp.user?.resume ? (
        <a
          href={selectedApp.user.resume}
          target="_blank"
          className="text-indigo-600 underline"
        >
          View Resume
        </a>
      ) : (
        <p>No resume uploaded</p>
      )}

      <div className="flex justify-end mt-5">

        <button
          onClick={() => setSelectedApp(null)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}

    </>
  );
};

export default DashboardUser;


// ================= STAT CARD =================

const StatCard = ({ title, value, color }) => {
  return (
    <div
      className={`text-white p-5 rounded-2xl shadow-lg hover:scale-105 transition ${color}`}
    >
      <p className="text-sm opacity-80">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
};
const Info = ({ label, value }) => {
  return (
    <p className="mb-2">
      <b>{label}:</b>
      <br />
      {value || "N/A"}
    </p>
  );
};