module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Employee dashboard socket connected:", socket.id);

    socket.on("joinEmployeeRoom", (employeeId) => {
      socket.join(`employee_${employeeId}`);
      console.log(`👤 Joined employee room: employee_${employeeId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Employee dashboard socket disconnected");
    });
  });
};
