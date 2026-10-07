'use client';

import React, { useState } from 'react';
import { Plus, Users, Mail, Phone, Building, Briefcase, Eye, Trash2, Edit, X, Check } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Employee, EmploymentStatus, UserRole } from '@/lib/types';

export default function EmployeesPage() {
  const { state, addEmployee, updateEmployee, deleteEmployee, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [detailEmp, setDetailEmp] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'employment' | 'payroll' | 'emergency'>('overview');

  // New Employee Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    cnic: '',
    address: '',
    ntn: '',
    email: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    department: 'Software Engineering & IT',
    jobTitle: '',
    role: 'Employee' as UserRole,
    manager: 'Muhammad Hamza Khan',
    branch: 'Karachi Corporate Head Office',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active' as EmploymentStatus,
    basicSalary: 250000,
    bankName: 'Meezan Bank Ltd',
    accountNumber: 'PK92MEZN00123456789012',
    emergencyName: '',
    emergencyRelationship: 'Family',
    emergencyPhone: '',
    skills: 'React, Next.js, FBR Tax, ICAP',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    const newEmp: Omit<Employee, 'id'> = {
      employeeId: `NEX-${Math.floor(100 + Math.random() * 900)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fatherName: formData.fatherName || 'Not specified',
      cnic: formData.cnic || '42101-1234567-1',
      address: formData.address || 'Karachi, Sindh, Pakistan',
      ntn: formData.ntn || '7492819-3',
      email: formData.email,
      phone: formData.phone || '+92 300 1234567',
      avatar: formData.avatar,
      department: formData.department,
      jobTitle: formData.jobTitle || 'Senior Specialist',
      role: formData.role,
      manager: formData.manager,
      branch: formData.branch,
      joiningDate: formData.joiningDate,
      status: formData.status,
      basicSalary: Number(formData.basicSalary),
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      emergencyContact: {
        name: formData.emergencyName || 'Emergency Contact',
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone || '+92 321 9876543',
      },
      skills: formData.skills.split(',').map((s) => s.trim()),
    };

    addEmployee(newEmp);
    logAudit(
      'Created Employee',
      'employees',
      `Added new employee: ${formData.firstName} ${formData.lastName} (${formData.department})`,
      currentUser.name,
      currentUser.id
    );
    setIsAddOpen(false);
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Employee',
      accessorKey: 'firstName',
      sortable: true,
      render: (emp) => (
        <div className="flex items-center gap-3">
          <img
            src={emp.avatar}
            alt={emp.firstName}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {emp.firstName} {emp.lastName}
            </div>
            <div className="text-xs text-slate-400">{emp.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Job Title & Role',
      accessorKey: 'jobTitle',
      sortable: true,
      render: (emp) => (
        <div>
          <div className="font-medium text-slate-800 dark:text-slate-200">{emp.jobTitle}</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">{emp.role}</div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      sortable: true,
      render: (emp) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {emp.department}
        </span>
      ),
    },
    {
      header: 'Branch',
      accessorKey: 'branch',
      sortable: true,
      render: (emp) => <span className="text-xs text-slate-500">{emp.branch}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (emp) => {
        const variants: Record<string, any> = {
          Active: 'success',
          Probation: 'warning',
          'On Leave': 'info',
          Suspended: 'danger',
          Resigned: 'neutral',
        };
        return <Badge variant={variants[emp.status] || 'neutral'}>{emp.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      render: (emp) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setDetailEmp(emp)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {can('employees', 'delete') && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) {
                  deleteEmployee(emp.id);
                  logAudit(
                    'Deleted Employee',
                    'employees',
                    `Deleted employee: ${emp.firstName} ${emp.lastName}`,
                    currentUser.name,
                    currentUser.id
                  );
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Employee Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized directory of all company staff, organizational roles, and employment profiles.
          </p>
        </div>

        {can('employees', 'create') && (
          <Button onClick={() => setIsAddOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add New Employee
          </Button>
        )}
      </div>

      {/* Employees DataTable */}
      <DataTable
        data={state.employees}
        columns={columns}
        searchPlaceholder="Search employees by name, department, role..."
        searchKey={(emp) => `${emp.firstName} ${emp.lastName} ${emp.department} ${emp.jobTitle}`}
        onRowClick={(emp) => setDetailEmp(emp)}
        exportFileName="Nexora_Employees_Directory"
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Employee"
        description="Register a new staff member to the company management database."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Tariq"
            />
            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Mahmood"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Work Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. tariq@nexora.pk"
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+92 300 1234567"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Father's / Husband's Name"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              placeholder="e.g. Tariq Mahmood Khan"
            />
            <Input
              label="National ID Card (CNIC)"
              value={formData.cnic}
              onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
              placeholder="e.g. 42101-1234567-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Residential Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. House 42, Block 6, PECHS, Karachi"
            />
            <Input
              label="National Tax Number (NTN)"
              value={formData.ntn}
              onChange={(e) => setFormData({ ...formData, ntn: e.target.value })}
              placeholder="e.g. 7492819-3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={state.departments.map((d) => ({ label: d.name, value: d.name }))}
            />
            <Input
              label="Job Title"
              required
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              placeholder="e.g. Backend Lead"
            />
            <Select
              label="System Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              options={[
                { label: 'Employee', value: 'Employee' },
                { label: 'Department Manager', value: 'Department Manager' },
                { label: 'HR Manager', value: 'HR Manager' },
                { label: 'Finance Manager', value: 'Finance Manager' },
                { label: 'Sales Manager', value: 'Sales Manager' },
                { label: 'Inventory Manager', value: 'Inventory Manager' },
                { label: 'Accountant', value: 'Accountant' },
                { label: 'Company Admin', value: 'Company Admin' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Assigned Branch"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              options={state.branches.map((b) => ({ label: b.name, value: b.name }))}
            />
            <Input
              label="Monthly Basic Salary (PKR)"
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
            />
            <Select
              label="Employment Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Probation', value: 'Probation' },
                { label: 'On Leave', value: 'On Leave' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <Input
              label="Emergency Contact Name"
              value={formData.emergencyName}
              onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
              placeholder="e.g. Tariq Mahmood (Father)"
            />
            <Input
              label="Relationship"
              value={formData.emergencyRelationship}
              onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
              placeholder="Father / Spouse / Brother"
            />
            <Input
              label="Emergency Phone"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              placeholder="+92 321 9876543"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Employee
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detailed Multi-Tab Employee Profile Modal */}
      {detailEmp && (
        <Modal
          isOpen={!!detailEmp}
          onClose={() => setDetailEmp(null)}
          title={`${detailEmp.firstName} ${detailEmp.lastName}`}
          description={`${detailEmp.jobTitle} • ${detailEmp.employeeId}`}
          maxWidth="2xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setDetailEmp(null)}>
              Close Profile
            </Button>
          }
        >
          {/* Header Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <img
              src={detailEmp.avatar}
              alt={detailEmp.firstName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {detailEmp.firstName} {detailEmp.lastName}
              </h3>
              <p className="text-xs text-slate-500">{detailEmp.jobTitle} • {detailEmp.department}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="indigo">{detailEmp.role}</Badge>
                <Badge variant="success">{detailEmp.status}</Badge>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
            {(['overview', 'employment', 'payroll', 'emergency'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-2 text-xs space-y-3">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Work Email</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.email}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.phone}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Father / Husband Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.fatherName || 'Tariq Mahmood'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">CNIC / ID Card</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{detailEmp.cnic || '42101-1234567-1'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">National Tax Number (NTN)</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{detailEmp.ntn || '7492819-3'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Branch Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.branch}</span>
                </div>
                <div className="col-span-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Residential Address</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.address || 'House 42, Block 6, PECHS, Karachi, Pakistan'}</span>
                </div>
                <div className="col-span-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-1">Key Competencies &amp; Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailEmp.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employment' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block mb-0.5">Joining Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.joiningDate}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block mb-0.5">Contract Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Full-Time Indefinite</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payroll' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Basic Monthly Salary</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Rs. {detailEmp.basicSalary.toLocaleString()} / mo
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block mb-0.5">Bank Disbursal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {detailEmp.bankName} ({detailEmp.accountNumber})
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Name:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Relationship:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.emergencyContact.relationship}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Phone:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailEmp.emergencyContact.phone}</span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
