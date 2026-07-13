import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import JobDetailsModal from "./JobDetailsModal";
import Navbar from "../../common/Navbar";
import toast from "react-hot-toast";
import { MapPin, Briefcase, Calendar, IndianRupee, Building2, Search, Filter, Info } from "lucide-react";

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [jobsRes, appRes] = await Promise.all([
        api.get("/api/jobs/jobs"),
        api.get("/api/applications/me"),
      ]);
      setJobs(jobsRes.data);
      setApplications(appRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplied = (application) => {
    setApplications((prev) => [...prev, application]);
  };

  const handleWithdraw = async (appId) => {
    try {
      await api.delete(`/api/applications/${appId}`);
      setApplications(applications.filter((a) => a._id !== appId));
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error("Failed to withdraw");
    }
  };

  const getApplication = (jobId) =>
    applications.find((app) => app.job?._id === jobId);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = jobTypeFilter ? job.jobType === jobTypeFilter : true;
    return matchSearch && matchType;
  });

  return (
    <>
      <Navbar username={user?.name} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-indigo-700 py-12 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-4xl font-extrabold text-white mb-3">
              Find Your Perfect Role
            </h1>
            <p className="text-indigo-200 text-lg mb-8">
              Explore {jobs.length} active opportunities waiting for you.
            </p>

            {/* Search & Filter bar */}
            <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-3 max-w-4xl shadow-xl">
              <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, company, or location..."
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <Filter size={20} className="text-gray-400" />
                <select
                  className="bg-transparent focus:outline-none text-gray-700 cursor-pointer pr-2"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-4">
                <Search size={36} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const application = getApplication(job._id);
                const isApplied = !!application;

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="p-6 flex-1">
                      {/* Company + Type */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl border border-indigo-100 overflow-hidden">
                          {job.company?.logo ? (
                            <img src={job.company.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            job.company?.name?.charAt(0) || "C"
                          )}
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          job.jobType === "Full-Time"
                            ? "bg-green-100 text-green-700"
                            : job.jobType === "Part-Time"
                            ? "bg-blue-100 text-blue-700"
                            : job.jobType === "Internship"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {job.jobType || "Full-Time"}
                        </span>
                      </div>

                      {/* Company Name Link */}
                      {job.company?._id ? (
                        <Link
                          to={`/companies/${job.company._id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition mb-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Building2 size={15} />
                          {job.company?.name}
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Building2 size={15} />
                          {job.company?.name}
                        </p>
                      )}

                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                        {job.title}
                      </h2>

                      {isApplied && (
                        <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          ✓ Already Applied
                        </span>
                      )}

                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-gray-400" />
                          {job.location}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <IndianRupee size={15} />
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-gray-400" />
                          Apply by {new Date(job.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>

                      {/* STATUS */}
                      {isApplied && application.status !== "applied" && (
                        <div className={`mt-4 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                          application.status === "shortlisted"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      )}
                    </div>

                    {/* Button */}
                    <div className="px-6 pb-6" onClick={(e) => e.stopPropagation()}>
                      {!isApplied ? (
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleWithdraw(application._id)}
                          className="w-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 py-3 rounded-xl font-semibold transition"
                        >
                          Withdraw Application
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isApplied={!!getApplication(selectedJob._id)}
          application={getApplication(selectedJob._id)}
          onApplied={handleApplied}
          onWithdraw={handleWithdraw}
          user={user}
        />
      )}
    </>
  );
};

export default ActiveJobs;