import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
import {
  Mail,
  GraduationCap,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH APPLICANTS =================
  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/company/jobs/${jobId}/applicants`);
      setApplicants(res.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, type) => {
    try {
      await api.patch(`/api/applications/${id}/${type}`);
      fetchApplicants(); // refresh after update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-8">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-indigo-700 mb-8">
            Job Applicants
          </h1>

          {/* Loading State */}
          {loading ? (
            <div className="text-center text-gray-500">
              Loading applicants...
            </div>
          ) : applicants.length === 0 ? (
            /* Empty State */
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <p className="text-gray-500 text-lg">
                No applicants yet for this job.
              </p>
            </div>
          ) : (
            /* Applicants Grid */
            <div className="grid md:grid-cols-2 gap-6">
              {applicants.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  {/* ===== Profile Header ===== */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {app.user?.name || "Unknown User"}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <Mail size={14} />
                        {app.user?.email || "No email"}
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <GraduationCap size={14} />
                        {app.user?.education || "Not specified"}
                      </div>
                    </div>

                    {/* ===== Status Badge ===== */}
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
                      {app.status || "pending"}
                    </span>
                  </div>

                  {/* ===== Skills Section ===== */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">
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
                  </div>

                  {/* ===== Resume Section ===== */}
                 {app.user?.resume && (
  <button
    onClick={() => {
      const pdfWindow = window.open("");
      pdfWindow.document.write(
        `<iframe width='100%' height='100%' src='${app.user.resume}'></iframe>`
      );
    }}
    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:cursor-pointer"
  >
    View Resume
  </button>
)}

                  {/* ===== Action Buttons ===== */}
                  {app.status === "applied" && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          updateStatus(app._id, "shortlist")
                        }
                        className="flex hover:cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        <CheckCircle size={16} />
                        Shortlist
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(app._id, "reject")
                        }
                        className="flex hover:cursor-pointer items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobApplicants;