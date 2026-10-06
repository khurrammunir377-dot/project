'use client';

import {
  initialCompanySettings,
  initialBranches,
  initialDepartments,
  initialUsers,
  initialEmployees,
  initialAttendance,
  initialLeaveRequests,
  initialPayslips,
  initialJobOpenings,
  initialCandidates,
  initialPerformanceReviews,
  initialCustomers,
  initialLeads,
  initialQuotations,
  initialInvoices,
  initialWarehouses,
  initialProducts,
  initialSuppliers,
  initialPurchaseOrders,
  initialExpenseClaims,
  initialAccounts,
  initialProjects,
  initialTasks,
  initialDocuments,
  initialCalendarEvents,
  initialAssets,
  initialTickets,
  initialAnnouncements,
  initialNotifications,
  initialAuditLogs,
} from './seed';

import {
  CompanySettings,
  Branch,
  Department,
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  Payslip,
  JobOpening,
  Candidate,
  PerformanceReview,
  Customer,
  Lead,
  Quotation,
  Invoice,
  Warehouse,
  Product,
  Supplier,
  PurchaseOrder,
  ExpenseClaim,
  Account,
  Project,
  Task,
  DocumentRecord,
  CalendarEvent,
  Asset,
  Ticket,
  Announcement,
  NotificationItem,
  AuditLog,
  VisitorSession,
} from '../types';
import { initialVisitorSessions } from './seed';

export interface ERPStoreState {
  settings: CompanySettings;
  branches: Branch[];
  departments: Department[];
  users: User[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payslips: Payslip[];
  jobOpenings: JobOpening[];
  candidates: Candidate[];
  performanceReviews: PerformanceReview[];
  customers: Customer[];
  leads: Lead[];
  quotations: Quotation[];
  invoices: Invoice[];
  warehouses: Warehouse[];
  products: Product[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  expenseClaims: ExpenseClaim[];
  accounts: Account[];
  projects: Project[];
  tasks: Task[];
  documents: DocumentRecord[];
  calendarEvents: CalendarEvent[];
  assets: Asset[];
  tickets: Ticket[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  visitorSessions: VisitorSession[];
}

const STORAGE_KEY = 'NEXORA_ERP_DATABASE_V2';

export function getInitialState(): ERPStoreState {
  if (typeof window === 'undefined') {
    return {
      settings: initialCompanySettings,
      branches: initialBranches,
      departments: initialDepartments,
      users: initialUsers,
      employees: initialEmployees,
      attendance: initialAttendance,
      leaveRequests: initialLeaveRequests,
      payslips: initialPayslips,
      jobOpenings: initialJobOpenings,
      candidates: initialCandidates,
      performanceReviews: initialPerformanceReviews,
      customers: initialCustomers,
      leads: initialLeads,
      quotations: initialQuotations,
      invoices: initialInvoices,
      warehouses: initialWarehouses,
      products: initialProducts,
      suppliers: initialSuppliers,
      purchaseOrders: initialPurchaseOrders,
      expenseClaims: initialExpenseClaims,
      accounts: initialAccounts,
      projects: initialProjects,
      tasks: initialTasks,
      documents: initialDocuments,
      calendarEvents: initialCalendarEvents,
      assets: initialAssets,
      tickets: initialTickets,
      announcements: initialAnnouncements,
      notifications: initialNotifications,
      auditLogs: initialAuditLogs,
      visitorSessions: initialVisitorSessions,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.visitorSessions) {
        parsed.visitorSessions = initialVisitorSessions;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading ERP storage', err);
  }

  return {
    settings: initialCompanySettings,
    branches: initialBranches,
    departments: initialDepartments,
    users: initialUsers,
    employees: initialEmployees,
    attendance: initialAttendance,
    leaveRequests: initialLeaveRequests,
    payslips: initialPayslips,
    jobOpenings: initialJobOpenings,
    candidates: initialCandidates,
    performanceReviews: initialPerformanceReviews,
    customers: initialCustomers,
    leads: initialLeads,
    quotations: initialQuotations,
    invoices: initialInvoices,
    warehouses: initialWarehouses,
    products: initialProducts,
    suppliers: initialSuppliers,
    purchaseOrders: initialPurchaseOrders,
    expenseClaims: initialExpenseClaims,
    accounts: initialAccounts,
    projects: initialProjects,
    tasks: initialTasks,
    documents: initialDocuments,
    calendarEvents: initialCalendarEvents,
    assets: initialAssets,
    tickets: initialTickets,
    announcements: initialAnnouncements,
    notifications: initialNotifications,
    auditLogs: initialAuditLogs,
    visitorSessions: initialVisitorSessions,
  };
}

export function saveState(state: ERPStoreState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('erp_store_updated'));
  } catch (err) {
    console.error('Error saving ERP storage', err);
  }
}

export function resetToSeed(): ERPStoreState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('erp_store_updated'));
  }
  return getInitialState();
}
