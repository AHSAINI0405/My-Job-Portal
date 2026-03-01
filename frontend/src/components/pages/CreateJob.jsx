import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import CompanyNavbar from "../../common/CompanyNavbar";

const CreateJob = () => {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/jobs/jobs", formData);

      alert("Job Posted Successfully 🚀");

      // Redirect to employer create job page (or jobs list if you prefer)
      navigate("/employer/createjob");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CompanyNavbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            Create New Job
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <textarea
              name="description"
              placeholder="Job Description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="text"
              name="salary"
              placeholder="Salary (e.g. 5-7 LPA)"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="vacancy"
              placeholder="Vacancy"
              value={formData.vacancy}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="qualifications"
              placeholder="Qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="responsibilities"
              placeholder="Responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
            >
              {loading ? "Posting..." : "Create Job"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default CreateJob;