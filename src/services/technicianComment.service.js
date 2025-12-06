const Comment = require("../models/comment.model");
exports.addCommentService = async (issueId, useId, role, Message, files) => {
    const attachments = files?.length ? files.map(f => f.path) : [];

    const comment = await Comment.create({
        issueId,
        userId,
        role,
        message,
        attachments
    });

    return comment;
};

exports.getIssueCommentsService = async (issueId) => {
    return await Comment.find({ issueId })
        .sort({ createdAt: -1 })
        .populate("userId", "name email role");

};