/**
 * SLA Configuration - Priority-Based Response & Resolution Times
 */

const SLA_CONFIG = {
  "Critical": {
    responseTimeMinutes: 30,       // 30 minutes to respond
    resolutionTimeMinutes: 120,    // 2 hours to resolve
    escalationTimeMinutes: 90      // Alert after 90 mins
  },
  "Urgent": {
    responseTimeMinutes: 60,       // 1 hour to respond
    resolutionTimeMinutes: 480,    // 8 hours to resolve
    escalationTimeMinutes: 360     // Alert after 6 hours
  },
  "Risky": {
    responseTimeMinutes: 240,      // 4 hours to respond
    resolutionTimeMinutes: 1440,   // 24 hours to resolve
    escalationTimeMinutes: 1080    // Alert after 18 hours
  },
  "Routine": {
    responseTimeMinutes: 480,      // 8 hours to respond
    resolutionTimeMinutes: 2880,   // 48 hours to resolve
    escalationTimeMinutes: 2160    // Alert after 36 hours
  }
};

/**
 * SLA Status Constants
 */
const SLA_STATUS = {
  PENDING: 'pending',
  MET: 'met',
  BREACHED: 'breached'
};

module.exports = {
  SLA_CONFIG,
  SLA_STATUS
};
