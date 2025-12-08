const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    location: {
      type: String,
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    status: {
      type: String,
      enum: ['open', 'assigned', 'in-progress', 'on-hold', 'resolved', 'closed'],
      default: 'open'
    },

    timeline: [
      {
        status: String,
        timestamp: {type: Date, default: Date.now}
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
