import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { Search, Briefcase, MapPin, Building2, Star, Clock } from 'lucide-react';
import Navbar from "../../common/Navbar";

const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/public");
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/jobs"); // Ideally navigate to job details or apply directly
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <Navbar username={user.name} />
      ) : (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer">
                <Briefcase className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  JobPortal
                </span>
              </div>
              <div className="hidden md:flex space-x-8">
                <button className="text-gray-900 font-semibold transition" onClick={()=>navigate('/find-jobs')}>Find Jobs</button>
                <button className="text-gray-600 hover:text-indigo-600 transition" onClick={()=>navigate('/companies')}>Companies</button>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-medium" onClick={()=>navigate('/login')}>
                  Sign In
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium" onClick={()=>navigate('/register')}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      {/* HEADER SECTION */}
      <div className="bg-indigo-700 pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Discover Your Next Career Move
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Explore thousands of job opportunities with top companies.
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white p-2 rounded-2xl shadow-xl max-w-4xl mx-auto grid md:grid-cols-3 gap-2">
            <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <Search className="text-gray-400 mr-3" size={20}/>
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <MapPin className="text-gray-400 mr-3" size={20}/>
              <input
                type="text"
                placeholder="City or remote"
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button className="bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold text-lg py-3">
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20 relative z-20">
        
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-4">
              <Search className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any jobs matching "{searchTerm}" in "{location}". Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl border border-indigo-100">
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt="Logo" className="w-full h-full rounded-lg object-contain" />
                    ) : (
                      job.company?.name?.charAt(0) || "C"
                    )}
                  </div>
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {job.jobType || "Full-Time"}
                  </span>
                </div>

                <Link to={`/companies/${job.company?._id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition mb-2">
                  <Building2 size={16} />
                  {job.company?.name || "Unknown Company"}
                </Link>

                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  {job.title}
                </h2>

                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1.5 font-medium text-green-600">
                      💰 {job.salary}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                  {job.description}
                </p>

                <button
                  onClick={() => handleApply(job._id)}
                  className="w-full bg-indigo-50 text-indigo-700 font-semibold py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition duration-300 mt-auto"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJobs;