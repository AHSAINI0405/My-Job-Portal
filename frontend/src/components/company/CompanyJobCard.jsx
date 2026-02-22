import { useNavigate } from "react-router-dom";

const CompanyJobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="border p-5 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{job.title}</h2>

      <p className="text-gray-500">
        Applicants: {job.applicants.length}
      </p>

      <p className="text-sm text-gray-500 mb-3">
        Due Date: {new Date(job.dueDate).toDateString()}
      </p>

      <button
        onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        View Applicants
      </button>
    </div>
  );
};

export default CompanyJobCard;
