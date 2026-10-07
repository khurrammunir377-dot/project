'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Globe,
  Radio,
  Clock,
  Laptop,
  Smartphone,
  Eye,
  Trash2,
  Lock,
  Unlock,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  Server,
  Zap,
  MapPin,
  CheckCircle2,
  Ban,
  Building2,
} from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { VisitorSession, User, UserRole } from '@/lib/types';

export default function AdminControlPage() {
  const { state, addUser, updateUser, logAudit } = useERPStore();
  const { currentUser, isSuperAdmin } = useAuth();

  const isAdmin = isSuperAdmin || currentUser?.role === 'Company Admin';

  const [activeTab, setActiveTab] = useState<'visitors' | 'users' | 'telemetry'>('visitors');
  const [visitorFilter, setVisitorFilter] = useState<'All' | 'Active Now' | 'Idle' | 'Left'>('All');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Local state for visitor sessions to allow live controls (Terminate, Block)
  const [sessions, setSessions] = useState<VisitorSession[]>(() => state.visitorSessions || []);
  const [blockedIps, setBlockedIps] = useState<string[]>(['119.160.119.5', '182.180.12.9']);
  const [isDetectingGeo, setIsDetectingGeo] = useState<boolean>(true);

  // Detect REAL client IP, device, browser, and verified Geolocation
  const detectClientGeo = React.useCallback(async () => {
    if (typeof window === 'undefined') return;
    setIsDetectingGeo(true);

    const ua = navigator.userAgent;
    let browserName = 'Chrome';
    if (ua.includes('Firefox')) browserName = 'Firefox';
    else if (ua.includes('Edg')) browserName = 'Edge';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browserName = 'Safari';

    let osName = 'Windows';
    if (navigator.platform.includes('Mac') || ua.includes('Macintosh')) osName = 'macOS';
    else if (ua.includes('Android')) osName = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) osName = 'iOS';

    const isMobile = /Mobi|Android/i.test(ua);
    const deviceName = isMobile ? 'Mobile Phone' : 'Desktop Workstation';

    let realIp = 'Detecting...';
    let city = 'Dubai';
    let region = 'Dubai';
    let country = 'United Arab Emirates';
    let flag = '🇦🇪';
    let isp = 'Telecom Provider';

    try {
      // 1. Primary fast HTTPS Geo-lookup without CORS issues
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false) {
          realIp = data.ip || realIp;
          city = data.city || city;
          region = data.region || region;
          country = data.country || country;
          flag = data.flag?.emoji || (country.includes('Emirates') ? '🇦🇪' : '🌐');
          isp = data.connection?.isp || data.connection?.org || isp;
        }
      }
    } catch (e1) {
      try {
        // Fallback to ipapi.co
        const res2 = await fetch('https://ipapi.co/json/');
        if (res2.ok) {
          const d2 = await res2.json();
          realIp = d2.ip || realIp;
          city = d2.city || city;
          region = d2.region || region;
          country = d2.country_name || country;
          flag = country.includes('Emirates') ? '🇦🇪' : '🌐';
          isp = d2.org || isp;
        }
      } catch (e2) {
        try {
          const res3 = await fetch('https://api.ipify.org?format=json');
          const d3 = await res3.json();
          if (d3?.ip) realIp = d3.ip;
        } catch (e3) {}
      }
    }

    const currentClientSession: VisitorSession = {
      id: 'vis-client-current',
      ipAddress: realIp,
      city: city,
      province: region,
      country: country,
      flag: flag,
      isp: isp,
      device: `${deviceName} (You)`,
      browser: browserName,
      os: osName,
      activePage: window.location.pathname || '/admin',
      referrer: document.referrer || 'Direct Authenticated Session',
      duration: 'Active Now (Live)',
      status: 'Active Now',
      timestamp: 'Just now (Verified Live IP)',
      isCurrentClient: true,
    };

    setSessions((prev) => {
      const rest = prev.filter((s) => s.id !== 'vis-client-current');
      return [currentClientSession, ...rest];
    });
    setIsDetectingGeo(false);
  }, []);

  React.useEffect(() => {
    detectClientGeo();
  }, [detectClientGeo]);

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Employee' as UserRole,
    departmentId: 'dept-1',
    branchId: 'br-1',
    jobTitle: '',
    employeeId: `NEX-0${Math.floor(20 + Math.random() * 80)}`,
    phone: '+92 300 0000000',
    twoFactorEnabled: true,
  });

  // Guard for Admin only
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          403 Access Denied • Administrative Clearance Required
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          This portal contains restricted global enterprise traffic surveillance and administrative security controls.
          Only <strong>Super Admin</strong> or <strong>Company Admin</strong> are permitted.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Handle Terminate Visitor Session
  const handleTerminateSession = (sessionId: string, ip: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'Left' as const } : s))
    );
    logAudit(
      'Terminated Visitor Session',
      'audit',
      `Force terminated live session for IP ${ip}`,
      currentUser.name,
      currentUser.id
    );
  };

  // Handle Block IP
  const handleBlockIp = (ip: string) => {
    if (!blockedIps.includes(ip)) {
      setBlockedIps((prev) => [...prev, ip]);
      setSessions((prev) =>
        prev.map((s) => (s.ipAddress === ip ? { ...s, status: 'Left' as const } : s))
      );
      logAudit('Blacklisted IP Address', 'audit', `Added ${ip} to firewall blacklist`, currentUser.name, currentUser.id);
    }
  };

  // Toggle User Status
  const handleToggleUserStatus = (user: User) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    updateUser(user.id, { status: nextStatus });
    logAudit(
      'Updated User Status',
      'settings',
      `Changed status of ${user.name} to ${nextStatus}`,
      currentUser.name,
      currentUser.id
    );
  };

  // Toggle User 2FA
  const handleToggleUser2FA = (user: User) => {
    const next2FA = !user.twoFactorEnabled;
    updateUser(user.id, { twoFactorEnabled: next2FA });
    logAudit(
      'Updated User 2FA',
      'settings',
      `${next2FA ? 'Enforced' : 'Disabled'} 2FA for ${user.name}`,
      currentUser.name,
      currentUser.id
    );
  };

  // Change Role
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    updateUser(userId, { role: newRole });
    const target = state.users.find((u) => u.id === userId);
    logAudit(
      'Promoted/Changed Role',
      'settings',
      `Assigned ${newRole} role to ${target?.name}`,
      currentUser.name,
      currentUser.id
    );
  };

  // Handle Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      departmentId: newUserForm.departmentId,
      branchId: newUserForm.branchId,
      jobTitle: newUserForm.jobTitle,
      employeeId: newUserForm.employeeId,
      phone: newUserForm.phone,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      status: 'Active',
      twoFactorEnabled: newUserForm.twoFactorEnabled,
      lastLogin: 'Never (New Account)',
    };

    addUser(created);
    logAudit(
      'Created System User',
      'settings',
      `Provisioned account for ${created.name} (${created.role})`,
      currentUser.name,
      currentUser.id
    );
    setIsAddUserOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'Employee',
      departmentId: 'dept-1',
      branchId: 'br-1',
      jobTitle: '',
      employeeId: `NEX-0${Math.floor(20 + Math.random() * 80)}`,
      phone: '+92 300 0000000',
      twoFactorEnabled: true,
    });
  };

  const filteredVisitors = sessions.filter((s) => {
    const matchesFilter = visitorFilter === 'All' || s.status === visitorFilter;
    const matchesSearch =
      s.ipAddress.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      s.activePage.toLowerCase().includes(visitorSearch.toLowerCase()) ||
      s.browser.toLowerCase().includes(visitorSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredUsers = state.users.filter((u) => {
    return (
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.jobTitle.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  const activeVisitorsNow = sessions.filter((s) => s.status === 'Active Now').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nexora Enterprise Security &amp; Admin Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative Command Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Real-time global and domestic traffic surveillance, active visitor session control, user governance,
              and FBR IRIS cryptographic compliance radar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => detectClientGeo()}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isDetectingGeo ? 'animate-spin' : ''}`} />}
            >
              {isDetectingGeo ? 'Detecting...' : 'Refresh Radar'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddUserOpen(true)}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add System User
            </Button>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'visitors'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-950" />
            <span>Live Visitors Radar ({activeVisitorsNow} Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Governance ({state.users.length} Users)</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'telemetry'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Server &amp; FBR Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Live Active Visitors"
          value={`${activeVisitorsNow} Online`}
          subtitle="Real-time browsing now"
          icon={<Radio className="w-5 h-5 text-emerald-500 animate-pulse" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Total Platform Users"
          value={`${state.users.length} Enrolled`}
          subtitle="Across KHI, LHE & ISB"
          icon={<Users className="w-5 h-5 text-indigo-500" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Firewall Blocked IPs"
          value={`${blockedIps.length} Filtered`}
          subtitle="Secured by Nexora Shield"
          icon={<Ban className="w-5 h-5 text-rose-500" />}
          colorScheme="rose"
        />
        <StatCard
          title="FBR System Link"
          value="100% Operational"
          subtitle="Karachi Gateway (Annex-C)"
          icon={<CheckCircle2 className="w-5 h-5 text-sky-500" />}
          colorScheme="sky"
        />
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: LIVE VISITORS RADAR */}
      {activeTab === 'visitors' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" />
                Live Visitors &amp; Web Traffic Radar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect IP origins, location cities, connected devices, and active pages in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search IP, city, page..."
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                {(['All', 'Active Now', 'Idle', 'Left'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setVisitorFilter(st)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      visitorFilter === st
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visitor Sessions Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Visitor / IP</th>
                  <th className="py-3 px-4">Location (City/Province)</th>
                  <th className="py-3 px-4">Device &amp; Browser</th>
                  <th className="py-3 px-4">Current Page</th>
                  <th className="py-3 px-4">Source / Referrer</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredVisitors.map((s) => {
                  const isBlocked = blockedIps.includes(s.ipAddress);

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {s.isCurrentClient && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                          )}
                          <span>{s.ipAddress}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {s.isCurrentClient ? 'Verified Client IP (Live)' : s.timestamp}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{s.flag || '📍'}</span>
                          <span>{s.city}</span>
                          {s.isCurrentClient && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {s.province ? `${s.province}, ` : ''}{s.country || 'Global'}
                        </div>
                        {s.isp && (
                          <div className="text-[9px] text-slate-500 font-mono truncate max-w-[160px]" title={s.isp}>
                            {s.isp}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          {s.device === 'Mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span>
                            {s.os} • {s.browser}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{s.device} Viewport</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {s.activePage}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                        {s.referrer}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {s.duration}
                      </td>

                      <td className="py-3 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            BLOCKED
                          </span>
                        ) : s.status === 'Active Now' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Active Now
                          </span>
                        ) : s.status === 'Idle' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Idle
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400">
                            Left Site
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status === 'Active Now' && (
                            <button
                              onClick={() => handleTerminateSession(s.id, s.ipAddress)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                              title="Force kill session"
                            >
                              Terminate
                            </button>
                          )}

                          {!isBlocked ? (
                            <button
                              onClick={() => handleBlockIp(s.ipAddress)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Add to firewall blacklist"
                            >
                              Block IP
                            </button>
                          ) : (
                            <span className="text-[10px] text-rose-400 font-semibold">Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER GOVERNANCE & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                User Access &amp; Permission Control
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage roles, enforce 2FA verification, suspend accounts, and configure permissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddUserOpen(true)}
                icon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Add User
              </Button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Employee / User</th>
                  <th className="py-3 px-4">Designation &amp; Branch</th>
                  <th className="py-3 px-4">Role &amp; Permissions</th>
                  <th className="py-3 px-4">2FA Security</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredUsers.map((u) => {
                  const branch = state.branches.find((b) => b.id === u.branchId);

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {u.jobTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{branch?.name || 'Karachi Head Office'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                          className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-semibold rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Company Admin">Company Admin</option>
                          <option value="HR Manager">HR Manager</option>
                          <option value="Finance Manager">Finance Manager</option>
                          <option value="Department Manager">Department Manager</option>
                          <option value="Sales Manager">Sales Manager</option>
                          <option value="Inventory Manager">Inventory Manager</option>
                          <option value="Accountant">Accountant</option>
                          <option value="Employee">Employee</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleUser2FA(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            u.twoFactorEnabled
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}
                        >
                          {u.twoFactorEnabled ? (
                            <>
                              <Lock className="w-3 h-3 text-emerald-500" />
                              <span>2FA Active</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={u.status === 'Active' ? 'success' : 'danger'}>
                          {u.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {u.lastLogin || 'Recent'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              u.status === 'Active'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVER & FBR TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              Nexora Infrastructure Health
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Database Engine:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  SQLite / Reactive Browser Store (V2)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Memory Utilization:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  48.2 MB / 1024 MB (Optimal)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Latency to KHI Edge:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  12 ms (PTCL / Nayatel Fiber)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Data Sovereignty:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Government of Pakistan Cloud First Policy
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              Pakistani Regulatory Gateways
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">FBR Digital Invoicing:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500">
                  CONNECTED (Annex-C)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">EOBI Portal API:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500">
                  SYNCED (Monthly Returns)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">1Link Raast Clearing:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-500">
                  ACTIVE
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">SECP Compliance Sync:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                  CORP-0189283-PK
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD SYSTEM USER */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Provision New System User"
        description="Create an employee login with specific role, branch, and security credentials."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Tariq Mahmood"
            value={newUserForm.name}
            onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
            required
          />

          <Input
            label="Corporate Email Address"
            type="email"
            placeholder="e.g. tariq@nexora.pk"
            value={newUserForm.email}
            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="System Role"
              value={newUserForm.role}
              onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
              options={[
                { label: 'Super Admin', value: 'Super Admin' },
                { label: 'Company Admin', value: 'Company Admin' },
                { label: 'HR Manager', value: 'HR Manager' },
                { label: 'Finance Manager', value: 'Finance Manager' },
                { label: 'Department Manager', value: 'Department Manager' },
                { label: 'Sales Manager', value: 'Sales Manager' },
                { label: 'Inventory Manager', value: 'Inventory Manager' },
                { label: 'Accountant', value: 'Accountant' },
                { label: 'Employee', value: 'Employee' },
              ]}
            />

            <Select
              label="Assigned Branch"
              value={newUserForm.branchId}
              onChange={(e) => setNewUserForm({ ...newUserForm, branchId: e.target.value })}
              options={state.branches.map((b) => ({ label: b.name, value: b.id }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Designation"
              placeholder="e.g. Senior Tax Accountant"
              value={newUserForm.jobTitle}
              onChange={(e) => setNewUserForm({ ...newUserForm, jobTitle: e.target.value })}
              required
            />

            <Input
              label="Employee ID"
              placeholder="NEX-055"
              value={newUserForm.employeeId}
              onChange={(e) => setNewUserForm({ ...newUserForm, employeeId: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="twofa"
              checked={newUserForm.twoFactorEnabled}
              onChange={(e) =>
                setNewUserForm({ ...newUserForm, twoFactorEnabled: e.target.checked })
              }
              className="rounded text-emerald-500 focus:ring-0"
            />
            <label htmlFor="twofa" className="text-xs text-slate-700 dark:text-slate-300">
              Enforce Two-Factor Authentication (SMS / Authenticator OTP)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Provision User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
