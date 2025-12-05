
const Feedback = require("../models/feedback.model");
const TechnicianStats = require("../models/technicianStats.model");
const Issue = require("../models/issue.model");

async function updateTechnicianStats(technicianId) {
  const feedbacks = await Feedback.find({ technicianId });

  const totalRatings = feedbacks.length;
  if (totalRatings === 0) {
    return TechnicianStats.findOneAndUpdate(
      { technicianId },
      { averageRating: 0, totalRatings: 0, positiveCount: 0, negativeCount: 0, ratingBreakdown: {1:0,2:0,3:0,4:0,5:0} },
      { upsert: true, new: true }
    );
  }

  let sum = 0;
  let positive = 0;
  let negative = 0;
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  feedbacks.forEach((f) => {
    sum += f.rating;
    breakdown[f.rating] = (breakdown[f.rating] || 0) + 1;
    if (f.rating >= 4) positive++;
    if (f.rating <= 2) negative++;
  });

  const avg = sum / totalRatings;

  await TechnicianStats.findOneAndUpdate(
    { technicianId },
    {
      averageRating: avg,
      totalRatings,
      ratingBreakdown: breakdown,
      positiveCount: positive,
      negativeCount: negative,
      lastUpdatedAt: new Date(),
    },
    { upsert: true, new: true }
  );
}


exports.addFeedback = async (req, res) => {
  try {
    const { technicianId, issueId, rating, comment, tags } = req.body;

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (issue.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const feedback = await Feedback.create({
      technicianId,
      employeeId: req.user.id,
      issueId,
      rating,
      comment,
      tags,
    });

    await updateTechnicianStats(technicianId);

    return res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Error adding feedback:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getFeedbackForTechnician = async (req, res) => {
  try {
    const feedback = await Feedback.find({ technicianId: req.params.id, isPublic: true })
      .populate("employeeId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.updateFeedback = async (req, res) => {
  try {
    const existing = await Feedback.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Feedback not found" });

    if (existing.employeeId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    existing.rating = req.body.rating || existing.rating;
    existing.comment = req.body.comment || existing.comment;
    existing.tags = req.body.tags || existing.tags;

    await existing.save();
    await updateTechnicianStats(existing.technicianId);

    return res.status(200).json({ message: "Feedback updated", existing });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deleteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });

    if (fb.employeeId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await fb.deleteOne();
    await updateTechnicianStats(fb.technicianId);

    return res.status(200).json({ message: "Feedback deleted" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
