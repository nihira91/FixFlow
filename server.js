// server.js — TEAM MEMBER 3

require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5003;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/team_member_3_db";

const server = http.createServer(app);

// Socket.io Setup
let io;

try {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  const notificationSocket = require("./src/sockets/notification.socket");
  notificationSocket(io);

  console.log("✔ Socket.IO running for notifications");
} catch (err) {
  console.log("⚠ Socket.io failed to initialize");
}

// MongoDB + Server Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✔ MongoDB Connected — Team Member 3 DB");

    server.listen(PORT, () => {
      console.log(`🚀 Team Member 3 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });
