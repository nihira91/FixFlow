
const TechnicianStats = require("../models/technicianStats.model");


exports.getTechnicianStats = async (req, res) => {
  try {
    const stats = await TechnicianStats.findOne({ technicianId: req.params.id }).populate("technicianId", "name department");
    return res.status(200).json({ stats });
  } catch (error) {
    console.error("Error fetching technician stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TechnicianStats.find()
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(10)
      .populate("technicianId", "name department");

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getRatingBreakdown = async (req, res) => {
  try {
    const stats = await TechnicianStats.findOne({ technicianId: req.params.id });
    if (!stats) return res.status(404).json({ message: "Stats not found" });
    return res.status(200).json({ breakdown: stats.ratingBreakdown });
  } catch (error) {
    console.error("Error fetching rating breakdown:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
