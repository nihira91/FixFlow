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
    ],

    /** ✅ SLA TRACKING FIELDS */
    sla: {
      responseTimeTarget: {
        type: Number, // in minutes
        default: null
      },
      resolutionTimeTarget: {
        type: Number, // in minutes
        default: null
      },
      firstResponseTime: {
        type: Date, // when issue was first assigned/acknowledged
        default: null
      },
      resolvedTime: {
        type: Date, // when issue was resolved
        default: null
      },
      responseStatus: {
        type: String,
        enum: ['pending', 'met', 'breached'],
        default: 'pending'
      },
      resolutionStatus: {
        type: String,
        enum: ['pending', 'met', 'breached'],
        default: 'pending'
      },
      responseTimeBreached: {
        type: Boolean,
        default: false
      },
      resolutionTimeBreached: {
        type: Boolean,
        default: false
      },
      responseTimeRemaining: {
        type: Number, // in minutes (calculated)
        default: null
      },
      resolutionTimeRemaining: {
        type: Number, // in minutes (calculated)
        default: null
      },
      breachAlertSent: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);

