/**
 * SLA Migration Script
 * Initializes SLA data for existing issues that don't have it
 */

const Issue = require('../models/issue.model');
const { SLA_CONFIG } = require('../config/sla.config');

/**
 * Migrate all existing issues to have SLA data
 */
async function migrateSLAForExistingIssues() {
  try {
    console.log('🔄 Starting SLA migration for existing issues...');

    // Find all issues that don't have SLA data
    const issuesToMigrate = await Issue.find({
      $or: [
        { 'sla': { $exists: false } },
        { 'sla.responseTimeTarget': { $exists: false } }
      ]
    });

    console.log(`Found ${issuesToMigrate.length} issues without SLA data`);

    if (issuesToMigrate.length === 0) {
      console.log('✅ All issues already have SLA data');
      return { success: true, message: 'No migration needed', count: 0 };
    }

    let migratedCount = 0;

    for (const issue of issuesToMigrate) {
      try {
        const slaTargets = SLA_CONFIG[issue.priority] || SLA_CONFIG['Routine'];

        // Initialize SLA fields
        issue.sla = {
          responseTimeTarget: slaTargets.responseTimeMinutes,
          resolutionTimeTarget: slaTargets.resolutionTimeMinutes,
          firstResponseTime: null,
          resolvedTime: null,
          responseStatus: 'pending',
          resolutionStatus: 'pending',
          responseTimeBreached: false,
          resolutionTimeBreached: false,
          responseTimeRemaining: slaTargets.responseTimeMinutes,
          resolutionTimeRemaining: slaTargets.resolutionTimeMinutes,
          breachAlertSent: false
        };

        await issue.save();
        migratedCount++;

        console.log(`✅ Migrated SLA for issue: ${issue.title}`);
      } catch (error) {
        console.error(`❌ Failed to migrate issue ${issue._id}:`, error.message);
      }
    }

    console.log(`✅ Migration complete! ${migratedCount}/${issuesToMigrate.length} issues updated`);
    return {
      success: true,
      message: `SLA data initialized for ${migratedCount} issues`,
      count: migratedCount
    };
  } catch (error) {
    console.error('❌ SLA Migration failed:', error);
    return {
      success: false,
      message: error.message,
      count: 0
    };
  }
}

module.exports = { migrateSLAForExistingIssues };
