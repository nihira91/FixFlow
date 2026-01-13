// src/services/issueAssignment.service.js
const Issue = require('../models/issue.model');
const User = require('../models/user.model');

/**
 * Find and assign the best available technician to an issue
 * Criteria:
 * 1. Technician's category must match issue category
 * 2. Technician must be available (isAvailable = true)
 * 3. Technician's current workload < max capacity
 * 4. Prefer technician with least current workload (least busy)
 * 
 * @param {String} issueId - Issue ID to assign
 * @returns {Object} - { success: bool, technician: User, message: string }
 */
async function assignTechnicianToIssue(issueId) {
  try {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return { success: false, message: 'Issue not found' };
    }

    // Issue already assigned
    if (issue.assignedTechnician) {
      return { success: false, message: 'Issue already assigned' };
    }

    const issueCategory = issue.category;

    // Find all technicians matching the category and available
    const availableTechnicians = await User.find({
      role: 'technician',
      category: issueCategory,
      isAvailable: true,
      profileCompleted: true,
      $expr: { $lt: ['$currentWorkload', '$maxCapacity'] }  // currentWorkload < maxCapacity
    }).sort({ currentWorkload: 1 });  // Sort by lowest workload first

    if (availableTechnicians.length === 0) {
      return {
        success: false,
        message: `No available technician found for category: ${issueCategory}`
      };
    }

    // Assign to technician with least workload
    const assignedTechnician = availableTechnicians[0];

    // Update issue
    issue.assignedTechnician = assignedTechnician._id;
    issue.status = 'assigned';
    issue.timeline.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Assigned to ${assignedTechnician.name}`
    });
    await issue.save();

    // Increment technician's workload
    assignedTechnician.currentWorkload += 1;
    
    // If workload reaches max capacity, mark as unavailable
    if (assignedTechnician.currentWorkload >= assignedTechnician.maxCapacity) {
      assignedTechnician.isAvailable = false;
    }
    await assignedTechnician.save();

    return {
      success: true,
      technician: assignedTechnician,
      message: `Issue assigned to ${assignedTechnician.name}`
    };

  } catch (error) {
    console.error('Assignment service error:', error);
    return { success: false, message: 'Server error during assignment' };
  }
}

/**
 * Unassign a technician from an issue (when issue is resolved)
 * @param {String} issueId - Issue ID
 * @returns {Object} - { success: bool, message: string }
 */
async function unassignTechnicianFromIssue(issueId) {
  try {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return { success: false, message: 'Issue not found' };
    }

    if (!issue.assignedTechnician) {
      return { success: false, message: 'No technician assigned to this issue' };
    }

    const technician = await User.findById(issue.assignedTechnician);
    if (technician) {
      // Decrease workload
      technician.currentWorkload = Math.max(0, technician.currentWorkload - 1);

      // Mark available if workload is below max capacity
      if (technician.currentWorkload < technician.maxCapacity) {
        technician.isAvailable = true;
      }
      await technician.save();
    }

    // Unassign from issue
    issue.assignedTechnician = null;
    await issue.save();

    return { success: true, message: 'Technician unassigned from issue' };

  } catch (error) {
    console.error('Unassignment service error:', error);
    return { success: false, message: 'Server error during unassignment' };
  }
}

/**
 * Get all available technicians for a specific category
 * @param {String} category - Issue category
 * @returns {Array} - Available technicians
 */
async function getAvailableTechniciansByCategory(category) {
  try {
    return await User.find({
      role: 'technician',
      category: category,
      isAvailable: true,
      profileCompleted: true,
      $expr: { $lt: ['$currentWorkload', '$maxCapacity'] }
    }).select('name email category currentWorkload maxCapacity rating').sort({ currentWorkload: 1 });
  } catch (error) {
    console.error('Error fetching available technicians:', error);
    return [];
  }
}

/**
 * Get technician workload info
 * @param {String} technicianId - Technician ID
 * @returns {Object} - { currentWorkload, maxCapacity, isAvailable }
 */
async function getTechnicianWorkload(technicianId) {
  try {
    const technician = await User.findById(technicianId).select('currentWorkload maxCapacity isAvailable');
    if (!technician) {
      return null;
    }
    return {
      currentWorkload: technician.currentWorkload,
      maxCapacity: technician.maxCapacity,
      isAvailable: technician.isAvailable
    };
  } catch (error) {
    console.error('Error fetching technician workload:', error);
    return null;
  }
}

module.exports = {
  assignTechnicianToIssue,
  unassignTechnicianFromIssue,
  getAvailableTechniciansByCategory,
  getTechnicianWorkload
};
