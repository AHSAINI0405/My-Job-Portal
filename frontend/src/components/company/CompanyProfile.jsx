import { useEffect, useState } from "react";
import api from "../../api/axios";
import CompanyNavbar from "../../common/CompanyNavbar";

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    description: "",
    location: "",
    logo: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const res = await api.get("/company/profile");
      setFormData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Logo Upload (Base64 simple method)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/profile/company", formData);
      alert("Profile Updated Successfully 🚀");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // ===== PROFILE COMPLETION CALCULATION =====
  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filled = fields.filter((field) => field && field !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <>
      <CompanyNavbar />

      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE FORM */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            Complete Company Profile
          </h1>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1 text-sm">
              <span>Profile Completion</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium">
                Company Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-2"
              />
            </div>

            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="url"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <textarea
              name="description"
              placeholder="Company Description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </form>
        </div>

        {/* RIGHT SIDE LIVE PREVIEW */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6">
            Profile Preview
          </h2>

          <div className="border rounded-xl p-6 space-y-4">

            {formData.logo && (
              <img
                src={formData.logo}
                alt="Company Logo"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}

            <h3 className="text-2xl font-semibold">
              {formData.name || "Company Name"}
            </h3>

            <p className="text-gray-600">
              {formData.industry || "Industry"}
            </p>

            <p className="text-sm text-gray-500">
              📍 {formData.location || "Location"}
            </p>

            <p className="text-sm text-blue-600">
              🌐 {formData.website || "Website"}
            </p>

            <p className="text-gray-700 mt-4">
              {formData.description || "Company description will appear here..."}
            </p>

          </div>
        </div>

      </div>
    </>
  );
};

export default CompanyProfile;