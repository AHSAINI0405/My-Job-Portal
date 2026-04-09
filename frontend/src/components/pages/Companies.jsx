import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await api.get("/api/companies/public");
    setCompanies(res.data);
  };

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Verified Companies
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <img
                src={company.logo}
                className="h-16 mb-3"
              />

              <h2 className="text-xl font-semibold">
                {company.name}
              </h2>

              <p className="text-gray-600">
                {company.industry}
              </p>

              <p className="text-sm text-gray-500">
                {company.location}
              </p>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Companies;