import { useEffect, useState } from "react";
import api from "../../api/axios";
import ApplyJobModal from "./ApplyJobModal";
import Navbar from "../../common/Navbar";
import { MapPin, Briefcase, Calendar, IndianRupee } from "lucide-react";

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Heading */}
          <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700">
            Explore Active Job Opportunities
          </h1>

          {/* Job Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 p-6 border border-gray-100"
              >
                {/* Job Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                  {job.title}
                </h2>

                {/* Company Name */}
                <p className="text-indigo-600 font-medium mb-4">
                  {job.company?.companyName}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Details Section */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    {job.jobType}
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee size={16} />
                    {job.salary}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Apply before{" "}
                    {new Date(job.dueDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setSelectedJob(job)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition duration-300"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedJob && (
          <ApplyJobModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </>
  );
};

export default ActiveJobs;