// src/sockets/comment.socket.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Comment Socket Connected:", socket.id);
 
    socket.on("joinCommentRoom", (issueId) => {
      socket.join(`comments_${issueId}`);
      console.log(`💬 Joined Comment Room: comments_${issueId}`);
    });

    socket.on("newComment", (data) => {
      

      io.to(`comments_${data.issueId}`).emit("receiveComment", {
        comment: data.comment,
        user: data.user,
        role: data.role,
        time: new Date(),
      });

      console.log("💬 New Comment Broadcast:", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Comment socket disconnected");
    });
  });
};
