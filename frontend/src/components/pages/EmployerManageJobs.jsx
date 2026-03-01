import { useEffect, useState } from "react";
import axios from "axios";
import CompanyNavbar from "../../common/CompanyNavbar";

const API = "https://my-job-portal-fnf6.onrender.com/api/jobs";

const EmployerManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "",
    dueDate: "",
    vacancy:"",
    responsibilities:"",
    qualifications:""
  });

  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/company/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/jobs/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post(`${API}/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      jobType: "",
      dueDate: "",
      vacancy:"",
    responsibilities:"",
    qualifications:""
    });

    setEditingId(null);
    fetchJobs();
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      jobType: job.jobType,
      dueDate: job.dueDate?.substring(0, 10),
      vacancy:job.vacancy,
    responsibilities:job.responsibilities,
    qualifications:job.qualifications
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    await axios.delete(`${API}/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchJobs();
  };

  return (
    <>
      <CompanyNavbar />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Job Postings
            </h1>
            <p className="text-gray-500 mt-1">
              Create, update and manage your job listings
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Job" : "Post New Job"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  name="title"
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-style"
                />

                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-style"
                />

                <input
                  name="salary"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="input-style"
                />

                <input
                  name="vacancy"
                  placeholder="Vacancy"
                  value={formData.vacancy}
                  onChange={handleChange}
                  className="input-style"
                />
<input                  name="responsibilities"
                  placeholder="Responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="input-style"
                />
<input
                  name="qualifications"
                  placeholder="Qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  className="input-style"
                />
                <input
                  name="jobType"
                  placeholder="Job Type"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="input-style"
                />

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>

              <textarea
                name="description"
                placeholder="Job Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-style w-full"
              />

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                {editingId ? "Update Job" : "Post Job"}
              </button>
            </form>
          </div>

          {/* Job List */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h3>

                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {job.description}
                </p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p><strong>Type:</strong> {job.jobType}</p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(job)}
                    className="flex-1 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-medium transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Reusable Input Style */}
      <style>
        {`
          .input-style {
            padding: 10px 14px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            outline: none;
            transition: all 0.2s ease;
          }
          .input-style:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
        `}
      </style>
    </>
  );
};

export default EmployerManageJobs;