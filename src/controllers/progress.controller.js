/**
 * Progress Update Controller
 * Handles technician progress updates on issues
 */

const Issue = require('../models/issue.model');
const User = require('../models/user.model');
const { getIO } = require('../socket');

/**
 * Add progress update from technician
 * POST /api/progress/add
 */
exports.addProgressUpdate = async (req, res) => {
  try {
    const { issueId, message } = req.body;
    const technicianId = req.user._id;

    if (!issueId || !message) {
      return res.status(400).json({ message: 'Issue ID and message required' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify technician is assigned to this issue
    if (issue.assignedTechnician.toString() !== technicianId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this issue' });
    }

    // Create progress update object
    const progressUpdate = {
      _id: new (require('mongoose')).Types.ObjectId(),
      technician: technicianId,
      message: message,
      timestamp: new Date(),
      type: 'progress'
    };

    // Add to timeline
    if (!issue.progressUpdates) {
      issue.progressUpdates = [];
    }
    issue.progressUpdates.push(progressUpdate);
    issue.updatedAt = new Date();

    await issue.save();

    // Populate technician data for response
    await issue.populate('progressUpdates.technician', 'name email');

    // 📢 NOTIFY EMPLOYEE IN REAL-TIME
    const io = getIO();
    const technician = await User.findById(technicianId).select('name email');
    
    io.to(`employee_${issue.createdBy}`).emit('progressUpdate', {
      issueId: issue._id,
      issueTitle: issue.title,
      technician: {
        name: technician.name,
        email: technician.email
      },
      message: message,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Progress update added successfully',
      update: progressUpdate,
      issue: issue
    });

  } catch (error) {
    console.error('Error adding progress update:', error);
    res.status(500).json({ message: 'Error adding progress update' });
  }
};

/**
 * Get all progress updates for an issue
 * GET /api/progress/:issueId
 */
exports.getProgressUpdates = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId)
      .populate('progressUpdates.technician', 'name email profileImage');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify user has access (employee or assigned technician)
    const isEmployee = issue.createdBy.toString() === req.user._id.toString();
    const isTechnician = issue.assignedTechnician?.toString() === req.user._id.toString();

    if (!isEmployee && !isTechnician) {
      return res.status(403).json({ message: 'Not authorized to view this issue' });
    }

    res.status(200).json({
      issueId: issue._id,
      issueTitle: issue.title,
      progressUpdates: issue.progressUpdates || [],
      total: (issue.progressUpdates || []).length
    });

  } catch (error) {
    console.error('Error fetching progress updates:', error);
    res.status(500).json({ message: 'Error fetching progress updates' });
  }
};

/**
 * Delete a progress update (only by technician who posted it)
 * DELETE /api/progress/update/:updateId/:issueId
 */
exports.deleteProgressUpdate = async (req, res) => {
  try {
    const { updateId, issueId } = req.params;
    const technicianId = req.user._id;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Find and remove the update
    const updateIndex = issue.progressUpdates.findIndex(
      u => u._id.toString() === updateId
    );

    if (updateIndex === -1) {
      return res.status(404).json({ message: 'Update not found' });
    }

    // Verify ownership
    if (issue.progressUpdates[updateIndex].technician.toString() !== technicianId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this update' });
    }

    issue.progressUpdates.splice(updateIndex, 1);
    await issue.save();

    res.status(200).json({ message: 'Progress update deleted successfully' });

  } catch (error) {
    console.error('Error deleting progress update:', error);
    res.status(500).json({ message: 'Error deleting progress update' });
  }
};

/**
 * Get issue with all progress updates and details
 * GET /api/progress/issue/:issueId
 */
exports.getIssueWithProgress = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId)
      .populate('createdBy', 'name email')
      .populate('assignedTechnician', 'name email department')
      .populate('progressUpdates.technician', 'name email profileImage');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({
      issue: {
        _id: issue._id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        location: issue.location,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        createdBy: issue.createdBy,
        assignedTechnician: issue.assignedTechnician,
        sla: issue.sla,
        timeline: issue.timeline,
        progressUpdates: issue.progressUpdates || []
      }
    });

  } catch (error) {
    console.error('Error fetching issue with progress:', error);
    res.status(500).json({ message: 'Error fetching issue' });
  }
};

module.exports = exports;
