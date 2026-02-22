import { useEffect, useState } from "react";
import api from "../../api/axios";
import CompanyJobCard from "../company/CompanyJobCard";
import CompanyNavbar from "../../common/CompanyNavbar";

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const company = JSON.parse(localStorage.getItem("company"));

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get("/company/jobs");
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
    <>
      {/* Full Width Navbar */}
      <CompanyNavbar companyName={company?.name || "Company"} />

      <div className="max-w-7xl mx-auto p-6">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Company Dashboard
        </h1>

        {/* Stats Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500">Total Jobs Posted</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {totalJobs}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500">Active Jobs</p>
            <h2 className="text-3xl font-bold text-green-600">
              {activeJobs}
            </h2>
          </div>

        </div>

        {/* Jobs Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold mb-6">
            My Posted Jobs
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              🚀 No jobs posted yet
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <CompanyJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default CompanyDashboard;