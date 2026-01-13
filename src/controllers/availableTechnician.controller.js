// src/controllers/availableTechnician.controller.js
const User = require('../models/user.model');
const { getAvailableTechniciansByCategory } = require('../services/issueAssignment.service');

/**
 * Get available technicians for a specific category
 */
exports.getAvailableTechnicians = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const technicians = await getAvailableTechniciansByCategory(category);

    return res.status(200).json({
      message: `Found ${technicians.length} available technicians`,
      category,
      technicians
    });

  } catch (error) {
    console.error("Error fetching available technicians:", error);
    return res.status(500).json({ message: "Server error fetching technicians" });
  }
};

/**
 * Get all technicians (admin view)
 */
exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' })
      .select('name email category currentWorkload maxCapacity isAvailable rating')
      .sort({ currentWorkload: 1 });

    return res.status(200).json({
      total: technicians.length,
      technicians
    });

  } catch (error) {
    console.error("Error fetching technicians:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get technician workload statistics (admin view)
 */
exports.getTechnicianStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'technician' } },
      {
        $group: {
          _id: '$category',
          totalTechnicians: { $sum: 1 },
          totalCapacity: { $sum: '$maxCapacity' },
          totalWorkload: { $sum: '$currentWorkload' },
          availableTechnicians: {
            $sum: { $cond: ['$isAvailable', 1, 0] }
          }
        }
      }
    ]);

    return res.status(200).json({
      message: "Technician statistics by category",
      stats
    });

  } catch (error) {
    console.error("Error fetching technician stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
