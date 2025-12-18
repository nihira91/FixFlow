const Issue = require('../models/issue.model');
const User = require('../models/user.model');

exports.getAssignedIssues = async (requestAnimationFrame, res) => {
    try {
        const technicianId = requestAnimationFrame.user.id;
        const issues = await Issue.find({
            assignedTechnician: technicianId
        })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email floor deskId')
            .populate('assignedTechhnician', 'name email department');

        return res.status(200).json({ issues });

    } catch (error) {
        console.error("Error fetching assigned issues:", error);
        return res.status(500).json({ message: "Server error fetching issues" });
    }
};


exports.getTechhnicianIssueDetails = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('assignedTechnician', 'name email');

        if (!issue)
            return res.status(404).json({ message: "Issue not found" });

        //only assigned technician can view
        if (issue.assignedTechnician?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to view this issue" });

        }

        return res.status(200).json({ issue });
    } catch (error) {
        console.error("Error fetching issue:", error);
        return res.status(500).json({ message: "server error" });
    }
};

//update issue status
exports.updateIssueStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const technicianId = req.user.id;
        const issue = await Issue.findById(req.params.id);

        if (!issue)
            return res.status(404).json({ message: "Issue not found" });
        //only assigned technician can uppdtae
        if (issue.assignedTechnician?.toString() !== technicianId) {
            return res.status(403).json({ message: "Not authorized to update this issue" });

        }
        issue.status = status;

        issue.timeline.push({
            status,
            timestamp: new Date(),
            note: note || 'status updated to ${status} by technician',
        });
        await issue.save();

        return res.status(200).json({ message: "Issue status updated", issue });

    } catch (error) {
        console.error("Error updating issue status:", error);
        return res.status(500).json({ message: "Server error updating status" });
    }
};


//upload proof
exports.uploadProof = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue)
            return res.status(404).json({ message: "Issue not found" });

        if (issue.assignedTechnician?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to upload proof" });
        }

        const proofImages = req.files?.map(file => file.path) || [];

        issue.proof = [...issue.proof, ...proofImages];

        issue.timeline.push({
            status: issue.status,
            timestamp: new Date(),
            note: "Proof uploaded by technician"
        });

        await issue.save();

        return res.status(200).json({ message: "Proof uploaded successfully", proof: issue.proof });

    } catch (error) {
        console.error("Error uploading proof:", error);
        return res.status(500).json({ message: "Server error uploading proof" });
    }
};


//add technician note
exports.addTechnicianNote = async (req, res) => {
    try {
        const { note } = req.body;

        if (!note)
            return res.status(400).json({ message: "Note is required" });

        const issue = await Issue.findById(req.params.id);

        if (!issue)
            return res.status(404).json({ message: "Issue not found" });

        if (issue.assignedTechnician?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        issue.timeline.push({
            status: issue.status,
            timestamp: new Date,
            note: 'Technician note:${note'
        });

        await issue.save();

        res.status(200).json({ message: "Note added", issue });
    } catch (error) {
        console.error("Error adding technician note:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
