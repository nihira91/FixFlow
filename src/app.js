// console.log("🟡 Registering employeeIssueRoutes");
// app.use("/api/employee/issues", employeeIssueRoutes);

// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

// const employeeAuthRoutes = require("./routes/employeeAuth.routes");
// const employeeIssueRoutes = require("./routes/employeeIssue.routes");
// const employeeCommentRoutes = require("./routes/employeeComment.routes");
// const employeeNotificationRoutes = require("./routes/employeeNotification.routes");
// const employeeDashboardRoutes = require("./routes/employeeDashboard.routes");

// const app = express();

// /* =======================
//    Global Middlewares
// ======================= */
// app.use(express.json());
// app.use(cors()); // allow all during development
// app.use(helmet());
// app.use(morgan("dev"));

// /* =======================
//    Routes
// ======================= */
// app.use("/api/employee/auth", employeeAuthRoutes);
// app.use("/api/employee/issues", employeeIssueRoutes);
// app.use("/api/employee/comments", employeeCommentRoutes);
// app.use("/api/employee/notifications", employeeNotificationRoutes);
// app.use("/api/employee/dashboard", employeeDashboardRoutes);

// /* =======================
//    Health Check
// ======================= */
// app.get("/", (req, res) => {
//   res.send("IT-IMS Backend API is running ✅");
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorMiddleware } = require("./utils/errorHandler");

/* =======================
   INIT APP
======================= */
const app = express();

/* =======================
   GLOBAL MIDDLEWARES
======================= */
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   EMPLOYEE ROUTES
======================= */
console.log("🟡 Registering Employee Routes");

try {
  const employeeAuthRoutes = require("./routes/employeeAuth.routes");
  app.use("/api/employee/auth", employeeAuthRoutes);
  console.log("✔ employeeAuth.routes.js");
} catch (err) {
  console.log("❌ employeeAuth.routes.js missing:", err.message);
}

try {
  const employeeIssueRoutes = require("./routes/employeeIssue.routes");
  app.use("/api/employee/issues", employeeIssueRoutes);
  console.log("✔ employeeIssue.routes.js");
} catch (err) {
  console.log("❌ employeeIssue.routes.js missing:", err.message);
}

try {
  const employeeCommentRoutes = require("./routes/employeeComment.routes");
  app.use("/api/employee/comments", employeeCommentRoutes);
  console.log("✔ employeeComment.routes.js");
} catch (err) {
  console.log("❌ employeeComment.routes.js missing:", err.message);
}

try {
  const employeeNotificationRoutes = require("./routes/employeeNotification.routes");
  app.use("/api/employee/notifications", employeeNotificationRoutes);
  console.log("✔ employeeNotification.routes.js");
} catch (err) {
  console.log("❌ employeeNotification.routes.js missing:", err.message);
}

try {
  const employeeDashboardRoutes = require("./routes/employeeDashboard.routes");
  app.use("/api/employee/dashboard", employeeDashboardRoutes);
  console.log("✔ employeeDashboard.routes.js");
} catch (err) {
  console.log("❌ employeeDashboard.routes.js missing:", err.message);
}

/* =======================
   TECHNICIAN ROUTES
======================= */
console.log("🟡 Registering Technician Routes");

try {
  const technicianAuthRoutes = require("./routes/technicianAuth.routes");
  app.use("/api/technician/auth", technicianAuthRoutes);
  console.log("✔ technicianAuth.routes.js");
} catch (err) {
  console.log("❌ technicianAuth.routes.js missing:", err.message);
}

try {
  const technicianIssueRoutes = require("./routes/technicianIssue.routes");
  app.use("/api/technician/issues", technicianIssueRoutes);
  console.log("✔ technicianIssue.routes.js");
} catch (err) {
  console.log("❌ technicianIssue.routes.js missing:", err.message);
}

try {
  const technicianCommentRoutes = require("./routes/technicianComment.routes");
  app.use("/api/technician/comments", technicianCommentRoutes);
  console.log("✔ technicianComment.routes.js");
} catch (err) {
  console.log("❌ technicianComment.routes.js missing:", err.message);
}

/* =======================
   AVAILABLE TECHNICIAN ROUTES
======================= */
console.log("🟡 Registering Available Technician Routes");

try {
  const availableTechnicianRoutes = require("./routes/availableTechnician.routes");
  app.use("/api/technicians", availableTechnicianRoutes);
  console.log("✔ availableTechnician.routes.js");
} catch (err) {
  console.log("❌ availableTechnician.routes.js missing:", err.message);
}

/* =======================
   Community Routes
======================= */
console.log("🟡 Registering Community Routes");

try {
  const communityRoutes = require("./routes/community.routes");
  app.use("/api/community", communityRoutes);
  console.log("✔ community.routes.js");
} catch (err) {
  console.log("❌ community.routes.js missing:", err.message);
}

/* =======================
   HEALTH CHECKS
======================= */
app.get("/", (req, res) => {
  res.send("IT-IMS Unified Backend API Running ✅");
});

app.get("/health", (req, res) => {
  res.json({
    status: "Backend OK",
    time: new Date(),
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use(errorMiddleware);

module.exports = app;

