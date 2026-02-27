# Year-Based Data Structure

## Overview

The ADC Registration system now supports multiple years using a `year` field in the database schemas rather than separate collections.

## Database Structure

### Same Collections, Different Years

```
Registrations Collection:
├── Document 1: { ..., year: 2025, fullName: "John Doe", ... }
├── Document 2: { ..., year: 2025, fullName: "Jane Smith", ... }
├── Document 3: { ..., year: 2026, fullName: "New Participant", ... }
└── ...

IncomeExpenses Collection:
├── Document 1: { ..., year: 2025, name: "Artist Fees", amount: 5000, ... }
├── Document 2: { ..., year: 2025, name: "Travels", amount: 1200, ... }
├── Document 3: { ..., year: 2026, name: "Deposit", amount: 2000, ... }
└── ...
```

## Why Not Separate Collections?

1. **Simplicity**: One schema to maintain
2. **Query Power**: Easy to compare years, calculate trends
3. **Flexibility**: Can query across years when needed
4. **Future-Proof**: Adding 2027, 2028 just means changing a filter, not creating new collections

## How It Works

### API Filtering
```typescript
// Fetch 2025 data
GET /api/registration?year=2025

// Fetch 2026 data (current year)
GET /api/registration?year=2026

// No year = get all (for reports)
GET /api/registration
```

### Dashboard Structure
```
/admin                    → Shows 2026 data + year comparison
/admin/food              → Shows 2026 food data
/admin/accommodation     → Shows 2026 accommodation data
/admin/income-expenses   → Shows 2026 financial data
/admin/workshops/*       → Shows 2026 workshop data

/admin/archive/2025      → Archive with tabs (read-only)
```

## Migration Completed

✅ Schema updated with `year` field (default: 2026)
✅ API routes support year filtering
✅ Archive page created for 2025
✅ Main dashboard updated for 2026
✅ Sidebar navigation updated

## Next Steps

1. Run the migration script (`scripts/migrate-to-2025.js`) to tag existing data
2. New registrations automatically get `year: 2026`
3. Ready for 2027 next year - just update default year and create new archive!
