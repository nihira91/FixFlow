
const Issue = require("../models/issue.model");
const { success } = require("../utils/response");
//const { APIError } = require("../utils/errorHandler");

exports.getEmployeeDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const total = await Issue.countDocuments({ createdBy: userId });
    const open = await Issue.countDocuments({ createdBy: userId, status: "open" });
    const inProgress = await Issue.countDocuments({ createdBy: userId, status: "in-progress" });
    const resolved = await Issue.countDocuments({ createdBy: userId, status: "resolved" });

    return success(res, "Dashboard stats loaded", {
      total,
      open,
      inProgress,
      resolved
    });
  } catch (err) {
    next(new APIError("Failed to load dashboard", 500));
  }
};
