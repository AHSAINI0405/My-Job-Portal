import { useNavigate } from "react-router-dom";

const CompanyJobCard = ({ job }) => {
  const navigate = useNavigate();

  const isExpired = job.status === "expired";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {job.title}
        </h2>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isExpired
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {job.status}
        </span>
      </div>

      {/* Job Info */}
      <div className="space-y-2 text-sm text-gray-600 mb-5">
        <p>
          📍 <span className="font-medium">{job.location || "Not specified"}</span>
        </p>

        <p>
          💼 <span className="font-medium">{job.jobType || "Not specified"}</span>
        </p>

        <p>
          💰 <span className="font-medium">{job.salary || "Not disclosed"}</span>
        </p>

        <p>
          ⏳ Due:{" "}
          <span className="font-medium">
            {new Date(job.dueDate).toDateString()}
          </span>
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        View Applicants
      </button>
    </div>
  );
};

export default CompanyJobCard;