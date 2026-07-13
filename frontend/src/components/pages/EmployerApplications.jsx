import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/CompanyNavbar";
import {
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Briefcase,
  Brain
} from "lucide-react";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingIds, setAnalyzingIds] = useState({});
  const [matchScores, setMatchScores] = useState({});

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
      // Map to patch endpoints
      const type = status === "shortlisted" ? "shortlist" : "reject";
      await api.patch(`/api/applications/${id}/${type}`);
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAIMatch = async (appId, resumeBase64, jobDescription) => {
    if (!jobDescription) {
      alert("Job description is missing. Cannot perform AI match.");
      return;
    }
    if (!resumeBase64) {
      alert("Applicant has no resume uploaded.");
      return;
    }

    setAnalyzingIds(prev => ({ ...prev, [appId]: true }));
    try {
      const res = await api.post("/api/ai/analyze", {
        resumeBase64: resumeBase64,
        jobText: jobDescription
      });
      setMatchScores(prev => ({ ...prev, [appId]: res.data.match_percentage }));
    } catch (err) {
      console.error("AI Analysis failed", err);
      alert("AI Analysis failed. Make sure the AI service is running.");
    } finally {
      setAnalyzingIds(prev => ({ ...prev, [appId]: false }));
    }
  };

  const viewResume = (resumeBase64) => {
    try {
      const base64Data = resumeBase64.includes(",") ? resumeBase64.split(",")[1] : resumeBase64;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL, "_blank");
    } catch (error) {
      console.error("Error displaying resume:", error);
      alert("Failed to open resume. Invalid file format.");
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
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
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

                    {/* Resume + AI Match */}
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      {app.user?.resume ? (
                        <button
                          onClick={() => viewResume(app.user.resume)}
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition"
                        >
                          <FileText size={16} />
                          View Resume
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No resume</span>
                      )}

                      <div className="flex items-center gap-3">
                        {matchScores[app._id] !== undefined ? (
                          <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">
                            {matchScores[app._id]}% Match
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAIMatch(app._id, app.user?.resume, app.job?.description)}
                            disabled={analyzingIds[app._id]}
                            className="flex items-center gap-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                          >
                            {analyzingIds[app._id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            ) : (
                              <Brain size={16} />
                            )}
                            AI Match
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== STATUS + ACTION ===== */}
                  <div className="flex justify-between items-center mt-6">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium uppercase tracking-wider
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