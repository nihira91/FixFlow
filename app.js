// app.js — TEAM MEMBER 3 (Admin, Feedback, SLA, Stats, Notification)

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const { errorMiddleware } = require("./src/utils/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

// ---------------- ROUTES (TEAM MEMBER 3 ONLY) ----------------

try {
  app.use("/api/admin", require("./src/routes/admin.routes"));
  console.log("✔ Mounted admin.routes.js");
} catch (err) {
  console.log("⚠ admin.routes.js missing");
}

try {
  app.use("/api/feedback", require("./src/routes/feedback.routes"));
  console.log("✔ Mounted feedback.routes.js");
} catch (err) {
  console.log("⚠ feedback.routes.js missing");
}

try {
  app.use("/api/sla", require("./src/routes/sla.routes"));
  console.log("✔ Mounted sla.routes.js");
} catch (err) {
  console.log("⚠ sla.routes.js missing");
}

try {
  app.use("/api/stats", require("./src/routes/stats.routes"));
  console.log("✔ Mounted stats.routes.js");
} catch (err) {
  console.log("⚠ stats.routes.js missing");
}

try {
  app.use("/api/notification", require("./src/routes/notification.routes"));
  console.log("✔ Mounted notification.routes.js");
} catch (err) {
  console.log("⚠ notification.routes.js missing");
}

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "Team Member 3 Backend OK" });
});

// Error Handler
app.use(errorMiddleware);

module.exports = app;
