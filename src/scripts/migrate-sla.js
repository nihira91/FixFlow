#!/usr/bin/env node
/**
 * SLA Migration Helper
 * Run this from terminal to initialize SLA for existing issues
 * 
 * Usage:
 *   node src/scripts/migrate-sla.js
 * 
 * Or call the API endpoint:
 *   POST http://localhost:5000/api/sla/migrate
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { migrateSLAForExistingIssues } = require('../services/sla.migration');

async function runMigration() {
  try {
    console.log('🚀 Starting SLA Migration...\n');
    
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fixflow_ims';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Run migration
    const result = await migrateSLAForExistingIssues();

    // Print results
    console.log('\n' + '='.repeat(50));
    console.log('MIGRATION RESULTS:');
    console.log('='.repeat(50));
    console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Message: ${result.message}`);
    console.log(`Issues Updated: ${result.count}`);
    console.log('='.repeat(50) + '\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Migration complete!');
    process.exit(result.success ? 0 : 1);

  } catch (error) {
    console.error('❌ Migration Error:', error.message);
    process.exit(1);
  }
}

// Run migration
runMigration();
