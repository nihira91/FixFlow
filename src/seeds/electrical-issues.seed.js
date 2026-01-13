// Electrical Issues Seed Data
// Run this to populate the database with sample electrical issues

const mongoose = require('mongoose');
const Issue = require('../models/issue.model');
require('dotenv').config();

const ELECTRICAL_ISSUES = [
  {
    title: "Power socket in Cabin 3 not working",
    description: "The power socket near the desk is completely dead. No power supply. Checked multiple devices.",
    category: "Electrical",
    priority: "Urgent",
    location: "Cabin 3",
    images: []
  },
  {
    title: "Circuit breaker tripped in Server Room",
    description: "Main circuit breaker has tripped. Need immediate attention. All servers down.",
    category: "Electrical",
    priority: "Critical",
    location: "Server Room",
    images: []
  },
  {
    title: "Faulty electrical outlet in Conference Room A",
    description: "Outlet sparks when plugging in devices. Very dangerous. Do not use.",
    category: "Electrical",
    priority: "Urgent",
    location: "Conference Room A",
    images: []
  },
  {
    title: "Power fluctuation affecting lights in Office Block B",
    description: "Lights flickering intermittently. Voltage seems unstable. Affecting work productivity.",
    category: "Electrical",
    priority: "High",
    location: "Office Block B",
    images: []
  },
  {
    title: "Fluorescent light not working in Corridor 2",
    description: "Overhead light tube is dead. Dark corridor creating safety hazard.",
    category: "Electrical",
    priority: "Routine",
    location: "Corridor 2",
    images: []
  },
  {
    title: "Electrical panel door lock broken",
    description: "Main electrical panel door is stuck. Cannot properly close and lock.",
    category: "Electrical",
    priority: "High",
    location: "Electrical Room",
    images: []
  },
  {
    title: "Loose electrical wire in Cabin 5",
    description: "Exposed wire near power outlet. Potential safety hazard. Needs immediate fixing.",
    category: "Electrical",
    priority: "Urgent",
    location: "Cabin 5",
    images: []
  },
  {
    title: "Power strip overloaded in Reception",
    description: "Too many devices connected. Strip getting hot. Risk of fire hazard.",
    category: "Electrical",
    priority: "High",
    location: "Reception",
    images: []
  },
  {
    title: "Burning smell near electrical outlet in Store Room",
    description: "Strong burning smell coming from outlet in back wall. Needs urgent investigation.",
    category: "Electrical",
    priority: "Critical",
    location: "Store Room",
    images: []
  },
  {
    title: "Power failure in East Wing",
    description: "Entire east wing has lost power. Affects 10+ rooms. Need to restore immediately.",
    category: "Electrical",
    priority: "Critical",
    location: "East Wing",
    images: []
  },
  {
    title: "UPS battery backup not working",
    description: "Uninterruptible Power Supply showing error. Battery not charging. Need replacement.",
    category: "Electrical",
    priority: "High",
    location: "IT Room",
    images: []
  },
  {
    title: "Backup generator not starting",
    description: "Generator won't turn on during manual test. No power output. Needs service.",
    category: "Electrical",
    priority: "Critical",
    location: "Generator Room",
    images: []
  },
  {
    title: "Electrical surge damage to equipment",
    description: "Lightning strike caused power surge. Multiple devices damaged. Need replacement.",
    category: "Electrical",
    priority: "High",
    location: "Cabin 1",
    images: []
  },
  {
    title: "Loose electrical connection in Distribution Box",
    description: "Found loose connection in main distribution box. Creating intermittent power issues.",
    category: "Electrical",
    priority: "Urgent",
    location: "Main Distribution Room",
    images: []
  },
  {
    title: "LED display not lighting up in Lobby",
    description: "LED info display is completely dark. Not responding to power. Needs repair.",
    category: "Electrical",
    priority: "Routine",
    location: "Main Lobby",
    images: []
  },
  {
    title: "Electrical outlet damaged in Bathroom",
    description: "Outlet face plate is cracked and damaged. Water exposure risk. Needs replacement.",
    category: "Electrical",
    priority: "High",
    location: "Bathroom - 2nd Floor",
    images: []
  },
  {
    title: "Power cord damaged in Conference Room C",
    description: "Cable has visible damage and exposed wires. Equipment at risk. Need to replace.",
    category: "Electrical",
    priority: "Urgent",
    location: "Conference Room C",
    images: []
  },
  {
    title: "Electrical noise coming from transformer",
    description: "Transformer making unusual humming/buzzing noise. May indicate failure soon.",
    category: "Electrical",
    priority: "High",
    location: "Transformer Room",
    images: []
  },
  {
    title: "Air conditioner not getting power",
    description: "AC unit in Cabin 4 is dead. No power supply reaching the unit despite outlet working.",
    category: "Electrical",
    priority: "High",
    location: "Cabin 4",
    images: []
  },
  {
    title: "Emergency light battery needs replacement",
    description: "Emergency exit light not working. Battery is dead and needs replacement immediately.",
    category: "Electrical",
    priority: "Urgent",
    location: "Emergency Exit - Stairwell A",
    images: []
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/it_ims');
    console.log('✅ Connected to MongoDB');

    // Get a sample employee ID (you may need to adjust this)
    const User = require('../models/user.model');
    const employees = await User.find({ role: 'employee' }).limit(5);
    
    if (employees.length === 0) {
      console.log('❌ No employees found. Please create employees first.');
      process.exit(1);
    }

    // Create issues with random employees as creators
    const issuesToInsert = ELECTRICAL_ISSUES.map((issue, index) => ({
      ...issue,
      createdBy: employees[index % employees.length]._id,
      status: 'open',
      timeline: [
        {
          status: 'open',
          timestamp: new Date(),
          note: 'Issue reported'
        }
      ]
    }));

    // Insert into database
    const result = await Issue.insertMany(issuesToInsert);
    console.log(`✅ Inserted ${result.length} electrical issues`);

    // Display summary
    console.log('\n📊 Issues Created:');
    console.log(`   - Critical: ${issuesToInsert.filter(i => i.priority === 'Critical').length}`);
    console.log(`   - Urgent: ${issuesToInsert.filter(i => i.priority === 'Urgent').length}`);
    console.log(`   - High: ${issuesToInsert.filter(i => i.priority === 'High').length}`);
    console.log(`   - Routine: ${issuesToInsert.filter(i => i.priority === 'Routine').length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
