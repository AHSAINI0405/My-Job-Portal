import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../common/Navbar";
const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
    location: "",
    resume: "",
    avatar: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/api/profile/user");
    console.log(res);
    const user = res.data;

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      education: user.education || "",
      skills: user.skills ? user.skills.join(", ") : "",
      experience: user.experience || "",
      location: user.location || "",
      resume: user.resume || "",
      avatar: user.avatar || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Avatar Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  // Resume Upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, resume: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await api.put("/api/profile/user", {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
    });

    setEditing(false);
    fetchProfile();
    setSaving(false);
  };

  return (
    <><Navbar/>
   
    
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {editing ? (
          /* ================= EDIT FORM ================= */
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <img
                  src={formData.avatar || "https://via.placeholder.com/120"}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100"
                />

                <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name (Readonly) */}
              <input
                type="text"
                value={formData.name}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
              />

              {/* Phone */}
              <div className="flex gap-3">
                <select
                  name="countryCode"
                  value={formData.countryCode || "+1"}
                  onChange={handleChange}
                  className="p-3 border rounded-lg bg-white cursor-pointer"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+81">🇯🇵 +81</option>
                </select>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 p-3 border rounded-lg"
                />
              </div>

              {/* Other Inputs */}
              <input
                type="text"
                name="education"
                placeholder="Education"
                value={formData.education}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="text"
                name="experience"
                placeholder="Experience"
                value={formData.experience}
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

              {/* Resume Upload */}
              <div>
                <label className="block font-medium mb-2">
                  Resume (PDF)
                </label>

                <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition">
                  Choose PDF File
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= PROFILE VIEW ================= */
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-6">
                <img
                  src={formData.avatar || "https://via.placeholder.com/120"}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100"
                />
                <h1 className="text-2xl font-bold">
                  {formData.name}
                </h1>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>📞 {formData.countryCode || ""} {formData.phone || "Not added"}</p>
              <p>🎓 {formData.education || "Not added"}</p>
              <p>💼 {formData.experience || "Not added"}</p>
              <p>📍 {formData.location || "Not added"}</p>

              <div>
                <p className="font-medium">Skills:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills
                    ? formData.skills.split(",").map((skill, i) => (
                        <span
                          key={i}
                          className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                        >
                          {skill.trim()}
                        </span>
                      ))
                    : <span className="text-gray-400">No skills</span>}
                </div>
              </div>

              {formData.resume && (
                <div className="mt-6">
                  <p className="font-medium mb-2">Resume Preview:</p>
                  <iframe
                    src={formData.resume}
                    title="Resume"
                    className="w-full h-72 border rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
      </>
  );
};

export default UserProfile;