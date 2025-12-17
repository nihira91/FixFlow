let io; // ✅ DECLARE IT FIRST

const initIO = (serverIO) => {
  io = serverIO;
  console.log("🟢 Socket.IO manager initialized");

  // register all sockets here
  require("./comment.socket")(io);
  //require("./employeeIssue.socket.js")(io);

  require("./employeeNotification.socket")(io);
  require("./issueUpdate.socket")(io);
};

const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.IO not initialized");
  }
  return io;
};

module.exports = {
  initIO,
  getIO
};
