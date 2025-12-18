const Comment = require("../models/comment.model");
const Issue = require("../models/issue.model");

exports.addTechComment = async (req, res) => {
    try {
        const { id: issueId } = req.params;
        const { message } = req.body;
        const technicianId = req.user._id;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: "Comment message isrequired" });

        }

        const issue = await Issue.findById(issueId);

        if (!issue)
            return res.status(404).json({ message: "Issue not found" });

        //check if technician is assigned to this issue
        if (!issue.assignedTechnician || issue.assignedTechnician.toString() != technicianId.toString()) {
            return res.status(403).json({
                message: "You are not assigned to this issue"
            });
        }

        //save comment
        const comment = await Comment.create({
            issueId,
            userId: technicianId,
            message,
            role: "technician"
        });

        //update timeline
        issue.timeline.push({
            status: issue.status,
            timestamp: new Date(),
            note: 'Technician comment :${message.substring(0, 60)}'
        });

        await issue.save();

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
        });

    } catch (error) {
        console.error("Technician comment error:", error);
        return res.status(500).json({ message: "Server erro" });

    }
};


//technician fetches comments for an issue

exports.getTechIssueComments = async (req, res) => {
    try {
        const { id: issueId } = req.params;
        const technicianId = req.user._id;

        const issue = await Issue.findById(issueId);
        if (!issue)
            return res.status(404).json({ message: "Issue not found" });


        //only assigned technician can view comments
        if (!issue.assignedTechnician || issue.assignedTechnician.toString() !== technicianId.toString()) {
            return res.status(403).json({
                message: "You are not assigned to this issue"
            });
        }

        const comments = await Comment.find({ issueId })
            .populate("userId", "name role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments,
        });

    } catch (error) {
        console.error("Fetch technician comments error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};