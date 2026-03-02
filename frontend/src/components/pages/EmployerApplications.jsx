import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/CompanyNavbar";
import {
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Briefcase,
} from "lucide-react";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/api/employer/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/applications/${id}`, { status });
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold text-indigo-700 mb-8">
            All Applications
          </h1>

          {loading ? (
           <div className="min-h-[60vh] flex items-center justify-center">

    <div className="flex gap-4">

      <div className="wave w-8 h-8 rounded-full bg-indigo-700"></div>

      <div className="wave w-8 h-8 rounded-full bg-green-500"></div>

      <div className="wave w-8 h-8 rounded-full bg-sky-400"></div>

      <div className="wave w-8 h-8 rounded-full bg-yellow-400"></div>

    </div>

  </div>

          ) : applications.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <p className="text-gray-500 text-lg">
                No applications received yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition"
                >
                  {/* ===== JOB INFO ===== */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                      <Briefcase size={18} />
                      {app.job?.title}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {app.job?.description}
                    </p>
                  </div>

                  {/* ===== APPLICANT INFO ===== */}
                  <div className="border-t pt-4 mt-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {app.user?.name}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Mail size={14} />
                      {app.user?.email}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.user?.skills?.length > 0 ? (
                        app.user.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No skills listed
                        </span>
                      )}
                    </div>

                    {/* Resume */}
                    {app.user?.resume && (
                      <div className="mt-3">
                        <a
                          href={
                            app.user.resume.startsWith("data:")
                              ? app.user.resume
                              : `data:application/pdf;base64,${app.user.resume}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          <FileText size={16} />
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>

                  {/* ===== STATUS + ACTION ===== */}
                  <div className="flex justify-between items-center mt-6">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                        ${
                          app.status === "shortlisted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {app.status}
                    </span>

                    {app.status === "applied" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateStatus(app._id, "shortlisted")
                          }
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          <CheckCircle size={16} />
                          Shortlist
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(app._id, "rejected")
                          }
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployerApplications;