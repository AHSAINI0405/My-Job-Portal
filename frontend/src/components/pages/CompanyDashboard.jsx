import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import CompanyJobCard from "../company/CompanyJobCard";
import CompanyNavbar from "../../common/CompanyNavbar";
import { Briefcase, Activity, PlusCircle, TrendingUp } from "lucide-react";

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const company = JSON.parse(localStorage.getItem("company"));

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get("/api/jobs/company/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar companyName={company?.name || "Company"} />

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {company?.name || "Company"}!
            </h1>
            <p className="text-gray-500 mt-2">Here is what is happening with your job listings today.</p>
          </div>
          <button
            onClick={() => navigate("/employer/createjob")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold"
          >
            <PlusCircle size={20} />
            Post New Job
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-medium">Total Jobs</p>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">{totalJobs}</h2>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
                <Briefcase className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-medium">Active Jobs</p>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">{activeJobs}</h2>
              </div>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-medium">Engagement</p>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">High</h2>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Postings</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                You haven't posted any jobs yet. Create your first job listing to start attracting top talent.
              </p>
              <button
                onClick={() => navigate("/employer/createjob")}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Post a Job
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <CompanyJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;