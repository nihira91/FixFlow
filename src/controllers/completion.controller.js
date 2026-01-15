/**
 * Issue Completion & Rating Controller
 * Handle issue completion and technician ratings
 */

const Issue = require('../models/issue.model');
const User = require('../models/user.model');
const { getIO } = require('../socket');

/**
 * Mark issue as resolved/completed by technician
 * PATCH /api/completion/mark-complete/:issueId
 */
exports.markIssueComplete = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { completionNotes } = req.body;
    const technicianId = req.user._id;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify technician is assigned
    if (issue.assignedTechnician.toString() !== technicianId.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this issue' });
    }

    // Mark as resolved
    issue.status = 'resolved';
    issue.completedAt = new Date();
    if (completionNotes) {
      issue.completionNotes = completionNotes;
    }

    // Add to timeline
    if (!issue.timeline) {
      issue.timeline = [];
    }
    issue.timeline.push({
      status: 'resolved',
      timestamp: new Date(),
      note: completionNotes || 'Work completed by technician'
    });

    await issue.save();

    // Populate and return
    const updatedIssue = await Issue.findById(issueId)
      .populate('createdBy', 'name email')
      .populate('assignedTechnician', 'name email');

    // Emit socket event to employee
    const io = getIO();
    io.emit(`issue-resolved-${issue.createdBy._id}`, {
      issueId: issue._id,
      title: issue.title,
      completedAt: issue.completedAt,
      message: `Your issue "${issue.title}" has been completed!`
    });

    res.json({
      message: 'Issue marked as completed',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error marking issue complete:', error);
    res.status(500).json({ message: 'Error marking issue complete', error: error.message });
  }
};

/**
 * Submit technician rating from employee
 * POST /api/completion/rate-technician/:issueId
 */
exports.rateTechnician = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { rating, review } = req.body;
    const employeeId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (review && review.length > 500) {
      return res.status(400).json({ message: 'Review cannot exceed 500 characters' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify employee is the creator
    if (issue.createdBy.toString() !== employeeId.toString()) {
      return res.status(403).json({ message: 'Not authorized to rate for this issue' });
    }

    // Verify issue is resolved
    if (issue.status !== 'resolved' && issue.status !== 'closed') {
      return res.status(400).json({ message: 'Can only rate completed issues' });
    }

    // Check if already rated
    if (issue.technicianRating.rating) {
      return res.status(400).json({ message: 'This issue has already been rated' });
    }

    // Add rating
    issue.technicianRating = {
      rating: Math.round(rating),
      review: review || null,
      ratedBy: employeeId,
      ratedAt: new Date()
    };

    await issue.save();

    // Update technician's rating in User model (if exists)
    const technician = await User.findById(issue.assignedTechnician);
    if (technician) {
      if (!technician.ratings) {
        technician.ratings = [];
      }
      technician.ratings.push({
        issueId: issue._id,
        rating: issue.technicianRating.rating,
        review: issue.technicianRating.review,
        ratedBy: employeeId,
        ratedAt: new Date()
      });
      await technician.save();
    }

    // Populate and return
    const updatedIssue = await Issue.findById(issueId)
      .populate('createdBy', 'name email')
      .populate('assignedTechnician', 'name email')
      .populate('technicianRating.ratedBy', 'name email');

    // Emit socket event to technician
    const io = getIO();
    io.emit(`technician-rated-${issue.assignedTechnician._id}`, {
      issueId: issue._id,
      title: issue.title,
      rating: issue.technicianRating.rating,
      message: `You received a ${rating}⭐ rating for "${issue.title}"`
    });

    res.json({
      message: 'Technician rating submitted',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Error submitting rating', error: error.message });
  }
};

/**
 * Get technician rating for an issue
 * GET /api/completion/rating/:issueId
 */
exports.getIssueRating = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId)
      .populate('technicianRating.ratedBy', 'name email avatar');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({
      rating: issue.technicianRating,
      issueStatus: issue.status
    });

  } catch (error) {
    console.error('Error fetching rating:', error);
    res.status(500).json({ message: 'Error fetching rating', error: error.message });
  }
};

/**
 * Get technician's average rating
 * GET /api/completion/technician-rating/:technicianId
 */
exports.getTechnicianAverageRating = async (req, res) => {
  try {
    const { technicianId } = req.params;

    // Get all issues with ratings for this technician
    const issues = await Issue.find({
      assignedTechnician: technicianId,
      'technicianRating.rating': { $exists: true, $ne: null }
    }).select('technicianRating');

    if (issues.length === 0) {
      return res.json({
        averageRating: 0,
        totalRatings: 0,
        ratings: []
      });
    }

    const ratings = issues.map(i => i.technicianRating.rating);
    const averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

    res.json({
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length,
      ratings: issues.map(i => ({
        issueId: i._id,
        rating: i.technicianRating.rating,
        review: i.technicianRating.review,
        ratedAt: i.technicianRating.ratedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching technician rating:', error);
    res.status(500).json({ message: 'Error fetching technician rating', error: error.message });
  }
};
