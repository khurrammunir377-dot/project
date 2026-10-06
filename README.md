# Apex ERP - Enterprise Company Management System (CMS/ERP)

A complete, production-ready, modern **Enterprise Company Management System (CMS/ERP)** built with Next.js 15, TypeScript, Tailwind CSS, Lucide Icons, Recharts, and automated PDF & Excel export engines.

---

## 🌟 Key Features & Functional Modules

### 1. Multi-Role RBAC & Authentication
* **Default Roles Implemented**: Super Admin, Company Admin, HR Manager, Finance Manager, Department Manager, Employee, Accountant, Sales Manager, Inventory Manager.
* **Granular Permission Matrix**: View, Create, Edit, Delete, Approve, Export, Import, Print.
* **Instant Role Switcher**: Interactive switcher in the top navigation to test all authorization boundaries and permissions instantly.

### 2. Executive Management Dashboard (`/dashboard`)
* Real-time KPI statistics: Total workforce, active staff, realized YTD revenue, pending approvals, inventory valuation, low-stock watchlist.
* Interactive Visual Analytics:
  * Revenue vs. Operational Expenses Area Chart
  * Department Headcount Distribution Donut Chart
  * Weekly Attendance & Punctuality Trends Bar Chart
* Quick Actions: Instant Clock In/Out, New Employee, Create Invoice.
* Actionable Managerial Approval Queue.

### 3. Human Resources (HR) & Workforce
* **Employee Directory (`/hr/employees`)**: Searchable, sortable, filterable staff directory with multi-tab detailed profile view (Overview, Employment, Payroll, Emergency contacts, Skills).
* **Live Attendance (`/hr/attendance`)**: Clock-in & clock-out logging, working hours calculation, overtime tracking, and manual punch adjustments.
* **Leave Management (`/hr/leave`)**: Vacation, sick leave, emergency leave balances with multi-tier managerial Approve/Reject workflows.
* **Payroll & Compensation (`/hr/payroll`)**: Gross salary calculation, tax withholdings, social insurance, net pay calculation, and **1-click official PDF Payslip generation**.
* **Recruitment & ATS (`/hr/recruitment`)**: Job vacancies posting and visual candidate pipeline tracker (Applied → Screening → Interview → Assessment → Offer → Hired).
* **Performance Reviews (`/hr/performance`)**: KPI goal tracking, rating scores (1.0 to 5.0), and manager appraisals.

### 4. CRM, Commercial & Billing
* **Customers Directory (`/crm/customers`)**: Client accounts, contacts, lifetime value, and outstanding balances.
* **Sales Deals Pipeline (`/crm/leads`)**: Visual deal pipeline (Lead → Qualified → Proposal → Negotiation → Won/Lost) with weighted probability forecasting.
* **Quotations & Estimates (`/sales/quotations`)**: Formal proposal generation with tax/discount rules and **1-click conversion into active invoices**.
* **Invoices & Billing (`/sales/invoices`)**: Accounts receivable billing, partial and full payment collections, balance due reconciliation, and **formal PDF Invoice generation**.

### 5. Supply Chain, Inventory & Procurement
* **Product Catalog (`/inventory/products`)**: SKU codes, barcodes, categories, warehouse stock levels, cost/selling prices, and live stock adjustments (+/-).
* **Warehouses (`/inventory/warehouses`)**: Multi-facility management with real-time capacity utilization meters.
* **Procurement & Purchase Orders (`/inventory/procurement`)**: Supplier management, PO status progression (Submitted → Approved → Goods Received), and automated stock replenishment upon receipt.

### 6. Financials, Projects & Operations
* **Expense Claims (`/finance/expenses`)**: Employee expense submissions, receipt attachment tracking, and manager reimbursement sign-off.
* **Chart of Accounts (`/finance/accounts`)**: GAAP/IFRS trial balance ledger across Assets, Liabilities, Equity, Revenue, and Expenses.
* **Projects Portfolio (`/projects`)**: Strategic deliverables with progress tracking, deadline indicators, and budget burn rate.
* **Sprint Tasks Kanban (`/tasks`)**: Drag-and-drop style sprint board with priorities, deadlines, and direct status updates.
* **Document Vault (`/documents`)**: Encrypted document register with category tagging and file downloads.
* **Company Calendar (`/calendar`)**: Sync schedules, company holidays, leave dates, and meeting booking.
* **Asset Register (`/assets`)**: Hardware, vehicles, and software license tracking by asset tag and serial number.
* **Helpdesk & Ticketing (`/tickets`)**: IT support and internal tickets with priority badges and SLA resolution flow.

### 7. Governance, Intelligence & Settings
* **Reporting Center (`/reports`)**: Consolidated reports for Sales, Payroll, Inventory, Expenses, and Attendance with **1-click export to PDF, Excel (.xlsx), and CSV**.
* **Global Search Modal (`Ctrl+K`)**: Live instant search across employees, customers, invoices, tasks, and products.
* **Security Audit Trail (`/audit-logs`)**: Immutable logging of user identity, actions, target module, and IP address.
* **Settings & Recovery (`/settings`)**: Company profile, currency and localization config, full database JSON backup export, and backup file restoration.

---

## 🚀 Running the Application

### Prerequisites
* Node.js 18+ (tested on Node v24)
* npm 10+

### Production Server (Currently Active)
```bash
# App is currently running and live at:
http://localhost:3000
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```
