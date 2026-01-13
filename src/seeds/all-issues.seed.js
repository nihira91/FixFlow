// Comprehensive Issues Seed Data
// Run this to populate the database with sample issues across all categories

const mongoose = require('mongoose');
const Issue = require('../models/issue.model');
require('dotenv').config();

const ALL_ISSUES = [
  // ============= ELECTRICAL ISSUES =============
  {
    title: "Power socket in Cabin 3 not working",
    description: "The power socket near the desk is completely dead. No power supply. Checked multiple devices.",
    category: "Electrical",
    priority: "Urgent",
    location: "Cabin 3"
  },
  {
    title: "Circuit breaker tripped in Server Room",
    description: "Main circuit breaker has tripped. Need immediate attention. All servers down.",
    category: "Electrical",
    priority: "Critical",
    location: "Server Room"
  },
  {
    title: "Faulty electrical outlet in Conference Room A",
    description: "Outlet sparks when plugging in devices. Very dangerous. Do not use.",
    category: "Electrical",
    priority: "Urgent",
    location: "Conference Room A"
  },
  {
    title: "Power fluctuation affecting lights in Office Block B",
    description: "Lights flickering intermittently. Voltage seems unstable. Affecting work productivity.",
    category: "Electrical",
    priority: "High",
    location: "Office Block B"
  },
  {
    title: "Burning smell near electrical outlet in Store Room",
    description: "Strong burning smell coming from outlet in back wall. Needs urgent investigation.",
    category: "Electrical",
    priority: "Critical",
    location: "Store Room"
  },

  // ============= PLUMBING ISSUES =============
  {
    title: "Water leak in Bathroom - 1st Floor",
    description: "Water dripping from ceiling in toilet area. Seems to come from floor above.",
    category: "Plumbing",
    priority: "High",
    location: "Bathroom - 1st Floor"
  },
  {
    title: "Clogged drain in Pantry",
    description: "Kitchen sink completely blocked. Water not draining at all.",
    category: "Plumbing",
    priority: "High",
    location: "Pantry"
  },
  {
    title: "Burst pipe in Basement",
    description: "Water spraying from damaged pipe. Major water loss. Needs immediate repair.",
    category: "Plumbing",
    priority: "Critical",
    location: "Basement"
  },
  {
    title: "Toilet not flushing properly",
    description: "Flush mechanism broken. Toilet backing up.",
    category: "Plumbing",
    priority: "High",
    location: "Bathroom - 2nd Floor"
  },

  // ============= HVAC/COOLING ISSUES =============
  {
    title: "AC not cooling in Conference Room B",
    description: "Air conditioner running but not producing cold air. Room temperature 28°C.",
    category: "HVAC",
    priority: "High",
    location: "Conference Room B"
  },
  {
    title: "Furnace making strange noise",
    description: "Heating system making loud clanking sound. Potential mechanical failure.",
    category: "HVAC",
    priority: "High",
    location: "Boiler Room"
  },
  {
    title: "No hot water in building",
    description: "Central heating failed. No hot water in bathrooms or pantry.",
    category: "HVAC",
    priority: "Critical",
    location: "Main Building"
  },
  {
    title: "Air vent blocked in Cabin 2",
    description: "Ventilation blocked. Room getting stuffy. Poor air circulation.",
    category: "HVAC",
    priority: "Routine",
    location: "Cabin 2"
  },

  // ============= IT/NETWORK ISSUES =============
  {
    title: "Internet connection down",
    description: "Network completely offline. All devices disconnected. No internet access.",
    category: "IT/Network",
    priority: "Critical",
    location: "IT Room"
  },
  {
    title: "Printer not connecting to network",
    description: "Network printer offline. Cannot print from any workstation.",
    category: "IT/Network",
    priority: "High",
    location: "Office Block A"
  },
  {
    title: "WiFi signal weak in East Wing",
    description: "WiFi connectivity very poor in east wing. Constant disconnections.",
    category: "IT/Network",
    priority: "High",
    location: "East Wing"
  },
  {
    title: "Server maintenance required",
    description: "Server showing critical errors. Need backup and repair immediately.",
    category: "IT/Network",
    priority: "Critical",
    location: "Server Room"
  },

  // ============= STRUCTURAL ISSUES =============
  {
    title: "Cracks in ceiling of Cabin 6",
    description: "Large visible cracks appearing in ceiling tiles. Risk of collapse.",
    category: "Structural",
    priority: "Urgent",
    location: "Cabin 6"
  },
  {
    title: "Door hinge broken in Conference Room D",
    description: "Conference room door hanging at angle. Hinge completely broken.",
    category: "Structural",
    priority: "High",
    location: "Conference Room D"
  },
  {
    title: "Floor tile cracked in Lobby",
    description: "Ceramic floor tile cracked and creating tripping hazard.",
    category: "Structural",
    priority: "High",
    location: "Main Lobby"
  },
  {
    title: "Window frame damaged in Cabin 7",
    description: "Window frame cracked. Glass intact but frame needs replacement.",
    category: "Structural",
    priority: "Routine",
    location: "Cabin 7"
  },

  // ============= SECURITY ISSUES =============
  {
    title: "CCTV camera not recording",
    description: "Main security camera in lobby offline. Not capturing footage.",
    category: "Security",
    priority: "High",
    location: "Main Lobby"
  },
  {
    title: "Access card reader malfunction",
    description: "Door access reader not responding. Card swipes not working.",
    category: "Security",
    priority: "Urgent",
    location: "Cabin 1"
  },
  {
    title: "Alarm system battery low",
    description: "Security alarm showing low battery warning. Need replacement soon.",
    category: "Security",
    priority: "Routine",
    location: "Security Office"
  },

  // ============= FURNITURE/EQUIPMENT ISSUES =============
  {
    title: "Office chair damaged in Cabin 8",
    description: "Wheel broken on office chair. Cannot move properly. Seat also torn.",
    category: "Furniture",
    priority: "Routine",
    location: "Cabin 8"
  },
  {
    title: "Table wobbly in Conference Room E",
    description: "Meeting table legs uneven. Creates safety hazard during meetings.",
    category: "Furniture",
    priority: "High",
    location: "Conference Room E"
  },
  {
    title: "Cabinet door not closing properly",
    description: "Filing cabinet door stuck in open position. Dangerous.",
    category: "Furniture",
    priority: "High",
    location: "Records Room"
  },

  // ============= LIGHTING ISSUES =============
  {
    title: "LED lights flickering in Corridor 3",
    description: "New LED lights installed but flickering constantly. Very distracting.",
    category: "Lighting",
    priority: "High",
    location: "Corridor 3"
  },
  {
    title: "Emergency light battery dead",
    description: "Exit sign not lighting up. Battery completely dead. Safety hazard.",
    category: "Lighting",
    priority: "Urgent",
    location: "Emergency Exit - Stairwell B"
  },
  {
    title: "Dimmer switch not working",
    description: "Conference room dimmer switch broken. Lights stuck at full brightness.",
    category: "Lighting",
    priority: "Routine",
    location: "Conference Room F"
  },

  // ============= CLEANING/MAINTENANCE ISSUES =============
  {
    title: "Carpet stain in Cabin 9",
    description: "Large stain on carpet from unknown source. Needs professional cleaning.",
    category: "Cleaning",
    priority: "Routine",
    location: "Cabin 9"
  },
  {
    title: "Trash bin overflowing in Office Block",
    description: "Garbage disposal not working. Bins overflowing. Creating mess.",
    category: "Cleaning",
    priority: "High",
    location: "Office Block A"
  },
  {
    title: "Mold detected in basement",
    description: "Black mold spotted on walls. Health hazard. Need professional remediation.",
    category: "Cleaning",
    priority: "Urgent",
    location: "Basement"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/it_ims');
    console.log('✅ Connected to MongoDB');

    // Get sample employees
    const User = require('../models/user.model');
    const employees = await User.find({ role: 'employee' });
    
    if (employees.length === 0) {
      console.log('❌ No employees found. Please create employees first.');
      process.exit(1);
    }

    console.log(`Found ${employees.length} employees`);

    // Create issues with random employees as creators
    const issuesToInsert = ALL_ISSUES.map((issue, index) => ({
      ...issue,
      createdBy: employees[index % employees.length]._id,
      status: 'open',
      images: [],
      timeline: [
        {
          status: 'open',
          timestamp: new Date(),
          note: 'Issue reported'
        }
      ]
    }));

    // Clear existing issues (optional - comment out if you want to keep existing data)
    // await Issue.deleteMany({});

    // Insert into database
    const result = await Issue.insertMany(issuesToInsert);
    console.log(`\n✅ Inserted ${result.length} issues into database`);

    // Display summary
    console.log('\n📊 Issues by Category:');
    const categories = {};
    ALL_ISSUES.forEach(issue => {
      categories[issue.category] = (categories[issue.category] || 0) + 1;
    });
    Object.entries(categories).sort().forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count}`);
    });

    console.log('\n⚠️ Issues by Priority:');
    const priorities = {};
    ALL_ISSUES.forEach(issue => {
      priorities[issue.priority] = (priorities[issue.priority] || 0) + 1;
    });
    Object.entries(priorities).sort().forEach(([pri, count]) => {
      console.log(`   - ${pri}: ${count}`);
    });

    console.log('\n✨ Seed data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
