

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected to notifications:", socket.id);

    
    socket.on("joinNotificationRoom", (userId) => {
      const room = `notify_${userId}`;
      socket.join(room);
      console.log(`📌 User joined room: ${room}`);
    });

    
    socket.on("sendNotification", (data) => {
      

      io.to(`notify_${data.userId}`).emit("receiveNotification", {
        message: data.message,
        type: data.type || "general",
        issueId: data.issueId || null,
        time: new Date(),
      });

      console.log("📨 Notification sent:", data);
    });

    
    socket.on("broadcastNotification", (data) => {
      

      io.emit("receiveNotification", {
        message: data.message,
        type: data.type || "system",
        time: new Date(),
      });

      console.log("📢 Broadcast notification:", data);
    });

    
    socket.on("disconnect", () => {
      console.log("❌ Notification socket disconnected:", socket.id);
    });
  });
};
