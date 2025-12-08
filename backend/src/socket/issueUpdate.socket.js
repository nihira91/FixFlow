// src/sockets/issueUpdate.socket.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Issue Update Socket Connected:", socket.id);


    socket.on("joinIssueRoom", (issueId) => {
      socket.join(`issue_${issueId}`);
      console.log(`📌 Joined Issue Room: issue_${issueId}`);
    });


    socket.on("issueUpdate", (data) => {


      io.to(`issue_${data.issueId}`).emit("receiveIssueUpdate", {
        status: data.status,
        message: data.message,
        time: new Date(),
      });

      console.log("📢 Issue Update:", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Issue socket disconnected");
    });
  });
};
