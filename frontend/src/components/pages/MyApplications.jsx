import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
  try {
    setLoading(true);

    const res = await api.get("/api/applications/me");
    setApplications(res.data);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="flex gap-4">

          <div className="wave w-8 h-8 rounded-full bg-indigo-700"></div>

          <div className="wave w-8 h-8 rounded-full bg-green-500"></div>

          <div className="wave w-8 h-8 rounded-full bg-sky-400"></div>

          <div className="wave w-8 h-8 rounded-full bg-yellow-400"></div>

        </div>

      </div>

    </>
  );
}
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
             <p className="text-sm">
              {app.job?.description}
            </p>
             <h3 className="font-bold text-l">
              {app.company?.name}
            </h3>
             <p className="text-sm">
              Due Date: {new Date(app.job?.dueDate).toDateString()}
            </p>
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