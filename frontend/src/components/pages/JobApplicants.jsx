import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
import {
  Mail,
  GraduationCap,
  CheckCircle,
  XCircle,
  FileText,
  Brain
} from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingIds, setAnalyzingIds] = useState({});
  const [matchScores, setMatchScores] = useState({});

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, jobRes] = await Promise.all([
        api.get(`/api/company/jobs/${jobId}/applicants`),
        api.get(`/api/jobs/public`) // We can find the job from public list or a specific endpoint
      ]);
      setApplicants(appRes.data);
      const currentJob = jobRes.data.find(j => j._id === jobId);
      if (currentJob) setJob(currentJob);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, type) => {
    try {
      await api.patch(`/api/applications/${id}/${type}`);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAIMatch = async (appId, resumeBase64) => {
    if (!job?.description) {
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
        jobText: job.description
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Job Applicants
          </h1>
          {job && <p className="text-gray-600 mb-8">For position: <span className="font-semibold">{job.title}</span></p>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : applicants.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 text-lg">
                No applicants yet for this job.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {applicants.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {app.user?.name || "Unknown User"}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                        <Mail size={14} />
                        {app.user?.email || "No email"}
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <GraduationCap size={14} />
                        {app.user?.education || "Not specified"}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider
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

                  <div className="mt-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {app.user?.skills?.length > 0 ? (
                        app.user.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-5">
                    {app.user?.resume ? (
                      <button
                        onClick={() => viewResume(app.user.resume)}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition"
                      >
                        <FileText size={16} /> View Resume
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
                          onClick={() => handleAIMatch(app._id, app.user?.resume)}
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

                  {app.status === "applied" && (
                    <div className="flex gap-3 mt-6 pt-5 border-t border-gray-50">
                      <button
                        onClick={() => updateStatus(app._id, "shortlist")}
                        className="flex-1 flex justify-center items-center gap-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 hover:border-green-600 font-semibold py-2 rounded-xl transition"
                      >
                        <CheckCircle size={18} /> Shortlist
                      </button>

                      <button
                        onClick={() => updateStatus(app._id, "reject")}
                        className="flex-1 flex justify-center items-center gap-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 font-semibold py-2 rounded-xl transition"
                      >
                        <XCircle size={18} /> Reject
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