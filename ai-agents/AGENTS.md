# ADC Registration Agents

This document defines the specialized AI personas (Agents) and their current area of responsibility within the ADC Registration workspace. These agents should be adopted based on the task at hand to ensure consistency and deep domain knowledge.

## 🤖 Active Agents

### 1. The Frontend Architect (`frontend-agent`)
**Responsibility**: Public-facing registration form, shared UI components, and design system.
**Current State**: 
- Registration form is fully functional with `react-hook-form` and `zod`.
- Uses `shadcn/ui` components.
- Responsive design implemented for mobile-first approach.
**Tech Stack**: Next.js (Client Components), TailwindCSS, Framer Motion, Lucide React.

### 2. The Admin Overseer (`admin-agent`)
**Responsibility**: Internal management dashboards and data visualization.
**Current State**:
- **Inscrições Overview**: DataTable implemented with filtering.
- **Food Management**: Specialized view filtering participants by meal type.
- **Workshops (Djembe, Dance, Balafon)**: Sub-directories ready for specialized management views.
- **Accommodation**: Overview planned to mirror Food management.
**Focus**: Statistics cards, data tables, and management workflows.

### 3. The Financial Officer (`finance-agent`)
**Responsibility**: Revenue tracking, expense management, and payment verification.
**Current State**:
- **Income & Expenses**: Dashboard implemented with stats cards and expense breakdown.
- **Form**: Entry form for both income and expenses.
- **Integration**: Fetches data from `/api/income-expense` and `/api/registration`.
**Focus**: P&L calculations, payment confirmation workflows.

### 4. The Data & API Guardian (`data-agent`)
**Responsibility**: MongoDB schemas, API route logic, and data integrity.
**Current State**:
- **Models**: `Registration` and `IncomeExpense` schemas defined in `mongoose`.
- **API**: Endpoints for registration, income-expense, and IBAN retrieval.
- **Database**: MongoDB integration via `mongoose` in `lib/db.ts`.
**Focus**: Server-side logic, database performance, and type safety.

---

## 🔄 Current Base State Sync

### ✅ Implemented
- **Public Registration**: Complex form handling workshops, children, food, and accommodation.
- **Admin Dashboard**: Base layout, stats cards, and registration data table.
- **Food & Accommodation**: Specialized views with filtering and stats cards for logistics.
- **Financial Tracking**: CRUD for income/expenses and revenue aggregation.
- **Database**: MongoDB connection and core models.

### ⏳ In Progress
- **Workshop Management**: Building out specific views for Djembe, Dance, and Balafon.
- **Payment Confirmation**: Streamlining the "good will" checkbox into a verified status.

### 🚀 Future / Planned
- **Email Notifications**: Automated confirmation emails.
- **receipt Generation**: Expanding `utils/downloadReceipt.ts` for automated participant receipts.
- **Advanced Stats**: Forecasting based on historical data.

---

## 🛠 Tech Stack Summary
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + Shadcn/UI
- **Database**: MongoDB + Mongoose
- **Validation**: Zod + React Hook Form
- **State Management**: React State / URL params (nuqs)

# ADC Website 2026 — AI Agent Context

> **Use this file at the start of every session to sync context.**

## Quick Sync Command

When starting a new session, run this slash command:

```
/sync
```

Or say: **"Sync with the codebase"**

This tells the AI to:
1. Read this file for project context
2. Review the current file structure
3. Check recent git changes
4. Verify build status
