import React, { useState } from 'react';
import { Search, Briefcase, Users, Building2, TrendingUp, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const stats = [
    { icon: Briefcase, value: '50,000+', label: 'Active Jobs' },
    { icon: Users, value: '100,000+', label: 'Job Seekers' },
    { icon: Building2, value: '5,000+', label: 'Companies' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' }
  ];

  const features = [
    {
      title: 'For Job Seekers',
      items: [
        'Browse thousands of job opportunities',
        'AI-powered job recommendations',
        'Easy application tracking',
        'Resume builder & optimization'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'For Employers',
      items: [
        'Post unlimited job listings',
        'Access qualified candidates',
        'Advanced filtering tools',
        'Analytics & insights dashboard'
      ],
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const topJobs = [
    { title: 'Senior Software Engineer', company: 'Tech Corp', location: 'San Francisco, CA', salary: '$120k - $180k' },
    { title: 'Product Manager', company: 'Innovation Labs', location: 'New York, NY', salary: '$100k - $150k' },
    { title: 'UX Designer', company: 'Creative Studio', location: 'Remote', salary: '$80k - $120k' }
  ];
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
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
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Find Jobs</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Companies</a>
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

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Find Your Dream Job
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Or Perfect Candidate
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect talented professionals with amazing opportunities. Your next career move starts here.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center border-r border-gray-200 pr-4">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <div className="flex-1 flex items-center pr-4">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition font-semibold">
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600">
              Whether you're hiring or looking for work, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition">
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${feature.gradient} text-white rounded-full text-sm font-semibold mb-6`}>
                  {feature.title}
                </div>
                <ul className="space-y-4">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition inline-flex items-center group">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Top jobs from leading companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topJobs.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {job.company.charAt(0)}
                  </div>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-gray-500 text-sm flex items-center mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </p>
                <p className="text-blue-600 font-semibold mb-4">{job.salary}</p>
                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers and employers who trust JobPortal to connect talent with opportunity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition"onClick={()=>navigate('/register')}>
                Post a Job
              </button>
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition"onClick={()=>navigate('/register')}>
                Find Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">JobPortal</span>
              </div>
              <p className="text-gray-400">Connecting talent with opportunity since 2024</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Career Advice</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Post a Job</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}