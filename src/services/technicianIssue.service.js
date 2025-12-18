const Issue = require("../models/issue.model");

exports.getAssignedIssuesService = async (technicianId) => {
    return await Issue.find({ assignedTo: technicianId })
        .sort({ createdAt: -1 });
};

exports.getIssueByIdService = async (issueId) => {
    return await Issue.findById(issueId)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

};


exports.updateIssueStatusService = async (issueId, status, note, fileUrls) => {
    const updateData = { status };

    updateData.$push = {
        timeline: {
            status,
            note,
            timestamp: new Date(),
        }
    };

    if (fileUrls && fileUrls.length > 0) {
        updateData.$addToSet = { workProof: { $each: fileUrls } };

    }
    return await Issue.findByIdAndUpdate(issueId, updateData, { new: true });
};