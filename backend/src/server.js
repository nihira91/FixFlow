
// const http = require("http");
// const app = require("./app");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const socketIO = require("socket.io");

// const server = http.createServer(app);

// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// // const employeeNotificationSocket = require("./src/socket/employeeNotification.socket");
// const issueUpdateSocket = require("./src/socket/issueUpdate.socket");
// const commentSocket = require("./src/socket/comment.socket");

// employeeNotificationSocket(io);
// issueUpdateSocket(io);
// commentSocket(io);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected (Employee Module)"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));


// const PORT = process.env.PORT || 5001;

// server.listen(PORT, () => {
//   console.log(`Employee Server Running on Port: ${PORT}`);
// });

const http = require("http");
const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");

const socketIO = require("socket.io");

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Correct socket paths
const employeeNotificationSocket = require("./socket/employeeNotification.socket");
const issueUpdateSocket = require("./socket/issueUpdate.socket");
const commentSocket = require("./socket/comment.socket");

// Initialize sockets
employeeNotificationSocket(io);
issueUpdateSocket(io);
commentSocket(io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Employee Module)"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Employee Server Running on Port: ${PORT}`);
});

