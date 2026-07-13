import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
import JobDetailsModal from "./JobDetailsModal";
import toast from "react-hot-toast";
import { Briefcase, Calendar, MapPin, Search, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/applications/me");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await api.delete(`/api/applications/${appId}`);
      setApplications(applications.filter((a) => a._id !== appId));
      toast.success("Application withdrawn successfully");
    } catch (err) {
      toast.error("Failed to withdraw application");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats
  const totalCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status === "shortlisted").length;
  const rejectedCount = applications.filter(a => a.status === "rejected").length;
  const pendingCount = applications.filter(a => a.status === "applied").length;

  if (loading) {
    return (
      <>
        <Navbar username={user?.name} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar username={user?.name} />
      
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Applied Jobs
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage all your submitted job applications.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Total Applications</span>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Briefcase size={22} className="text-indigo-600" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Shortlisted</span>
                <h3 className="text-3xl font-bold text-green-600 mt-1">{shortlistedCount}</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <CheckCircle size={22} className="text-green-600" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Pending</span>
                <h3 className="text-3xl font-bold text-amber-500 mt-1">{pendingCount}</h3>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <Clock size={22} className="text-amber-500" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Rejected</span>
                <h3 className="text-3xl font-bold text-red-600 mt-1">{rejectedCount}</h3>
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <XCircle size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 w-full md:max-w-md border border-gray-100">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {[
                { label: "All", value: "all" },
                { label: "Pending", value: "applied" },
                { label: "Shortlisted", value: "shortlisted" },
                { label: "Rejected", value: "rejected" }
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setStatusFilter(btn.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    statusFilter === btn.value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications list */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4 text-indigo-500">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">No applications found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {statusFilter !== "all" 
                  ? `You don't have any applications with "${statusFilter}" status.` 
                  : "Start searching and applying for active jobs!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => {
                    // Populate company info on selectedJob to match expected shape in Modal
                    setSelectedJob({
                      ...app.job,
                      company: app.company
                    });
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shrink-0 overflow-hidden">
                      {app.company?.logo ? (
                        <img src={app.company.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        app.company?.name?.charAt(0) || "C"
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition leading-tight">
                        {app.job?.title || "Position Details Unavailable"}
                      </h2>
                      <p className="text-indigo-600 font-semibold text-sm mt-0.5">
                        {app.company?.name}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {app.job?.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          Applied on: {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions / Status */}
                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0" onClick={(e) => e.stopPropagation()}>
                    <span className={`px-3.5 py-1 text-xs rounded-full font-extrabold uppercase tracking-wider ${
                      app.status === "shortlisted"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : app.status === "rejected"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}>
                      {app.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedJob({
                            ...app.job,
                            company: app.company
                          });
                        }}
                        className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="View Details"
                      >
                        <ArrowRight size={20} />
                      </button>
                      
                      {app.status === "applied" && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition border border-red-100 hover:border-red-200"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isApplied={true}
          application={applications.find(a => a.job?._id === selectedJob._id)}
          onWithdraw={handleWithdraw}
          user={user}
        />
      )}
    </>
  );
};

export default MyApplications;