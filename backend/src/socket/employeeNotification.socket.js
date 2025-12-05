module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Employee connected:", socket.id);
    socket.on("joinEmployeeRoom", (userId) => {
      socket.join(`emp_${userId}`);
      console.log(`Employee joined room: emp_${userId}`);
    });

    socket.on("sendEmployeeNotification", (data) => {
      

      io.to(`emp_${data.userId}`).emit("receiveEmployeeNotification", {
        message: data.message,
        issueId: data.issueId || null,
        time: new Date(),
      });

      console.log("🔔 Employee Notification Sent:", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Employee socket disconnected:", socket.id);
    });
  });
};