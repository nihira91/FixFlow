require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5002;

// Your URI had a semicolon → "127.0.0.1;27017" (WRONG)
// Correct MongoDB URI:
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/technician_module";

const server = http.createServer(app);

// ---------------- SOCKET.IO SETUP ----------------
let io;
try {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });

    console.log("Socket.IO initialised");

    // Load technician notification socket
    const technicianSocket = require("./src/socket/technicianNotification.socket");
    technicianSocket(io);
    console.log("technicianNotification.socket.js loaded");
} catch (err) {
    console.log("Socket.IO setup failed:", err.message);
}

// ---------------- MONGOOSE CONNECTION ----------------
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected (Technician Module DB)");

        server.listen(PORT, () => {
            console.log(`Technician server running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

module.exports = { server, io };
