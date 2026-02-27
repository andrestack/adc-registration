// MongoDB Migration Script
// Run this in MongoDB shell or MongoDB Compass to update existing data
// This script sets year=2025 for all existing records

// ============================================
// MIGRATION FOR REGISTRATIONS COLLECTION
// ============================================

// First, let's see how many registrations we have
db.Registrations.countDocuments();

// Update all registrations without a year field to 2025
// (Assuming all existing data is from 2025)
db.Registrations.updateMany(
  { year: { $exists: false } },  // Find documents without year field
  { $set: { year: 2025 } }       // Set year to 2025
);

// Verify the update
db.Registrations.countDocuments({ year: 2025 });
db.Registrations.countDocuments({ year: { $exists: false } });

// ============================================
// MIGRATION FOR INCOMEEXPENSES COLLECTION
// ============================================

// First, let's see how many income/expense records we have
db.IncomeExpenses.countDocuments();

// Update all income/expense records without a year field to 2025
db.IncomeExpenses.updateMany(
  { year: { $exists: false } },  // Find documents without year field
  { $set: { year: 2025 } }       // Set year to 2025
);

// Verify the update
db.IncomeExpenses.countDocuments({ year: 2025 });
db.IncomeExpenses.countDocuments({ year: { $exists: false } });

// ============================================
// VERIFICATION QUERIES
// ============================================

// Check sample registrations from 2025
db.Registrations.find({ year: 2025 }).limit(5);

// Check sample income/expenses from 2025
db.IncomeExpenses.find({ year: 2025 }).limit(5);

// Get stats for 2025
print("=== 2025 Statistics ===");
print("Registrations: " + db.Registrations.countDocuments({ year: 2025 }));
print("Income/Expenses: " + db.IncomeExpenses.countDocuments({ year: 2025 }));

// ============================================
// HOW TO RUN THIS SCRIPT
// ============================================
// Option 1: MongoDB Shell (mongosh)
//   mongosh "your-connection-string" < migrate-to-2025.js
//
// Option 2: MongoDB Compass
//   1. Open MongoDB Compass
//   2. Connect to your database
//   3. Click on the database name
//   4. Click "Open MongoDB Shell" button
//   5. Copy and paste this script
//   6. Press Enter to run
//
// Option 3: MongoDB Atlas (Cloud)
//   1. Go to Atlas dashboard
//   2. Click "Browse Collections"
//   3. Click on your database
//   4. Click "..." menu next to the collection
//   5. Select "Open MongoDB Shell"
//   6. Run the commands above
