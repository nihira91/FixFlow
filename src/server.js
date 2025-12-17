
// require("dotenv").config();
// const http = require("http");
// const mongoose = require("mongoose");

// const app = require("./app");



/* =======================
   Socket Imports
======================= */
// const employeeNotificationSocket = require("./socket/employeeNotification.socket");
// const issueUpdateSocket = require("./socket/issueUpdate.socket");
// const commentSocket = require("./socket/comment.socket");
// const employeeIssueSocket = require("./socket/employeeIssue.socket");

// const { Server } = require("socket.io");
// const socketManager = require("./socket");

// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// socketManager.initIO(io);

require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

/* ============================
   CONNECT TO MONGODB FIRST
============================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    /* ============================
       CREATE HTTP SERVER
    ============================ */
    const server = http.createServer(app);

    /* ============================
       SOCKET.IO SETUP
    ============================ */
    const { Server } = require("socket.io");
    const socketManager = require("./socket");

    const io = new Server(server, {
      cors: { origin: "*" }
    });

    socketManager.initIO(io);

    /* ============================
       START SERVER
    ============================ */
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });







