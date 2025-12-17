// const mongoose = require('mongoose');

// const issueSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true
//     },

//     description: {
//       type: String,
//       required: true
//     },

//     category: {
//       type: String,
//       required: true
//     },

//     priority: {
//       type: String,
//       enum: ['Routine', 'Risky', 'Urgent', 'Critical'],
//       default: 'Routine'
//     }
//     ,

//     location: {
//       type: String,
//       required: true
//     },

//     images: [
//       {
//         type: String
//       }
//     ],

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },

//     assignedTechnician: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       default: null
//     },

//     status: {
//       type: String,
//       enum: ['open', 'assigned', 'in-progress', 'on-hold', 'resolved', 'closed'],
//       default: 'open'
//     },

//     timeline: [
//       {
//         status: String,
//         timestamp: { type: Date, default: Date.now }
//       }
//     ]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Issue', issueSchema);

const mongoose = require("mongoose");

const ISSUE_STATUS = [
  "open",
  "assigned",
  "in-progress",
  "on-hold",
  "resolved",
  "closed"
];

const ISSUE_PRIORITY = [
  "Routine",
  "Risky",
  "Urgent",
  "Critical"
];

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ISSUE_PRIORITY,
      default: "Routine"
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
      ref: "User",
      required: true
    },

    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    /** ✅ SINGLE SOURCE OF TRUTH */
    status: {
      type: String,
      enum: ISSUE_STATUS,
      default: "open",
      index: true
    },

    /** ✅ HISTORY ONLY (NOT PRIMARY STATUS) */
    timeline: [
      {
        status: {
          type: String,
          enum: ISSUE_STATUS,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        note: {
          type: String,
          default: null
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);

