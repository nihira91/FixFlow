const Issue = require('../models/issue.model');
const User = require('../models/user.model');

exports.createIssue = async (req, res) => {
  try {
    const {title, description, category, priority, location, images = []} = req.body;
    if(!title || !description || !category || !location) {
      return res.status(400).json({message: 'title, description, category and location are required'})
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      location,
      images,
      createdBy: req.user.id,
      timeline: [{ status: 'open', timestamp: new Date()}]
    });

    res.status(201).json({ message: 'Issue created', issue});
  } catch (err) {
    console.error('createIssue error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployeeIssues = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = { createdBy: req.user.id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const issues = await Issue.find(filter)
      .sort({ createdat: -1 })
      .skip((page - 1)*limit)
      .limit(Number(limit))
      .populate('assignedTechnician', 'name email department');

    res.status(200).json({ issues });  
  } catch (err) {
    console.error('getEmployeeIssues error:', err);
    res.status(500).json({ message: 'Server error'});
  }
};

exports.getSingleIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTechnician', 'name email department');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    // Ensure employee only accesses own issue
    if (issue.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ issue });
  } catch (err) {
    console.error('getSingleIssue error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};