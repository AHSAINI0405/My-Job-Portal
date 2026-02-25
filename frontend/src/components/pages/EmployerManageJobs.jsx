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
    dueDate: ""
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch jobs
  const fetchJobs = async () => {
    const res = await axios.get(`${API}/company/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update
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
      dueDate: ""
    });

    setEditingId(null);
    fetchJobs();
  };

  // Edit job
  const handleEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      jobType: job.jobType,
      dueDate: job.dueDate?.substring(0, 10)
    });
  };

  // Delete job
  const handleDelete = async (id) => {
    await axios.delete(`${API}/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchJobs();
  };

  return (

<><CompanyNavbar/>

    <div style={{ padding: "30px" }}>
      <h2>Manage Jobs</h2>

      {/* Create / Edit Form */}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} />
        <input name="jobType" placeholder="Job Type" value={formData.jobType} onChange={handleChange} />
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

        <button type="submit">
          {editingId ? "Update Job" : "Create Job"}
        </button>
      </form>

      <hr />

      {/* Job List */}
      {jobs.map((job) => (
        <div key={job._id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Status:</strong> {job.status}</p>

          <button onClick={() => handleEdit(job)}>Edit</button>
          <button onClick={() => handleDelete(job._id)}>Delete</button>
        </div>
      ))}
    </div>
    </>
  );
};

export default EmployerManageJobs;