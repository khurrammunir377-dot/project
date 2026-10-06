'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PermissionAction, ModuleName, Branch } from '../types';
import { useERPStore } from '../store/StoreContext';

interface AuthContextType {
  currentUser: User;
  users: User[];
  currentBranch: Branch;
  branches: Branch[];
  setCurrentBranch: (branch: Branch) => void;
  switchUser: (userId: string) => void;
  can: (module: ModuleName, action: PermissionAction) => boolean;
  logout: () => void;
  login: (email: string, password?: string) => boolean;
  loginAs: (email: string) => boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Enterprise Permission Matrix
const ROLE_PERMISSIONS: Record<UserRole, Partial<Record<ModuleName, PermissionAction[]>>> = {
  'Super Admin': {
    dashboard: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    employees: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    attendance: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    leave: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    payroll: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    recruitment: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    performance: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    customers: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    sales: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    inventory: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    procurement: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    expenses: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    accounting: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    projects: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    tasks: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    documents: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    calendar: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    assets: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    tickets: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    reports: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    settings: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    audit: ['view', 'export', 'print'],
  },
  'Company Admin': {
    dashboard: ['view', 'export', 'print'],
    employees: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    attendance: ['view', 'create', 'edit', 'approve', 'export'],
    leave: ['view', 'create', 'approve', 'export'],
    payroll: ['view', 'create', 'approve', 'export', 'print'],
    recruitment: ['view', 'create', 'edit', 'approve'],
    performance: ['view', 'create', 'edit', 'approve'],
    customers: ['view', 'create', 'edit', 'export'],
    sales: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    inventory: ['view', 'create', 'edit', 'export'],
    procurement: ['view', 'create', 'approve', 'export'],
    expenses: ['view', 'approve', 'export'],
    accounting: ['view', 'export', 'print'],
    projects: ['view', 'create', 'edit', 'approve', 'export'],
    tasks: ['view', 'create', 'edit', 'approve'],
    documents: ['view', 'create', 'edit', 'export'],
    calendar: ['view', 'create', 'edit'],
    assets: ['view', 'create', 'edit'],
    tickets: ['view', 'create', 'edit', 'approve'],
    reports: ['view', 'export', 'print'],
    settings: ['view', 'edit'],
    audit: ['view', 'export'],
  },
  'HR Manager': {
    dashboard: ['view'],
    employees: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import', 'print'],
    attendance: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    leave: ['view', 'create', 'approve', 'export', 'print'],
    payroll: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    recruitment: ['view', 'create', 'edit', 'approve', 'export'],
    performance: ['view', 'create', 'edit', 'approve', 'export'],
    documents: ['view', 'create', 'export'],
    calendar: ['view', 'create'],
    tickets: ['view', 'create', 'edit'],
    reports: ['view', 'export', 'print'],
  },
  'Finance Manager': {
    dashboard: ['view'],
    payroll: ['view', 'approve', 'export', 'print'],
    customers: ['view', 'export'],
    sales: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    procurement: ['view', 'approve', 'export'],
    expenses: ['view', 'create', 'approve', 'export', 'print'],
    accounting: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    reports: ['view', 'export', 'print'],
  },
  'Department Manager': {
    dashboard: ['view'],
    employees: ['view'],
    attendance: ['view', 'approve'],
    leave: ['view', 'approve'],
    performance: ['view', 'create', 'edit'],
    projects: ['view', 'create', 'edit', 'approve'],
    tasks: ['view', 'create', 'edit', 'approve'],
    documents: ['view', 'create'],
    calendar: ['view', 'create'],
    tickets: ['view', 'create', 'edit'],
    reports: ['view', 'export'],
  },
  'Employee': {
    dashboard: ['view'],
    employees: ['view'],
    attendance: ['view', 'create'],
    leave: ['view', 'create'],
    payroll: ['view', 'print'],
    performance: ['view'],
    tasks: ['view', 'create', 'edit'],
    documents: ['view'],
    calendar: ['view'],
    tickets: ['view', 'create'],
    expenses: ['view', 'create'],
  },
  'Accountant': {
    dashboard: ['view'],
    payroll: ['view', 'export'],
    sales: ['view', 'export', 'print'],
    expenses: ['view', 'create', 'export'],
    accounting: ['view', 'create', 'edit', 'export', 'print'],
    reports: ['view', 'export', 'print'],
  },
  'Sales Manager': {
    dashboard: ['view'],
    customers: ['view', 'create', 'edit', 'export'],
    sales: ['view', 'create', 'edit', 'approve', 'export', 'print'],
    inventory: ['view'],
    projects: ['view'],
    reports: ['view', 'export'],
  },
  'Inventory Manager': {
    dashboard: ['view'],
    inventory: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'import'],
    procurement: ['view', 'create', 'edit', 'approve', 'export'],
    assets: ['view', 'create', 'edit'],
    reports: ['view', 'export'],
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, logAudit } = useERPStore();
  const [currentUser, setCurrentUser] = useState<User>(() => state.users[0]);
  const [currentBranch, setCurrentBranch] = useState<Branch>(() => state.branches[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('nexora_auth_user');
      if (savedUserId) {
        const found = state.users.find((u) => u.id === savedUserId);
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        } else if (state.users.length > 0) {
          setCurrentUser(state.users[0]);
          setIsAuthenticated(true);
        }
      }
      setIsHydrated(true);
    }
  }, [state.users]);

  useEffect(() => {
    // Keep user updated if users list updates
    const existing = state.users.find((u) => u.id === currentUser.id);
    if (existing) {
      setCurrentUser(existing);
    }
  }, [state.users, currentUser.id]);

  const switchUser = (userId: string) => {
    const target = state.users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexora_auth_user', target.id);
      }
      logAudit(
        'Switched Active Role/User',
        'settings',
        `Switched session to ${target.name} (${target.role})`,
        target.name,
        target.id
      );
    }
  };

  const login = (email: string, password?: string): boolean => {
    const target = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (target) {
      setCurrentUser(target);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexora_auth_user', target.id);
      }
      logAudit('User Login', 'dashboard', `User logged in: ${target.email} (${target.role})`, target.name, target.id);
      return true;
    }
    return false;
  };

  const loginAs = (email: string): boolean => {
    return login(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexora_auth_user');
    }
    logAudit('User Logout', 'dashboard', `User logged out: ${currentUser.email}`, currentUser.name, currentUser.id);
  };

  const can = (module: ModuleName, action: PermissionAction): boolean => {
    if (currentUser.role === 'Super Admin') return true;
    const permissions = ROLE_PERMISSIONS[currentUser.role]?.[module];
    if (!permissions) return false;
    return permissions.includes(action);
  };

  const isSuperAdmin = currentUser.role === 'Super Admin';
  const isManager = currentUser.role.includes('Manager') || currentUser.role.includes('Admin');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users: state.users,
        currentBranch,
        branches: state.branches,
        setCurrentBranch,
        switchUser,
        can,
        logout,
        login,
        loginAs,
        isAuthenticated,
        isHydrated,
        isSuperAdmin,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
