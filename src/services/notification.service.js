

const Notification = require("../models/notification.model");

exports.createNotificationService = async (userId, message, issueId = null) => {
  return await Notification.create({
    userId,
    message,
    issueId,
  });
};

exports.getUserNotificationsService = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

exports.markAllAsReadService = async (userId) => {
  return await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );
};
