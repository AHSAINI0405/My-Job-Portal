import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
// import Navbar from "../../common/Navbar";
import { Search, Briefcase, Users, Building2, TrendingUp, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react';
const FindJobs = () => {

 const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  const stats = [
    { icon: Briefcase, value: '50,000+', label: 'Active Jobs' },
    { icon: Users, value: '100,000+', label: 'Job Seekers' },
    { icon: Building2, value: '5,000+', label: 'Companies' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' }
  ];


  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/api/jobs/public"); // public route
    setJobs(res.data);
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/apply/${jobId}`);
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p className="text-gray-600">
                {job.company?.name}
              </p>

              <p className="text-sm text-gray-500">
                {job.location}
              </p>

              <button
                onClick={() => handleApply(job._id)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FindJobs;