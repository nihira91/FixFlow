console.log("🟡 employeeIssue.controller loaded");
const { getIO } = require("../socket");

const Issue = require('../models/issue.model');
const User = require('../models/user.model');

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, priority, location, images = [] } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      priority: priority || "Routine",
      location,
      images,
      createdBy: req.user._id,        
      status: "open",                 
      timeline: [
        {
          status: "open",
          timestamp: new Date()
        }
      ]
    });

    const io = require("../socket").getIO();
    io.to(`employee_${req.user.id}`).emit("issueCreated", issue);

    res.status(201).json({
      message: "Issue created",
      issue
    });

  } catch (err) {
    console.error("createIssue error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getEmployeeIssues = async (req, res) => {
  try {
    console.log("🟢 getEmployeeIssues HIT");
    console.log("req.user =", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status, category, page = 1, limit = 20 } = req.query;

    const filter = { createdBy: req.user.id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 }) // ✅ FIXED
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("assignedTechnician", "name email department");

    res.status(200).json({ issues });
  } catch (err) {
    console.error("getEmployeeIssues error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSingleIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTechnician', 'name email department');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    // Ensure employee only accesses own issue
    if (issue.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ issue });
  } catch (err) {
    console.error('getSingleIssue error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Update issue
    issue.status = status;
    issue.timeline.push({
      status,
      timestamp: new Date()
    });

    await issue.save();

    // 🔥 REAL-TIME EMIT
    const io = require("../socket").getIO();
    io.to(`employee_${issue.createdBy}`).emit("issueUpdated", {
      issueId: issue._id,
      status: issue.status
    });

    res.status(200).json({
      message: "Issue status updated",
      issue
    });

  } catch (err) {
    console.error("updateIssueStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
