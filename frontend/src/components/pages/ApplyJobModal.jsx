import { useState } from "react";
import api from "../../api/axios";

const ApplyJobModal = ({ job, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);
      await api.post(`/api/jobs/${job._id}/apply`);
      alert("Application submitted successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Already applied");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Apply for {job.title}
        </h2>

        <p className="text-gray-600 mb-6">
          Your profile details will be submitted with this application.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            {loading ? "Applying..." : "Confirm Apply"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;