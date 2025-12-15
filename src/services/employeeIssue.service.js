// src/services/employeeIssue.service.js
const Issue = require('../models/issue.model');
const User = require('../models/user.model');

/**
 * Create a new issue (employee)
 * @param {Object} params { title, description, category, priority, location, images, createdBy }
 */
async function createIssue({ title, description, category, priority = 'medium', location, images = [], createdBy }) {
  const issue = await Issue.create({
    title,
    description,
    category,
    priority,
    location,
    images,
    createdBy,
    timeline: [{ status: 'open', timestamp: new Date() }]
  });
  return issue;
}

/**
 * Get issues created by an employee with optional filters & pagination
 * @param {String} employeeId
 * @param {Object} options { status, category, page, limit }
 */
async function getIssuesByEmployee(employeeId, options = {}) {
  const { status, category, page = 1, limit = 20 } = options;
  const filter = { createdBy: employeeId };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const issues = await Issue.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('assignedTechnician', 'name email department');

  const total = await Issue.countDocuments(filter);
  return { issues, total, page: Number(page), limit: Number(limit) };
}

/**
 * Get single issue (employee view)
 * @param {String} issueId
 */
async function getIssueById(issueId) {
  return Issue.findById(issueId)
    .populate('createdBy', 'name email')
    .populate('assignedTechnician', 'name email department');
}

/**
 * Helper: add timeline entry to issue
 * @param {String} issueId
 * @param {Object} entry { status, note }
 */
async function pushTimeline(issueId, entry = {}) {
  const issue = await Issue.findById(issueId);
  if (!issue) throw new Error('Issue not found');
  issue.timeline.push({
    status: entry.status || issue.status,
    timestamp: entry.timestamp || new Date(),
    note: entry.note || null
  });
  await issue.save();
  return issue;
}

module.exports = {
  createIssue,
  getIssuesByEmployee,
  getIssueById,
  pushTimeline
};
