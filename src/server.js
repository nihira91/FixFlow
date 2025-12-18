require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

/* ============================
   ENV CONFIG
============================ */
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/it_ims";

/* ============================
   CREATE HTTP SERVER
============================ */
const server = http.createServer(app);

/* ============================
   SOCKET.IO SETUP
============================ */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log("🧠 Socket.IO initialized");

/* ============================
   LOAD SOCKET MODULES
============================ */
try {
  const socketManager = require("./socket");
  socketManager.initIO(io);
  console.log("✔ socket/index.js loaded");
} catch (err) {
  console.log("❌ socket/index.js missing:", err.message);
}

try {
  const technicianSocket = require("./socket/technicianNotification.socket");
  technicianSocket(io);
  console.log("✔ technicianNotification.socket.js loaded");
} catch (err) {
  console.log("❌ technicianNotification.socket.js missing:", err.message);
}

/* ============================
   CONNECT TO MONGODB & START
============================ */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Unified Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

module.exports = { server, io };
