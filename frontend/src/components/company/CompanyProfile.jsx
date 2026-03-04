import { useEffect, useState } from "react";
import api from "../../api/axios";
import CompanyNavbar from "../../common/CompanyNavbar";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    description: "",
    location: "",
    logo: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const locationHook = useLocation();
  const [alertMessage, setAlertMessage] = useState("");

  // ================= ALERT FROM ROUTE =================
  useEffect(() => {
    if (locationHook.state?.message) {
      setAlertMessage(locationHook.state.message);
      setTimeout(() => setAlertMessage(""), 4000);
    }
  }, [locationHook]);

  // ================= FETCH COMPANY =================
  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profile/company");
      console.log("Response fetched:",res)
      const company = res.data;

      setFormData({
        name: company.name || "",
        website: company.website || "",
        industry: company.industry || "",
        description: company.description || "",
        location: company.location || "",
        logo: company.logo || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGO UPLOAD =================
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result });
    };

    if (file) reader.readAsDataURL(file);
  };

  // ================= SAVE PROFILE =================
const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const res = await api.put("/api/profile/company", formData);
    
    // ✅ 1. Update localStorage user object
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...storedUser,
      profileCompleted: true,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    // ✅ 2. Success Toast
    toast.success("Profile updated successfully 🚀");

    setEditing(false);
    fetchCompanyProfile();

  } catch (error) {
    toast.error("Failed to update profile ❌");
    console.error(error);
  } finally {
    setSaving(false);
  }
};

  // ================= LOADING UI =================
  if (loading) {
    return (
      <>
        <CompanyNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-700 animate-bounce"></div>
            <div className="w-8 h-8 rounded-full bg-green-500 animate-bounce delay-100"></div>
            <div className="w-8 h-8 rounded-full bg-sky-400 animate-bounce delay-200"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CompanyNavbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">

          {alertMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {alertMessage}
            </div>
          )}

          {editing ? (
            // ================= EDIT MODE =================
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Edit Company Profile</h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Logo Upload */}
                <div className="flex items-center gap-6">
                  <img
                    src={formData.logo || "https://via.placeholder.com/120"}
                    alt="Company Logo"
                    className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-100"
                  />

                  <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                    Change Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
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

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          ) : (
            // ================= VIEW MODE =================
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <div className="flex justify-between items-center mb-6">

                <div className="flex items-center gap-6">
                  <img
                    src={formData.logo || "https://via.placeholder.com/120"}
                    alt="Company Logo"
                    className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-100"
                  />
                  <h1 className="text-2xl font-bold">
                    {formData.name || "Company Name"}
                  </h1>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Edit Profile
                </button>

              </div>

              <div className="space-y-3 text-gray-700">
                <p>🏢 {formData.industry || "Industry not added"}</p>
                <p>📍 {formData.location || "Location not added"}</p>
                <p>🌐 {formData.website || "Website not added"}</p>

                <div className="mt-4">
                  <p className="font-medium">About Company:</p>
                  <p className="text-gray-600 mt-2">
                    {formData.description || "Company description not added"}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;