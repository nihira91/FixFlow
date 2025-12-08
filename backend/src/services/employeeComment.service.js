// src/services/employeeComment.service.js
const Comment = require('../models/comment.model');
const Issue = require('../models/issue.model');

/**
 * Add comment by employee to an issue
 * @param {String} issueId
 * @param {String} userId
 * @param {String} message
 */
async function addComment(issueId, userId, message) {
  const issue = await Issue.findById(issueId);
  if (!issue) throw new Error('Issue not found');

  // Policy: allow only creator to comment (adjust if you'd like)
  if (issue.createdBy.toString() !== userId) {
    throw new Error('Not allowed to comment on this issue');
  }

  const comment = await Comment.create({
    issueId,
    userId,
    message
  });

  // push to timeline for traceability
  issue.timeline.push({
    status: issue.status,
    timestamp: new Date(),
    note: `Comment by employee: ${message.substring(0, 60)}`
  });
  await issue.save();

  return comment;
}

/**
 * Get comments for an issue (employee permitted)
 * @param {String} issueId
 */
async function getCommentsForIssue(issueId) {
  const comments = await Comment.find({ issueId })
    .populate('userId', 'name role')
    .sort({ createdAt: -1 });
  return comments;
}

module.exports = {
  addComment,
  getCommentsForIssue
};
