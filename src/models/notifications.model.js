const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
