import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Users, Building2, TrendingUp, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react';
const Companies = () => {
  const [companies, setCompanies] = useState([]);
    const stats = [
        { icon: Briefcase, value: '50,000+', label: 'Active Jobs' },
        { icon: Users, value: '100,000+', label: 'Job Seekers' },
        { icon: Building2, value: '5,000+', label: 'Companies' },
        { icon: TrendingUp, value: '95%', label: 'Success Rate' }
      ];
      const navigate=useNavigate();
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await api.get("/api/profile/companies");
    setCompanies(res.data);
  };

  return (
    <>

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
      

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Verified Companies
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <img
                src={company.logo}
                className="h-16 mb-3"
              />

              <h2 className="text-xl font-semibold">
                {company.name}
              </h2>

              <p className="text-gray-600">
                {company.industry}
              </p>

              <p className="text-sm text-gray-500">
                {company.location}
              </p>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Companies;