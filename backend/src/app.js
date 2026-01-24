const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json()); // allows JSON body

// ================= DATABASE =================
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ DB error", err));

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/jobs", require("./routes/job.routes"));
app.use("/api", require("./routes/application.routes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/ai", require("./routes/ai.routes"));
app.use("/api/email", require("./routes/email.routes"));
app.use("/api/admin", require("./routes/admin.routes"));


module.exports = app;
