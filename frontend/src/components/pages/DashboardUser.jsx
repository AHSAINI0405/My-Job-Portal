import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const DashboardUser = () => {
  const [applications, setApplications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchApplications();
  }, []);

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

        <div className="w-64 bg-white shadow-lg p-5">

          <div className="text-center">

            <img
              src={
                user?.avatar ||
                "https://i.pravatar.cc/150"
              }
              className="w-24 h-24 rounded-full mx-auto"
            />

            <h2 className="mt-3 font-bold text-lg">
              {user?.name}
            </h2>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>

          </div>

          <hr className="my-5" />

          <ul className="space-y-3">

            <li className="font-semibold text-indigo-600">
              Dashboard
            </li>

            <li>My Applications</li>

            <li>Profile</li>

            <li>Settings</li>

          </ul>
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

          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="font-semibold mb-3">
              Applications Overview
            </h2>

            <PieChart width={400} height={300}>
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
                className="border p-4 rounded-lg mb-3"
              >
                <h3 className="font-bold">
                  {app.job?.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {app.job?.description}
                </p>
                <p className="text-sm text-gray-500">
                  {app.company?.name}
                </p>

                <p className="text-sm mt-2">
                  Status: {app.status}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>
    </>
  );
};

export default DashboardUser;



// ================= STAT CARD =================

const StatCard = ({ title, value, color }) => {
  return (
    <div
      className={`text-white p-5 rounded-xl shadow ${color}`}
    >
      <p className="text-sm">{title}</p>

      <h2 className="text-2xl font-bold">
        {value}
      </h2>
    </div>
  );
};