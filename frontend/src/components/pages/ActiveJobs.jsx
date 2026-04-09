import { useEffect, useState } from "react";
import api from "../../api/axios";
import ApplyJobModal from "./ApplyJobModal";
import Navbar from "../../common/Navbar";
import toast from "react-hot-toast";
import { MapPin, Briefcase, Calendar, IndianRupee } from "lucide-react";

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const jobsRes = await api.get("/api/jobs/jobs");
      setJobs(jobsRes.data);

      const appRes = await api.get("/api/applications/my");
      setApplications(appRes.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplied = (application) => {
    setApplications((prev) => [...prev, application]);
    toast.success("Application submitted successfully 🎉");
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
    applications.find((app) => app.jobId === jobId);

  if (loading) {
    return <Navbar />;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700">
            Explore Active Job Opportunities
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => {
              const application = getApplication(job._id);
              const isApplied = !!application;

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 p-6 border border-gray-100"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {job.title}
                  </h2>

                  <p className="text-indigo-600 mb-3">
                    {job.company?.name}
                  </p>

                  {/* Applied Badge */}
                  {isApplied && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mb-3">
                      ✓ Already Applied
                    </span>
                  )}

                  <p className="text-gray-600 text-sm mb-4">
                    {job.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} /> {job.jobType}
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} /> {job.salary}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(job.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* STATUS VIEW */}
                  {isApplied && (
                    <div className="mb-3 text-sm">
                      Status: 
                      <span className="ml-1 font-semibold text-indigo-600">
                        {application.status || "Pending"}
                      </span>
                    </div>
                  )}

                  {/* BUTTON SECTION */}
                  {!isApplied ? (
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <button
                      onClick={() => handleWithdraw(application._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedJob && (
          <ApplyJobModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApplied={handleApplied}
          />
        )}
      </div>
    </>
  );
};

export default ActiveJobs;