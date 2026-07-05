import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
import { Building2, MapPin, Globe, Briefcase, Star, MessageSquare } from "lucide-react";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      const [companyRes, jobsRes, reviewsRes] = await Promise.all([
        api.get(`/api/profile/companies/${id}`),
        api.get(`/api/jobs/company/${id}`),
        api.get(`/api/reviews/${id}`)
      ]);
      setCompany(companyRes.data);
      setJobs(jobsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
      setError("Company not found or failed to load data.");
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
    navigate("/jobs");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to write a review.");
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post("/api/reviews", {
        companyId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      alert("Review added successfully!");
      setReviewForm({ rating: 5, comment: "" });
      fetchCompanyData(); // Refresh reviews
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">{error || "Company not found"}</h2>
        <button onClick={() => navigate("/companies")} className="mt-4 text-indigo-600 hover:underline">
          Back to Companies
        </button>
      </div>
    );
  }

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar username={user?.name} />
      
      {/* Header Banner */}
      <div className="bg-indigo-700 h-48 w-full relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Company Card Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 bg-white rounded-xl shadow-md p-2 flex-shrink-0 -mt-16 md:mt-0 border-4 border-white overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-bold rounded-lg">
                {company.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-gray-600">
              {company.industry && (
                <div className="flex items-center gap-1">
                  <Building2 size={18} />
                  <span>{company.industry}</span>
                </div>
              )}
              {company.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>{company.location}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-1">
                  <Globe size={18} />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 flex flex-col items-center min-w-[120px]">
            <div className="flex items-center text-orange-500 font-bold text-xl gap-1">
              <Star fill="currentColor" size={20} />
              {averageRating}
            </div>
            <span className="text-sm text-gray-500 mt-1">{reviews.length} Reviews</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8 pb-16">
          {/* Main Content (Jobs) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {company.description || "No description provided."}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase size={24} className="text-indigo-600" />
                Open Positions ({jobs.length})
              </h2>

              {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No active jobs</h3>
                  <p className="text-gray-500 mt-1">{company.name} doesn't have any open positions right now.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                      <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                      <p className="text-gray-500 text-sm mt-3 line-clamp-2">{job.description}</p>
                      <button
                        onClick={() => handleApply(job._id)}
                        className="mt-4 w-full bg-indigo-50 text-indigo-700 py-2 rounded-lg hover:bg-indigo-100 transition font-medium"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Reviews) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-indigo-600" />
                  Reviews
                </h2>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="mb-8 border-b border-gray-100 pb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Write a Review</h3>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={20} 
                        fill={star <= reviewForm.rating ? "#f97316" : "none"} 
                        strokeWidth={star <= reviewForm.rating ? 0 : 2}
                        className={star <= reviewForm.rating ? "text-orange-500" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-3 resize-none"
                  rows="3"
                  placeholder="Share your experience working here..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition w-full disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>

              {/* Review List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800 text-sm">{review.userId?.name || "Anonymous"}</span>
                        <div className="flex text-orange-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">"{review.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
