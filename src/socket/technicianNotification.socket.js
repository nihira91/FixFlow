module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Technician connected:", socket.id);

        socket.on("joinTechnicianRoom", (technicianId) => {
            socket.join('technician_${technicianId}');
            console.log('Technician joined room: technician_${technicianId}');

        });

        //send notification to technician
        socket.on("sendTechnicianNotification", (data) => {
            io.to('technician_${data.technicianId}').emit("receiveTechNotification", {
                message: data.message,

            });

            console.log("Notification sent to technician:", data);

        });

        //notify technician when issue assigned
        socket.on("issueAssigned", (data) => {
            io.to('technician_$(data.technicianId)').emit("receiveNotification", {
                message: 'New issue assigned:${data.issueTitle}',
                issueId: data.assigned,
                time: new Date()
            });

            console.log("Issue assignement notification", data);
        });

        //notify technician of comments on Issue
        socket.on("new CommentForTechnician", (data) => {
            io.to('technician_${data.technicianId}').emit("receiveTechNotification", {
                message: 'New comment on issue #${data.issueId}:${data.comment}',
                issueId: data.issueId,
                time: new Date()
            });

            console.log("Technician comment notification:", data);
        });

        //on disconnect
        socket.on("disconnect", () => {
            console.log("Technician disconnected:", socket.id);
        });
    });
};
