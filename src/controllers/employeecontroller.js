exports.dashboard = async (req, res) => {
  try {
    return res.json({
      message: "Employee Dashboard Data",
      user: req.user,
      data: {
        issuesRaised: 12,
        pendingIssues: 3,
        resolvedIssues: 9,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Employee dashboard error", error: error.message });
  }
};
