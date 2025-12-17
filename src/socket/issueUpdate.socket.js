//  module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("🟢 Socket connected:", socket.id);

//     /* ================= ISSUE ROOM ================= */

//     socket.on("joinIssueRoom", (issueId) => {
//       socket.join(`issue_${issueId}`);
//       console.log(`📌 Joined issue room: issue_${issueId}`);
//     });

//     socket.on("issueUpdate", (data) => {
//       io.to(`issue_${data.issueId}`).emit("receiveIssueUpdate", {
//         issueId: data.issueId,
//         status: data.status,
//         message: data.message,
//         time: new Date(),
//       });

//       console.log("📢 Issue Update:", data);
//     });

//     /* ================= EMPLOYEE DASHBOARD ================= */

//     socket.on("joinEmployeeRoom", (employeeId) => {
//       socket.join(`employee_${employeeId}`);
//       console.log(`👤 Joined employee room: employee_${employeeId}`);
//     });

//     /* ================= DISCONNECT ================= */

//     socket.on("disconnect", () => {
//       console.log("🔴 Socket disconnected:", socket.id);
//     });
//   });
// };

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    /* ================= ISSUE ROOM ================= */

    socket.on("joinIssueRoom", (issueId) => {
      socket.join(`issue_${issueId}`);
      console.log(`📌 Joined issue room: issue_${issueId}`);
    });

    socket.on("issueUpdate", (data) => {
      io.to(`issue_${data.issueId}`).emit("receiveIssueUpdate", {
        issueId: data.issueId,
        status: data.status,
        message: data.message,
        time: new Date(),
      });

      console.log("📢 Issue Update:", data);
    });

    /* ================= EMPLOYEE DASHBOARD ================= */

    socket.on("joinEmployeeRoom", (employeeId) => {
      socket.join(`employee_${employeeId}`);
      console.log(`👤 Joined employee room: employee_${employeeId}`);
    });

    /* ================= DISCONNECT ================= */

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};
