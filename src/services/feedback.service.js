

const Feedback = require("../models/feedback.model");

exports.submitFeedbackService = async (issueId, userId, message, rating) => {
  return await Feedback.create({
    issueId,
    userId,
    message,
    rating,
  });
};

exports.getFeedbackForIssueService = async (issueId) => {
  return await Feedback.find({ issueId }).populate("userId", "name email");
};

exports.getAllFeedbackService = async () => {
  return await Feedback.find()
    .populate("userId", "name")
    .populate("issueId", "title");
};
