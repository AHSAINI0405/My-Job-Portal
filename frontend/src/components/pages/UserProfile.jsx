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

        {/* EDIT FORM */}
        {editing && (
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <img
                  src={formData.avatar || "https://via.placeholder.com/100"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>

              <input
                type="text"
                value={formData.name}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

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

              <div>
                <label className="block text-sm font-medium">
                  Upload Resume (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* PROFILE VIEW */}
        <div className="bg-white shadow-xl rounded-2xl p-8">

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-5">
              <img
                src={formData.avatar || "https://via.placeholder.com/100"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <h1 className="text-2xl font-bold">
                {formData.name}
              </h1>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>📞 {formData.phone || "Not added"}</p>
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

            {/* PDF Viewer */}
            {formData.resume && (
              <div className="mt-6">
                <p className="font-medium mb-2">Resume Preview:</p>
                <iframe
                  src={formData.resume}
                  title="Resume"
                  className="w-full h-96 border rounded-lg"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;