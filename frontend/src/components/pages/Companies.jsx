import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from 'react-router-dom';
import { Search, Briefcase, Building2, MapPin, Globe } from 'lucide-react';
import Navbar from "../../common/Navbar";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/profile/companies");
      setCompanies(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <button className="text-gray-600 hover:text-indigo-600 transition" onClick={()=>navigate('/find-jobs')}>Find Jobs</button>
                <button className="text-gray-900 font-semibold transition" onClick={()=>navigate('/companies')}>Companies</button>
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
            Discover Top Employers
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Find the right company culture for your next career move.
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white p-2 rounded-2xl shadow-xl max-w-2xl mx-auto grid md:grid-cols-1">
            <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <Search className="text-gray-400 mr-3" size={20}/>
              <input
                type="text"
                placeholder="Search by company name or industry..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20 relative z-20">
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-4">
              <Building2 className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any companies matching your search.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {filteredCompanies.map((company) => (
              <Link
                to={`/companies/${company._id}`}
                key={company._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group block"
              >
                <div className="w-16 h-16 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl border border-indigo-100 mb-4 overflow-hidden">
                  {company.logo ? (
                    <img src={company.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    company.name?.charAt(0) || "C"
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
                  {company.name}
                </h2>
                
                <p className="text-indigo-600 text-sm font-medium mb-4">
                  {company.industry || "Unknown Industry"}
                </p>

                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    {company.location || "Location not provided"}
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Globe size={16} className="text-gray-400" />
                      <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;