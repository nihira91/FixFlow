exports.dashboard = async (req, res) => {
  try {
    return res.json({
      message: "Admin Dashboard Data",
      user: req.user,
      stats: {
        totalEmployees: 45,
        totalTechnicians: 18,
        totalIssues: 250,
        pending: 40,
        resolved: 210
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Admin dashboard error", error: error.message });
  }
};
