const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorMiddleware } = require("./src/utils/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// ROUTES LOADING WITH SAFE TRY-CATCH
// ============================

try {
    const technicianAuthRoutes = require("./src/routes/technicianAuth.routes");
    app.use("/api/technician/auth", technicianAuthRoutes);
    console.log("✔ Mounted: technicianAuth.routes.js");
} catch (err) {
    console.log("❌ technicianAuth.routes.js missing:", err.message);
}

try {
    const technicianIssueRoutes = require("./src/routes/technicianIssue.routes");
    app.use("/api/technician/issues", technicianIssueRoutes);
    console.log("✔ Mounted: technicianIssue.routes.js");
} catch (err) {
    console.log("❌ technicianIssue.routes.js missing:", err.message);
}

try {
    const technicianCommentRoutes = require("./src/routes/technicianComment.routes");
    app.use("/api/technician/comments", technicianCommentRoutes);
    console.log("✔ Mounted: technicianComment.routes.js");
} catch (err) {
    console.log("❌ technicianComment.routes.js missing:", err.message);
}


// Health route
app.get("/health", (req, res) => {
    res.json({
        status: "Technician backend OK",
        time: new Date(),
    });
});

// Global Error Handler
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Technician Backend Running...");
});


module.exports = app;







