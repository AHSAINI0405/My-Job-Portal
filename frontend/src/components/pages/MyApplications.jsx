import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await api.get("/api/applications/me");
    setApplications(res.data);
  };

  return (
    <>
    <Navbar/>
        
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h2 className="font-bold text-lg">
              {app.job?.title}
            </h2>

            <p className="text-gray-500">
              Status:{" "}
              <span className={`font-semibold ${
                app.status === "shortlisted"
                  ? "text-green-600"
                  : app.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
                {app.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default MyApplications;