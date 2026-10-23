# RentaGo Rwanda — Car Rental Management System (RCRMS)

Enterprise-grade, full-stack **Car Rental Management System** modernized with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui-inspired modern components**, and **Prisma ORM**.

---

## 🚗 Core System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│             Next.js 14 App Router & TypeScript              │
├──────────────────────────────┬──────────────────────────────┤
│        Public Portal         │   Admin / Staff Dashboard    │
│  - Instant Date/Type Search  │  - Real-time Operations KPIs │
│  - Live Availability Badges  │  - Fleet Inventory & CRUD    │
│  - Live Cost & Deposit Calc  │  - Windshield QR Generator   │
│  - MoMo (*182#) & Card Checkout - Pickup Condition Handover │
│  - Self-service Portal       │  - Return Settlement Engine  │
│  - Digital Agreement Viewer  │  - Preventive Service Alerts │
│                              │  - MoMo Ledger & Invoicing   │
│                              │  - Role Switcher (4 Roles)   │
├──────────────────────────────┴──────────────────────────────┤
│               Prisma ORM & SQLite Database                  │
│       (Configurable to MySQL / PostgreSQL in .env)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 Multi-Role Support

The system supports four distinct operational roles with real-time simulated authorization:

1. **Admin**: Complete system authority, fleet registration, financial audits, user management.
2. **Fleet Manager**: Business performance metrics, fleet utilization (78%), revenue & expense reports.
3. **Rental Agent**: Customer verification, vehicle pickup inspections, digital signature agreements, check-in returns.
4. **Customer**: Fleet exploration, reservation with MoMo deposit, self-service dashboard, digital agreement downloads.

*A live **Role Switcher Bar** is located at the very top of every page for instant 1-click role swapping.*

---

## 🚀 Quick Start Guide

### 1. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Available Routes

#### Public Customer Portal
- `/` — Homepage with interactive vehicle search, live availability counter, and rental workflow.
- `/cars` — Fleet catalog with multi-criteria filters (body type, transmission, fuel, price sorting).
- `/cars/[id]` — Detailed vehicle profile with high-res photos, specs, and live price/deposit calculator.
- `/checkout` — Reservation checkout with MTN MoMo / Airtel / Card payment simulation.
- `/booking-confirmation` — Booking voucher, reference number, and handover instructions.
- `/portal` — Customer self-service dashboard (active rentals, outstanding balance settlement, agreement downloads).

#### Admin & Operations Hub
- `/admin` — Operations dashboard with Today's Overview KPIs, utilization gauge, and urgent maintenance alerts.
- `/admin/vehicles` — Fleet management table, status toggling, and instant **Vehicle Inspection QR Codes**.
- `/admin/bookings` — Reservation pipeline (Pending, Confirmed, Active, Completed, Cancelled).
- `/admin/rentals/[id]/pickup` — Digital handover inspection with dual **digital signature canvas**.
- `/admin/rentals/[id]/return` — Return inspection and automated settlement calculator (late fees + damage charges).
- `/admin/agreements/[id]` — Official legal rental contract with print & PDF export support.
- `/admin/customers` — Driver directory with license verification, trip counts, and balances.
- `/admin/payments` — MoMo, cash, and card transaction ledger.
- `/admin/maintenance` — Service logs with mileage and date countdown alerts.
- `/admin/reports` — Executive financial reports, fleet utilization, and CSV export.

---

## 📊 Database & Prisma Commands

- **Database engine**: SQLite (zero-config, stored in `prisma/dev.db`).
- **Push schema updates**:
  ```bash
  npx prisma db push
  ```
- **Re-seed data**:
  ```bash
  npm run prisma:seed
  ```
- **Inspect database with Prisma Studio**:
  ```bash
  npx prisma studio
  ```
