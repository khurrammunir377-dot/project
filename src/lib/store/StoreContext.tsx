'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ERPStoreState, getInitialState, saveState, resetToSeed } from '../db';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  Payslip,
  Customer,
  Lead,
  Quotation,
  Invoice,
  Product,
  PurchaseOrder,
  ExpenseClaim,
  Task,
  DocumentRecord,
  CalendarEvent,
  Asset,
  Ticket,
  Announcement,
  CompanySettings,
  AuditLog,
  JobOpening,
  Candidate,
  PerformanceReview,
  User,
} from '../types';

interface StoreContextType {
  state: ERPStoreState;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (record: AttendanceRecord) => void;
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status'], approver: string) => void;
  addPayslip: (slip: Omit<Payslip, 'id'>) => void;
  updatePayslipStatus: (id: string, status: Payslip['status']) => void;
  addJobOpening: (job: Omit<JobOpening, 'id' | 'postedDate' | 'applicationsCount'>) => void;
  addCandidate: (cand: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  updateCandidateStage: (id: string, stage: Candidate['stage']) => void;
  addPerformanceReview: (rev: Omit<PerformanceReview, 'id' | 'date'>) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (cust: Customer) => void;
  deleteCustomer: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;
  addQuotation: (q: Omit<Quotation, 'id'>) => void;
  updateQuotationStatus: (id: string, status: Quotation['status']) => void;
  addInvoice: (inv: Omit<Invoice, 'id'>) => void;
  recordInvoicePayment: (id: string, amount: number) => void;
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProductStock: (id: string, delta: number) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  addExpenseClaim: (claim: Omit<ExpenseClaim, 'id' | 'claimNumber' | 'status'>) => void;
  updateExpenseStatus: (id: string, status: ExpenseClaim['status'], approver: string) => void;
  addTask: (task: Omit<Task, 'id' | 'commentsCount'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  addDocument: (doc: Omit<DocumentRecord, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (settings: Partial<CompanySettings>) => void;
  logAudit: (action: string, module: string, details: string, userName: string, userId: string) => void;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ERPStoreState>(getInitialState);

  useEffect(() => {
    const handleStorageChange = () => {
      setState(getInitialState());
    };
    window.addEventListener('erp_store_updated', handleStorageChange);
    return () => window.removeEventListener('erp_store_updated', handleStorageChange);
  }, []);

  const updateAndPersist = useCallback((updater: (prev: ERPStoreState) => ERPStoreState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const logAudit = useCallback((action: string, module: string, details: string, userName: string, userId: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userId,
      userName,
      action,
      module,
      details,
      ipAddress: '192.168.1.101',
      timestamp: new Date().toLocaleString(),
    };
    updateAndPersist((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs],
    }));
  }, [updateAndPersist]);

  // User Governance Methods
  const addUser = useCallback((user: User) => {
    updateAndPersist((prev) => ({
      ...prev,
      users: [...prev.users, user],
    }));
  }, [updateAndPersist]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    updateAndPersist((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));
  }, [updateAndPersist]);

  // HR Methods
  const addEmployee = useCallback((emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...emp, id: `emp-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      employees: [newEmp, ...prev.employees],
    }));
  }, [updateAndPersist]);

  const updateEmployee = useCallback((emp: Employee) => {
    updateAndPersist((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => (e.id === emp.id ? emp : e)),
    }));
  }, [updateAndPersist]);

  const deleteEmployee = useCallback((id: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      employees: prev.employees.filter((e) => e.id !== id),
    }));
  }, [updateAndPersist]);

  const addAttendance = useCallback((record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = { ...record, id: `att-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      attendance: [newRecord, ...prev.attendance],
    }));
  }, [updateAndPersist]);

  const updateAttendance = useCallback((record: AttendanceRecord) => {
    updateAndPersist((prev) => ({
      ...prev,
      attendance: prev.attendance.map((a) => (a.id === record.id ? record : a)),
    }));
  }, [updateAndPersist]);

  const addLeaveRequest = useCallback((req: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lve-${Date.now()}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    updateAndPersist((prev) => ({
      ...prev,
      leaveRequests: [newReq, ...prev.leaveRequests],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'New Leave Request',
          message: `${req.employeeName} submitted a ${req.leaveType} request.`,
          type: 'info',
          timestamp: 'Just now',
          read: false,
          link: '/hr/leave',
        },
        ...prev.notifications,
      ],
    }));
  }, [updateAndPersist]);

  const updateLeaveStatus = useCallback((id: string, status: LeaveRequest['status'], approver: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      leaveRequests: prev.leaveRequests.map((l) =>
        l.id === id ? { ...l, status, approvedBy: approver } : l
      ),
    }));
  }, [updateAndPersist]);

  const addPayslip = useCallback((slip: Omit<Payslip, 'id'>) => {
    const newSlip: Payslip = { ...slip, id: `pay-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      payslips: [newSlip, ...prev.payslips],
    }));
  }, [updateAndPersist]);

  const updatePayslipStatus = useCallback((id: string, status: Payslip['status']) => {
    updateAndPersist((prev) => ({
      ...prev,
      payslips: prev.payslips.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  }, [updateAndPersist]);

  const addJobOpening = useCallback((job: Omit<JobOpening, 'id' | 'postedDate' | 'applicationsCount'>) => {
    const newJob: JobOpening = {
      ...job,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      applicationsCount: 0,
    };
    updateAndPersist((prev) => ({
      ...prev,
      jobOpenings: [newJob, ...prev.jobOpenings],
    }));
  }, [updateAndPersist]);

  const addCandidate = useCallback((cand: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCand: Candidate = {
      ...cand,
      id: `cand-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
    };
    updateAndPersist((prev) => ({
      ...prev,
      candidates: [newCand, ...prev.candidates],
    }));
  }, [updateAndPersist]);

  const updateCandidateStage = useCallback((id: string, stage: Candidate['stage']) => {
    updateAndPersist((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => (c.id === id ? { ...c, stage } : c)),
    }));
  }, [updateAndPersist]);

  const addPerformanceReview = useCallback((rev: Omit<PerformanceReview, 'id' | 'date'>) => {
    const newRev: PerformanceReview = {
      ...rev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    updateAndPersist((prev) => ({
      ...prev,
      performanceReviews: [newRev, ...prev.performanceReviews],
    }));
  }, [updateAndPersist]);

  // CRM & Sales
  const addCustomer = useCallback((cust: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    updateAndPersist((prev) => ({
      ...prev,
      customers: [newCust, ...prev.customers],
    }));
  }, [updateAndPersist]);

  const updateCustomer = useCallback((cust: Customer) => {
    updateAndPersist((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === cust.id ? cust : c)),
    }));
  }, [updateAndPersist]);

  const deleteCustomer = useCallback((id: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      customers: prev.customers.filter((c) => c.id !== id),
    }));
  }, [updateAndPersist]);

  const addLead = useCallback((lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = { ...lead, id: `lead-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads],
    }));
  }, [updateAndPersist]);

  const updateLeadStage = useCallback((id: string, stage: Lead['stage']) => {
    updateAndPersist((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, stage } : l)),
    }));
  }, [updateAndPersist]);

  const addQuotation = useCallback((q: Omit<Quotation, 'id'>) => {
    const newQ: Quotation = { ...q, id: `quot-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      quotations: [newQ, ...prev.quotations],
    }));
  }, [updateAndPersist]);

  const updateQuotationStatus = useCallback((id: string, status: Quotation['status']) => {
    updateAndPersist((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) => (q.id === id ? { ...q, status } : q)),
    }));
  }, [updateAndPersist]);

  const addInvoice = useCallback((inv: Omit<Invoice, 'id'>) => {
    const newInv: Invoice = { ...inv, id: `inv-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      invoices: [newInv, ...prev.invoices],
    }));
  }, [updateAndPersist]);

  const recordInvoicePayment = useCallback((id: string, amount: number) => {
    updateAndPersist((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = inv.amountPaid + amount;
        const newBal = Math.max(0, inv.total - newPaid);
        return {
          ...inv,
          amountPaid: newPaid,
          balanceDue: newBal,
          status: newBal === 0 ? 'Paid' : 'Partial',
        };
      }),
    }));
  }, [updateAndPersist]);

  // Inventory & Procurement
  const addProduct = useCallback((prod: Omit<Product, 'id'>) => {
    const newProd: Product = { ...prod, id: `prod-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      products: [newProd, ...prev.products],
    }));
  }, [updateAndPersist]);

  const updateProductStock = useCallback((id: string, delta: number) => {
    updateAndPersist((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      ),
    }));
  }, [updateAndPersist]);

  const addPurchaseOrder = useCallback((po: Omit<PurchaseOrder, 'id'>) => {
    const newPO: PurchaseOrder = { ...po, id: `po-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      purchaseOrders: [newPO, ...prev.purchaseOrders],
    }));
  }, [updateAndPersist]);

  const updatePOStatus = useCallback((id: string, status: PurchaseOrder['status']) => {
    updateAndPersist((prev) => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  }, [updateAndPersist]);

  // Finance & Expenses
  const addExpenseClaim = useCallback((claim: Omit<ExpenseClaim, 'id' | 'claimNumber' | 'status'>) => {
    const newClaim: ExpenseClaim = {
      ...claim,
      id: `exp-${Date.now()}`,
      claimNumber: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
    };
    updateAndPersist((prev) => ({
      ...prev,
      expenseClaims: [newClaim, ...prev.expenseClaims],
    }));
  }, [updateAndPersist]);

  const updateExpenseStatus = useCallback((id: string, status: ExpenseClaim['status'], approver: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      expenseClaims: prev.expenseClaims.map((e) =>
        e.id === id ? { ...e, status, approvedBy: approver } : e
      ),
    }));
  }, [updateAndPersist]);

  // Tasks & Collaboration
  const addTask = useCallback((task: Omit<Task, 'id' | 'commentsCount'>) => {
    const newTask: Task = { ...task, id: `task-${Date.now()}`, commentsCount: 0 };
    updateAndPersist((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  }, [updateAndPersist]);

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    updateAndPersist((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  }, [updateAndPersist]);

  const deleteTask = useCallback((id: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, [updateAndPersist]);

  const addDocument = useCallback((doc: Omit<DocumentRecord, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    updateAndPersist((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }));
  }, [updateAndPersist]);

  const deleteDocument = useCallback((id: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  }, [updateAndPersist]);

  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = { ...event, id: `cal-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      calendarEvents: [newEv, ...prev.calendarEvents],
    }));
  }, [updateAndPersist]);

  const addAsset = useCallback((asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { ...asset, id: `ast-${Date.now()}` };
    updateAndPersist((prev) => ({
      ...prev,
      assets: [newAsset, ...prev.assets],
    }));
  }, [updateAndPersist]);

  const addTicket = useCallback((ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    updateAndPersist((prev) => ({
      ...prev,
      tickets: [newTicket, ...prev.tickets],
    }));
  }, [updateAndPersist]);

  const updateTicketStatus = useCallback((id: string, status: Ticket['status']) => {
    updateAndPersist((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  }, [updateAndPersist]);

  const addAnnouncement = useCallback((ann: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    updateAndPersist((prev) => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements],
    }));
  }, [updateAndPersist]);

  const markNotificationRead = useCallback((id: string) => {
    updateAndPersist((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, [updateAndPersist]);

  const markAllNotificationsRead = useCallback(() => {
    updateAndPersist((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, [updateAndPersist]);

  const updateSettings = useCallback((settings: Partial<CompanySettings>) => {
    updateAndPersist((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, [updateAndPersist]);

  const resetAllData = useCallback(() => {
    const fresh = resetToSeed();
    setState(fresh);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        state,
        addUser,
        updateUser,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addAttendance,
        updateAttendance,
        addLeaveRequest,
        updateLeaveStatus,
        addPayslip,
        updatePayslipStatus,
        addJobOpening,
        addCandidate,
        updateCandidateStage,
        addPerformanceReview,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addLead,
        updateLeadStage,
        addQuotation,
        updateQuotationStatus,
        addInvoice,
        recordInvoicePayment,
        addProduct,
        updateProductStock,
        addPurchaseOrder,
        updatePOStatus,
        addExpenseClaim,
        updateExpenseStatus,
        addTask,
        updateTaskStatus,
        deleteTask,
        addDocument,
        deleteDocument,
        addCalendarEvent,
        addAsset,
        addTicket,
        updateTicketStatus,
        addAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        logAudit,
        resetAllData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useERPStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useERPStore must be used within a StoreProvider');
  }
  return context;
}
