import React, { useState } from "react";
import { MapPin, Building2, Calendar, IndianRupee, Briefcase, Users, FileText, CheckCircle, XCircle } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const JobDetailsModal = ({ job, onClose, isApplied, application, onApplied, onWithdraw, user }) => {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please log in to apply for this job.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(`/api/jobs/${job._id}/apply`);
      if (onApplied) {
        onApplied({
          ...res.data,
          job: job,
          status: "applied"
        });
      }
      toast.success("Application submitted successfully 🎉");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Already applied or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!application?._id) return;
    try {
      setLoading(true);
      if (onWithdraw) {
        await onWithdraw(application._id);
      }
      onClose();
    } catch (err) {
      toast.error("Failed to withdraw application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform scale-100 transition-all duration-300">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-16 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-extrabold text-2xl border border-white/20 overflow-hidden shadow-md shrink-0">
              {job.company?.logo ? (
                <img src={job.company.logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
              ) : (
                job.company?.name?.charAt(0) || "C"
              )}
            </div>
            <div>
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {job.jobType || "Full-Time"}
              </span>
              <h2 className="text-2xl font-extrabold mt-1 text-white leading-tight">
                {job.title}
              </h2>
              <p className="text-indigo-100 text-sm mt-0.5 font-medium flex items-center gap-1">
                <Building2 size={14} />
                {job.company?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-gray-400 text-xs font-semibold block mb-0.5">LOCATION</span>
              <span className="text-gray-800 text-sm font-bold flex items-center gap-1">
                <MapPin size={14} className="text-indigo-500" />
                {job.location || "Remote"}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-gray-400 text-xs font-semibold block mb-0.5">SALARY</span>
              <span className="text-emerald-600 text-sm font-bold flex items-center gap-0.5">
                💰 {job.salary || "Not specified"}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-gray-400 text-xs font-semibold block mb-0.5">VACANCY</span>
              <span className="text-gray-800 text-sm font-bold flex items-center gap-1">
                <Users size={14} className="text-purple-500" />
                {job.vacancy ? `${job.vacancy} position(s)` : "N/A"}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <span className="text-gray-400 text-xs font-semibold block mb-0.5">DUE DATE</span>
              <span className="text-amber-600 text-sm font-bold flex items-center gap-1">
                <Calendar size={14} />
                {job.dueDate ? new Date(job.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-base font-bold text-gray-900 border-b pb-2 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-indigo-500" /> Job Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* Qualifications */}
          {job.qualifications && (
            <div>
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 mb-2">
                Requirements & Qualifications
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {job.qualifications}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 mb-2">
                Key Responsibilities
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Application Status Alert */}
          {isApplied && application && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border ${
              application.status === "shortlisted"
                ? "bg-green-50 border-green-200 text-green-800"
                : application.status === "rejected"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
              {application.status === "shortlisted" ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : application.status === "rejected" ? (
                <XCircle size={20} className="text-red-600" />
              ) : (
                <Calendar size={20} className="text-amber-600" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  Application Status: {application.status.toUpperCase()}
                </span>
                <span className="text-xs opacity-90">
                  You applied on {new Date(application.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition text-sm"
          >
            Close
          </button>
          
          {!user ? (
            <a
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center"
            >
              Sign In to Apply
            </a>
          ) : !isApplied ? (
            <button
              onClick={handleApply}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm"
            >
              {loading ? "Applying..." : "Apply Now"}
            </button>
          ) : (
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-600 font-bold px-6 py-2.5 rounded-xl transition text-sm"
            >
              {loading ? "Withdrawing..." : "Withdraw Application"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobDetailsModal;
