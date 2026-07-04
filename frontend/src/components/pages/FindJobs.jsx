import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Search, Briefcase, Users, Building2, TrendingUp, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react';


const FindJobs = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/api/jobs/public");
    setJobs(res.data);
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/jobs");
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-8 w-8 text-blue-600" />
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        JobPortal
                      </span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                      <button className="text-gray-700 hover:text-blue-600 transition" onClick={()=>navigate('/find-jobs')}>Find Jobs</button>
                      <a href="/companies" className="text-gray-700 hover:text-blue-600 transition">Companies</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600 transition">About</a>
                    </div>
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" onClick={()=>navigate('/login')}>
                        Sign In
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition" onClick={()=>navigate('/register')}>
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Find Your Dream Job
          </h1>

          {/* SEARCH BAR */}
          <div className="grid md:grid-cols-3 gap-4">

            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                placeholder="Location..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
              Search Jobs
            </button>

          </div>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition duration-300 border"
            >

              <div className="flex items-start justify-between mb-3">
                <Briefcase className="text-indigo-600" size={22}/>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Active
                </span>
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                {job.company?.name}
              </p>

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <MapPin size={14}/>
                {job.location}
              </div>

              <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                {job.description}
              </p>

              <button
                onClick={() => handleApply(job._id)}
                className="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Apply Now
              </button>

            </div>
          ))}

        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No jobs found
          </div>
        )}

      </div>
    </div>
  );
};

export default FindJobs;