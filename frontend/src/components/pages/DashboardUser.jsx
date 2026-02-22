import { useState } from "react";
import Navbar from "../../common/Navbar";

const DashboardUser = () => {
  const [applied, setApplied] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* ✅ Navbar Full Width */}
      <Navbar username={user?.name || "User"} />

      {/* ✅ Page Content Container */}
      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Applications
        </h1>

        {applied.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <p className="text-gray-500 text-lg">
              No jobs applied yet 🚀
            </p>
          </div>
        )}

        <div className="space-y-5">
          {applied.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {app.job.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {app.job.company.name}
              </p>

              <div className="mt-3">
                <span className="inline-block bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium">
                  Status: Applied
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default DashboardUser;