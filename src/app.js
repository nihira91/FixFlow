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

/* =======================
   INIT APP (VERY IMPORTANT)
======================= */
const app = express();

/* =======================
   ROUTE IMPORTS
======================= */
const employeeAuthRoutes = require("./routes/employeeAuth.routes");
const employeeIssueRoutes = require("./routes/employeeIssue.routes");
const employeeCommentRoutes = require("./routes/employeeComment.routes");
const employeeNotificationRoutes = require("./routes/employeeNotification.routes");
const employeeDashboardRoutes = require("./routes/employeeDashboard.routes");

/* =======================
   GLOBAL MIDDLEWARES
======================= */
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

/* =======================
   ROUTES
======================= */
console.log("🟡 Registering employee routes");

app.use("/api/employee/auth", employeeAuthRoutes);
app.use("/api/employee/issues", employeeIssueRoutes);
app.use("/api/employee/comments", employeeCommentRoutes);
app.use("/api/employee/notifications", employeeNotificationRoutes);
app.use("/api/employee/dashboard", employeeDashboardRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("IT-IMS Backend API is running ✅");
});

module.exports = app;
