/**
 * SLA Service - Handles all SLA tracking and calculations
 */

const Issue = require('../models/issue.model');
const { SLA_CONFIG, SLA_STATUS } = require('../config/sla.config');

/**
 * Calculate SLA targets based on priority when issue is created/assigned
 */
exports.initializeSLA = async (issueId, priority) => {
  try {
    const slaTargets = SLA_CONFIG[priority];
    if (!slaTargets) {
      console.error(`❌ Invalid priority: ${priority}`);
      return null;
    }

    const issue = await Issue.findByIdAndUpdate(
      issueId,
      {
        sla: {
          responseTimeTarget: slaTargets.responseTimeMinutes,
          resolutionTimeTarget: slaTargets.resolutionTimeMinutes,
          firstResponseTime: null,
          resolvedTime: null,
          responseStatus: 'pending',
          resolutionStatus: 'pending',
          responseTimeBreached: false,
          resolutionTimeBreached: false,
          responseTimeRemaining: slaTargets.responseTimeMinutes,
          resolutionTimeRemaining: slaTargets.resolutionTimeMinutes,
          breachAlertSent: false
        }
      },
      { new: true }
    );

    console.log(`✅ SLA initialized for issue ${issueId}: Response=${slaTargets.responseTimeMinutes}min, Resolution=${slaTargets.resolutionTimeMinutes}min`);
    return issue;
  } catch (error) {
    console.error('❌ Error initializing SLA:', error.message);
    throw error;
  }
};

/**
 * Record first response time when technician starts working on issue
 */
exports.recordFirstResponse = async (issueId) => {
  try {
    const now = new Date();
    const issue = await Issue.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    if (issue.sla.firstResponseTime) {
      return issue; // Already recorded
    }

    const createdTime = issue.createdAt;
    const responseTime = (now - createdTime) / (1000 * 60); // Convert to minutes
    const target = issue.sla.responseTimeTarget;
    const isBreach = responseTime > target;

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        'sla.firstResponseTime': now,
        'sla.responseStatus': isBreach ? SLA_STATUS.BREACHED : SLA_STATUS.MET,
        'sla.responseTimeBreached': isBreach
      },
      { new: true }
    );

    console.log(`📍 First response recorded: ${responseTime.toFixed(2)}min (Target: ${target}min) - ${isBreach ? '❌ BREACHED' : '✅ MET'}`);
    return updatedIssue;
  } catch (error) {
    console.error('❌ Error recording first response:', error.message);
    throw error;
  }
};

/**
 * Record resolution time when issue is marked as resolved/closed
 */
exports.recordResolution = async (issueId) => {
  try {
    const now = new Date();
    const issue = await Issue.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    if (issue.sla.resolvedTime) {
      return issue; // Already recorded
    }

    const createdTime = issue.createdAt;
    const resolutionTime = (now - createdTime) / (1000 * 60); // Convert to minutes
    const target = issue.sla.resolutionTimeTarget;
    const isBreach = resolutionTime > target;

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        'sla.resolvedTime': now,
        'sla.resolutionStatus': isBreach ? SLA_STATUS.BREACHED : SLA_STATUS.MET,
        'sla.resolutionTimeBreached': isBreach
      },
      { new: true }
    );

    console.log(`🏁 Resolution recorded: ${resolutionTime.toFixed(2)}min (Target: ${target}min) - ${isBreach ? '❌ BREACHED' : '✅ MET'}`);
    return updatedIssue;
  } catch (error) {
    console.error('❌ Error recording resolution:', error.message);
    throw error;
  }
};

/**
 * Calculate remaining time for SLA compliance
 */
exports.calculateRemainingTime = async (issueId) => {
  try {
    const issue = await Issue.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    const now = new Date();
    const createdTime = issue.createdAt;
    const elapsedMinutes = (now - createdTime) / (1000 * 60);

    const responseRemaining = issue.sla.responseTimeTarget - elapsedMinutes;
    const resolutionRemaining = issue.sla.resolutionTimeTarget - elapsedMinutes;

    const updated = await Issue.findByIdAndUpdate(
      issueId,
      {
        'sla.responseTimeRemaining': Math.max(0, responseRemaining),
        'sla.resolutionTimeRemaining': Math.max(0, resolutionRemaining)
      },
      { new: true }
    );

    return {
      responseRemaining: Math.max(0, responseRemaining),
      resolutionRemaining: Math.max(0, resolutionRemaining),
      issue: updated
    };
  } catch (error) {
    console.error('❌ Error calculating remaining time:', error.message);
    throw error;
  }
};

/**
 * Get all breached SLAs
 */
exports.getBreachedSLAs = async (filters = {}) => {
  try {
    const query = {
      $or: [
        { 'sla.responseTimeBreached': true },
        { 'sla.resolutionTimeBreached': true }
      ],
      status: { $ne: 'closed' } // Exclude closed issues
    };

    // Apply filters if provided
    if (filters.priority) query.priority = filters.priority;
    if (filters.category) query.category = filters.category;
    if (filters.assignedTechnician) query.assignedTechnician = filters.assignedTechnician;

    const breachedIssues = await Issue.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTechnician', 'name email')
      .sort({ createdAt: -1 });

    return breachedIssues;
  } catch (error) {
    console.error('❌ Error fetching breached SLAs:', error.message);
    throw error;
  }
};

/**
 * Get SLA metrics dashboard data
 */
exports.getSLAMetrics = async () => {
  try {
    const allIssues = await Issue.find({ status: { $ne: 'closed' } });

    const metrics = {
      total: allIssues.length,
      responseMetrics: {
        met: allIssues.filter(i => i.sla.responseStatus === SLA_STATUS.MET).length,
        breached: allIssues.filter(i => i.sla.responseStatus === SLA_STATUS.BREACHED).length,
        pending: allIssues.filter(i => i.sla.responseStatus === SLA_STATUS.PENDING).length,
        complianceRate: 0
      },
      resolutionMetrics: {
        met: allIssues.filter(i => i.sla.resolutionStatus === SLA_STATUS.MET).length,
        breached: allIssues.filter(i => i.sla.resolutionStatus === SLA_STATUS.BREACHED).length,
        pending: allIssues.filter(i => i.sla.resolutionStatus === SLA_STATUS.PENDING).length,
        complianceRate: 0
      },
      byPriority: {}
    };

    // Calculate compliance rates
    if (allIssues.length > 0) {
      const responseMet = metrics.responseMetrics.met + metrics.responseMetrics.pending;
      metrics.responseMetrics.complianceRate = ((responseMet / allIssues.length) * 100).toFixed(2);

      const resolutionMet = metrics.resolutionMetrics.met + metrics.resolutionMetrics.pending;
      metrics.resolutionMetrics.complianceRate = ((resolutionMet / allIssues.length) * 100).toFixed(2);
    }

    // Metrics by priority
    ['Critical', 'Urgent', 'Risky', 'Routine'].forEach(priority => {
      const priorityIssues = allIssues.filter(i => i.priority === priority);
      const breached = priorityIssues.filter(i => i.sla.responseTimeBreached || i.sla.resolutionTimeBreached);
      metrics.byPriority[priority] = {
        total: priorityIssues.length,
        breached: breached.length,
        complianceRate: priorityIssues.length > 0 
          ? (((priorityIssues.length - breached.length) / priorityIssues.length) * 100).toFixed(2)
          : 0
      };
    });

    return metrics;
  } catch (error) {
    console.error('❌ Error fetching SLA metrics:', error.message);
    throw error;
  }
};

/**
 * Check for SLA violations and send alerts
 */
exports.checkAndAlertSLAViolations = async (issueId, io = null) => {
  try {
    const issue = await Issue.findById(issueId);

    if (!issue || issue.status === 'closed' || issue.sla.breachAlertSent) {
      return null;
    }

    const now = new Date();
    const elapsedMinutes = (now - issue.createdAt) / (1000 * 60);
    const escalationTime = SLA_CONFIG[issue.priority]?.escalationTimeMinutes || 0;

    if (elapsedMinutes > escalationTime && !issue.sla.breachAlertSent) {
      const updatedIssue = await Issue.findByIdAndUpdate(
        issueId,
        { 'sla.breachAlertSent': true },
        { new: true }
      );

      // Send real-time alert via Socket.IO if available
      if (io) {
        const manager = await updatedIssue.populate('assignedTechnician', 'name email _id');
        io.emit('slaViolationAlert', {
          issueId: updatedIssue._id,
          title: updatedIssue.title,
          priority: updatedIssue.priority,
          elapsedMinutes: elapsedMinutes.toFixed(2),
          escalationMinutes: escalationTime,
          assignedTechnician: manager.assignedTechnician
        });
      }

      console.log(`🚨 SLA Violation Alert sent for issue ${issueId}`);
      return updatedIssue;
    }

    return null;
  } catch (error) {
    console.error('❌ Error checking SLA violations:', error.message);
    throw error;
  }
};

module.exports = exports;
