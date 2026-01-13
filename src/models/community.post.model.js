const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: String,
    authorRole: {
      type: String,
      enum: ['employee', 'technician'],
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000
    },
    category: {
      type: String,
      enum: ['General', 'Issue Help', 'Tips & Tricks', 'Announcement'],
      default: 'General'
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        author: mongoose.Schema.Types.ObjectId,
        authorName: String,
        authorRole: String,
        content: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    tags: [String],
    issueReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for better search
communityPostSchema.index({ title: 'text', content: 'text' });
communityPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
