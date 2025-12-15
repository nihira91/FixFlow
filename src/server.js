// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authroutes");
// const employeeRoutes = require("./routes/employeeroutes");
// const technicianRoutes = require("./routes/technicianroutes");
// const adminRoutes = require("./routes/adminroutes");

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(express.static("src/public"));


// app.get("/", (req, res) => {
//   res.send("IT-IMS Backend Running Successfully ✔");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/employee", employeeRoutes);
// app.use("/api/technician", technicianRoutes);
// app.use("/api/admin", adminRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

/* =======================
   Socket Imports
======================= */
const employeeNotificationSocket = require("./socket/employeeNotification.socket");
const issueUpdateSocket = require("./socket/issueUpdate.socket");
const commentSocket = require("./socket/comment.socket");

/* =======================
   HTTP Server
======================= */
const server = http.createServer(app);

/* =======================
   Socket.IO Setup
======================= */
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

/* =======================
   Initialize Sockets
======================= */
employeeNotificationSocket(io);
issueUpdateSocket(io);
commentSocket(io);

/* =======================
   Database Connection
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Unified IT-IMS Server running at http://localhost:${PORT}`);
});
