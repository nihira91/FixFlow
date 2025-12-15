const Notification = require("../models/notifications.model");


exports.getEmployeeNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      employeeId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error("getEmployeeNotifications error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { employeeId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("markAllAsRead error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.markOneAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    console.error("markOneAsRead error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
