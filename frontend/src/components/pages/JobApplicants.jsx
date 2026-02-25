import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    const res = await api.get(`/api/company/jobs/${jobId}/applicants`);
    setApplicants(res.data);
  };

  const updateStatus = async (id, type) => {
    await api.patch(`/api/applications/${id}/${type}`);
    fetchApplicants();
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {applicants.map((app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-lg font-bold">
              {app.user?.name}
            </h2>

            <p>{app.user?.email}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => updateStatus(app._id, "shortlist")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Shortlist
              </button>

              <button
                onClick={() => updateStatus(app._id, "reject")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default JobApplicants;