// src/controllers/employeeComment.controller.js
const Comment = require('../models/comment.model');
const Issue = require('../models/issue.model');

// Add comment to issue (employee)
exports.addComment = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Comment message required' });

    // Verify issue exists and belongs to user or is accessible
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Employee should be creator of issue (or might be allowed to comment on any - choose policy)
    if (issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only comment on your own issues' });
    }

    const comment = await Comment.create({
      issueId: req.params.id,
      userId: req.user.id,
      message
    });

    // Optionally push into issue timeline
    issue.timeline.push({ status: issue.status, timestamp: new Date(), note: `Comment by employee` });
    await issue.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    console.error('addComment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for issue (employee)
exports.getIssueComments = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Restrict: only creator can view comments here (or permit more broadly depending on policy)
    if (issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const comments = await Comment.find({ issueId: req.params.id })
      .populate('userId', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (err) {
    console.error('getIssueComments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
