
const Issue = require("../models/issue.model");


exports.calculateSLAForIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const openTime = issue.timeline.find((t) => t.status === "open")?.timestamp;
    const resolvedTime = issue.timeline.find((t) => t.status === "resolved")?.timestamp;

    if (!openTime || !resolvedTime)
      return res.status(400).json({ message: "SLA incomplete (open or resolved timestamp missing)" });

    const diffHours = Math.round((resolvedTime - openTime) / (1000 * 60 * 60) * 100) / 100;

    return res.status(200).json({ issueId: issue._id, slaHours: diffHours });
  } catch (error) {
    console.error("Error calculating SLA:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getTechnicianSLAReport = async (req, res) => {
  try {
    const issues = await Issue.find({ assignedTechnician: req.params.id });

    let totalMs = 0;
    let count = 0;

    issues.forEach((issue) => {
      const open = issue.timeline.find((t) => t.status === "open");
      const resolved = issue.timeline.find((t) => t.status === "resolved");
      if (open && resolved) {
        totalMs += (resolved.timestamp - open.timestamp);
        count++;
      }
    });

    const avgHours = count ? Math.round((totalMs / count) / (1000 * 60 * 60) * 100) / 100 : 0;

    return res.status(200).json({ technicianId: req.params.id, avgSLAHours: avgHours, count });
  } catch (error) {
    console.error("Error generating SLA report:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getDepartmentSLAReport = async (req, res) => {
  try {
    const dept = req.params.name; 
    const issues = await Issue.find({ "department": dept }); 

    let totalMs = 0;
    let count = 0;

    issues.forEach((issue) => {
      const open = issue.timeline.find((t) => t.status === "open");
      const resolved = issue.timeline.find((t) => t.status === "resolved");
      if (open && resolved) {
        totalMs += (resolved.timestamp - open.timestamp);
        count++;
      }
    });

    const avgHours = count ? Math.round((totalMs / count) / (1000 * 60 * 60) * 100) / 100 : 0;
    return res.status(200).json({ department: dept, avgSLAHours: avgHours, count });
  } catch (error) {
    console.error("Error generating department SLA report:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
