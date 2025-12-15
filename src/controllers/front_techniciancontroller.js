exports.dashboard = async (req, res) => {
  try {
    return res.json({
      message: "Technician Dashboard Data",
      user: req.user,
      data: {
        assignedTasks: 5,
        completedTasks: 14,
        activeTasks: 2
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Technician dashboard error", error: error.message });
  }
};
