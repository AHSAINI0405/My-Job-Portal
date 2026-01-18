import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Get active jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("/jobs", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setJobs(res.data);
    };
    fetchJobs();
  }, [user]);

  // Get applied jobs
  useEffect(() => {
    const fetchApplied = async () => {
      const res = await axios.get("/applications/me", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppliedJobs(res.data.map(a => a.job._id));
    };
    fetchApplied();
  }, [user]);

  // Apply to job
  const applyJob = async (jobId) => {
    try {
      await axios.post(`/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppliedJobs([...appliedJobs, jobId]);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Active Jobs</h2>
      {jobs.map(job => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.company.companyName}</p>
          {appliedJobs.includes(job._id) ? (
            <button disabled>Applied ✔</button>
          ) : (
            <button onClick={() => applyJob(job._id)}>Apply</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
