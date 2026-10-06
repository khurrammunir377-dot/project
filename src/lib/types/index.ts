export type UserRole =
  | 'Super Admin'
  | 'Company Admin'
  | 'HR Manager'
  | 'Finance Manager'
  | 'Department Manager'
  | 'Employee'
  | 'Accountant'
  | 'Sales Manager'
  | 'Inventory Manager';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'import'
  | 'print';

export type ModuleName =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'recruitment'
  | 'performance'
  | 'customers'
  | 'sales'
  | 'inventory'
  | 'procurement'
  | 'expenses'
  | 'accounting'
  | 'projects'
  | 'tasks'
  | 'documents'
  | 'calendar'
  | 'assets'
  | 'tickets'
  | 'reports'
  | 'settings'
  | 'audit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  departmentId: string;
  branchId: string;
  jobTitle: string;
  employeeId: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  twoFactorEnabled: boolean;
  lastLogin?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  budget: number;
  target?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  manager: string;
  address: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export type EmploymentStatus =
  | 'Active'
  | 'Probation'
  | 'On Leave'
  | 'Suspended'
  | 'Resigned'
  | 'Terminated'
  | 'Retired';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  jobTitle: string;
  role: UserRole;
  manager: string;
  branch: string;
  joiningDate: string;
  status: EmploymentStatus;
  basicSalary: number;
  bankName: string;
  accountNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakDurationMinutes: number;
  workingHours: number;
  overtimeHours: number;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
  approved: boolean;
}

export type LeaveType =
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Emergency Leave'
  | 'Maternity / Paternity'
  | 'Unpaid Leave';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedOn: string;
  approvedBy?: string;
}

export interface Payslip {
  id: string;
  payslipNo: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  bonus: number;
  overtime: number;
  grossSalary: number;
  taxDeduction: number;
  socialInsurance: number;
  otherDeductions: number;
  netSalary: number;
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDate?: string;
  paymentMethod?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  positions: number;
  experienceLevel: string;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  applicationsCount: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Assessment' | 'Offer' | 'Hired' | 'Rejected';
  score: number;
  appliedDate: string;
  notes: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  score: number; // 1 to 5
  goalsMetPercent: number;
  strengths: string;
  improvements: string;
  status: 'Draft' | 'Completed';
  reviewedBy: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Lead' | 'Inactive';
  totalRevenue: number;
  outstandingBalance: number;
  assignedTo: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  title: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  value: number;
  probability: number;
  assignedTo: string;
  expectedCloseDate: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  expiryDate: string;
  items: {
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Converted';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partial' | 'Overdue';
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockLevel: number;
  warehouseId: string;
  warehouseName: string;
  unit: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  capacity: number;
  currentStockUnits: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  status: 'Active' | 'Inactive';
}

export interface PurchaseOrderItem {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  deliveryAddress?: string;
  paymentTerms?: string;
  notes?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Goods Received' | 'Paid' | 'Cancelled';
}

export interface VisitorSession {
  id: string;
  ipAddress: string;
  city: string;
  province: string;
  device: string;
  browser: string;
  os: string;
  activePage: string;
  referrer: string;
  duration: string;
  status: 'Active Now' | 'Idle' | 'Left';
  timestamp: string;
}

export interface ExpenseClaim {
  id: string;
  claimNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  receiptName?: string;
  status: 'Pending' | 'Approved' | 'Reimbursed' | 'Rejected';
  approvedBy?: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  currency: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  manager: string;
  department: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progressPercent: number;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Task {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Completed';
  dueDate: string;
  commentsCount: number;
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'HR' | 'Finance' | 'Contracts' | 'Operations' | 'Marketing' | 'Policies';
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  version: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Meeting' | 'Holiday' | 'Leave' | 'Milestone' | 'Interview';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
}

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: 'Computers' | 'Vehicles' | 'Equipment' | 'Furniture' | 'Software Licenses';
  serialNumber: string;
  purchaseDate: string;
  cost: number;
  assignedTo: string;
  department: string;
  status: 'In Use' | 'Maintenance' | 'Available' | 'Retired';
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'IT Support' | 'HR Inquiry' | 'Billing' | 'Facility' | 'General';
  requesterName: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'Normal' | 'High' | 'Urgent';
  department: string; // "All" or department name
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: ModuleName | string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface CompanySettings {
  companyName: string;
  registrationNumber: string;
  taxNumber: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  currency: string;
  currencySymbol: string;
  timeZone: string;
  fiscalYearStart: string;
  workingDaysPerWeek: number;
  standardWorkHoursPerDay: number;
  autoBackup: boolean;
  twoFactorRequired: boolean;
}
