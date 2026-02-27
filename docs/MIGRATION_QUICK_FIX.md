# Quick Migration Fix

## Problem
The archive page shows no data because existing 2025 records don't have the `year` field set.

## Quick Fix (Run in MongoDB)

### Option 1: MongoDB Shell (mongosh)

Connect to your database and run:

```javascript
// Tag all existing registrations as 2025
db.Registrations.updateMany(
  { year: { $exists: false } },
  { $set: { year: 2025 } }
)

// Tag all existing income/expenses as 2025
db.IncomeExpenses.updateMany(
  { year: { $exists: false } },
  { $set: { year: 2025 } }
)

// Verify
print("Registrations with year 2025:", db.Registrations.countDocuments({ year: 2025 }))
print("Income/Expenses with year 2025:", db.IncomeExpenses.countDocuments({ year: 2025 }))
```

### Option 2: MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Click on **Registrations** collection
4. Click **"Open MongoDB Shell"** button
5. Paste and run:
   ```javascript
   db.Registrations.updateMany({}, { $set: { year: 2025 } })
   ```
6. Repeat for **IncomeExpenses** collection:
   ```javascript
   db.IncomeExpenses.updateMany({}, { $set: { year: 2025 } })
   ```

### Option 3: MongoDB Atlas (Cloud)

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"**
3. Select your database
4. Click on **Registrations** collection
5. Click **"..."** (three dots) → **"Open MongoDB Shell"**
6. Run the commands above

## Verification

After running the migration, refresh the ADC 2025 Archive page. You should see your 2025 data.

## What This Does

- Adds `year: 2025` to all existing records
- New registrations automatically get `year: 2026`
- The archive page filters by `year: 2025` to show historical data
