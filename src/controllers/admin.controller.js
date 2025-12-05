const express=require('express');
const User = require("../models/user.model");
const Issue = require("../models/issue.model");


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    return res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: "technician" }).select("-password");
    return res.status(200).json({ technicians });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const issueId = req.params.issueId;

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.assignedTechnician = technicianId;
    issue.timeline.push({
      status: issue.status,
      timestamp: new Date(),
      note: "Technician assigned by admin",
    });

    await issue.save();

    return res.status(200).json({ message: "Technician assigned", issue });
  } catch (error) {
    console.error("Error assigning technician:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllIssuesAdmin = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "name email department")
      .populate("assignedTechnician", "name email department")
      .sort({ createdAt: -1 });

    return res.status(200).json({ issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
