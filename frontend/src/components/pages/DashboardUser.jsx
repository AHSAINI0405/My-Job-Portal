import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
import {
  ReceiptText,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  TrendingUp,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { NavLink } from "react-router-dom";

const DashboardUser = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await api.get("/api/applications/me");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applied = applications.length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const pending = applications.filter((a) => a.status === "applied").length;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "Shortlisted", value: shortlisted },
    { name: "Rejected", value: rejected },
  ].filter((d) => d.value > 0);

  const COLORS = ["#f59e0b", "#22c55e", "#ef4444"];

  const statCards = [
    { title: "Total Applied", value: applied, icon: Briefcase, color: "bg-indigo-500", bg: "bg-indigo-50", textColor: "text-indigo-600" },
    { title: "Shortlisted", value: shortlisted, icon: CheckCircle, color: "bg-green-500", bg: "bg-green-50", textColor: "text-green-600" },
    { title: "Rejected", value: rejected, icon: XCircle, color: "bg-red-500", bg: "bg-red-50", textColor: "text-red-600" },
    { title: "Pending Review", value: pending, icon: Clock, color: "bg-amber-500", bg: "bg-amber-50", textColor: "text-amber-600" },
  ];

  return (
    <>
      <Navbar username={user?.name} />
      <div className="flex min-h-screen bg-gray-50">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-64 flex-col bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-2xl p-6 flex-shrink-0">
          {/* Avatar */}
          <div className="text-center mb-8">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`}
              alt="Avatar"
              className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white/30 bg-white/10"
            />
            <h2 className="font-bold text-lg leading-tight">{user?.name}</h2>
            <p className="text-indigo-300 text-sm truncate">{user?.email}</p>
          </div>

          <nav className="space-y-1 flex-1">
            <NavLink to="/dashboard" className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive ? "bg-white text-indigo-700" : "text-white/80 hover:bg-white/10"}`
            }>
              <TrendingUp size={18} /> Dashboard
            </NavLink>
            <NavLink to="/jobs" className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive ? "bg-white text-indigo-700" : "text-white/80 hover:bg-white/10"}`
            }>
              <Briefcase size={18} /> Browse Jobs
            </NavLink>
            <NavLink to="/myapplications" className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive ? "bg-white text-indigo-700" : "text-white/80 hover:bg-white/10"}`
            }>
              <FileText size={18} /> My Applications
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive ? "bg-white text-indigo-700" : "text-white/80 hover:bg-white/10"}`
            }>
              <User size={18} /> Profile
            </NavLink>
          </nav>

          <div className="mt-auto text-center">
            <Link to="/jobs" className="block w-full bg-white text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-50 transition">
              Browse Jobs
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-2">Here's a summary of your job search activity.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                    <h2 className={`text-4xl font-extrabold mt-1 ${card.textColor}`}>{card.value}</h2>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition`}>
                    <card.icon size={22} className={card.textColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Applications Overview</h2>
              {chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-44 text-gray-400">
                  <TrendingUp size={40} className="mb-2 opacity-30" />
                  <p className="text-sm">No application data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Quick Tips */}
            <div className="lg:col-span-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-sm">
              <h2 className="font-bold text-xl mb-4">Tips to Land Your Dream Job</h2>
              <ul className="space-y-3">
                {[
                  "Keep your profile 100% complete to stand out to employers.",
                  "Apply to at least 5 jobs per week to increase your chances.",
                  "Tailor your resume for each job description.",
                  "Follow up after 1 week if you haven't heard back.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                    <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <Link to="/jobs" className="mt-6 inline-block bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition">
                Browse Jobs →
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link to="/myapplications" className="text-sm text-indigo-600 hover:underline font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-3">
                  <Briefcase size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No applications yet</h3>
                <p className="text-gray-500 text-sm mb-4">Start applying to jobs to see your activity here.</p>
                <Link to="/jobs" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{app.job?.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{app.job?.company?.name}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        app.status === "shortlisted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {app.status}
                      </span>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition opacity-0 group-hover:opacity-100"
                        title="View Details"
                      >
                        <ReceiptText size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-indigo-700">Job Details</h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedApp.job?.title}</h3>
                <p className="text-indigo-600 font-medium">{selectedApp.job?.company?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoItem label="Location" value={selectedApp.job?.location} />
                <InfoItem label="Salary" value={selectedApp.job?.salary} />
                <InfoItem label="Job Type" value={selectedApp.job?.jobType} />
                <InfoItem label="Vacancy" value={selectedApp.job?.vacancy} />
                <InfoItem
                  label="Due Date"
                  value={selectedApp.job?.dueDate ? new Date(selectedApp.job.dueDate).toLocaleDateString() : "N/A"}
                />
                <InfoItem label="Application Status" value={
                  <span className={`font-bold uppercase ${
                    selectedApp.status === "shortlisted" ? "text-green-600" : selectedApp.status === "rejected" ? "text-red-600" : "text-amber-600"
                  }`}>{selectedApp.status}</span>
                } />
              </div>
              {selectedApp.job?.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{selectedApp.job.description}</p>
                </div>
              )}
              {selectedApp.job?.qualifications && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Qualifications</p>
                  <p className="text-sm text-gray-600">{selectedApp.job.qualifications}</p>
                </div>
              )}
              {selectedApp.job?.responsibilities && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Responsibilities</p>
                  <p className="text-sm text-gray-600">{selectedApp.job.responsibilities}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
    <p className="font-semibold text-gray-800 text-sm">{value || "N/A"}</p>
  </div>
);

export default DashboardUser;