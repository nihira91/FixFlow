

const User = require("../models/user.model");
const Issue = require("../models/issue.model");

exports.getAllUsersService = async () => {
  return await User.find().select("-password");
};

exports.createUserService = async (data) => {
  const user = new User(data);
  return await user.save();
};

exports.deleteUserService = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

exports.getAdminStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalIssues = await Issue.countDocuments();
  const resolved = await Issue.countDocuments({ status: "resolved" });
  const pending = await Issue.countDocuments({ status: "pending" });

  return {
    totalUsers,
    totalIssues,
    resolved,
    pending,
  };
};
