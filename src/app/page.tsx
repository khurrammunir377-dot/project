'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  CreditCard,
  Package,
  FileText,
  BarChart3,
  Check,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  Receipt,
  Headphones,
  Lock,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { NexoraLogo } from '@/components/ui/NexoraLogo';
import { WavingPakistanFlag } from '@/components/ui/WavingPakistanFlag';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Pakistan FBR Compliant
        </span>
        <span>
          Now fully integrated with <strong>FBR Digital Invoicing, Annexure-C Filing & EOBI Social Security</strong>
        </span>
        <Link href="/login" className="underline font-bold hover:text-emerald-100 hidden sm:inline">
          Launch Live ERP Portal →
        </Link>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NexoraLogo size="md" href="/" animated={true} />

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#modules" className="hover:text-emerald-400 transition-colors">ERP Modules</a>
            <a href="#compliance" className="hover:text-emerald-400 transition-colors">FBR & EOBI Compliance</a>
            <a href="#locations" className="hover:text-emerald-400 transition-colors">Offices (KHI • LHE • ISB)</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing (PKR)</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 hidden sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Launch ERP Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION WITH WAVING PAKISTANI FLAG IN BACKGROUND */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Full Waved Pakistani Flag - Light, Waving in Background */}
        <WavingPakistanFlag className="opacity-35" />

        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Hero Foreground Content on Top of Flag */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-400/40 bg-slate-950/80 backdrop-blur-md text-emerald-300 text-xs font-semibold mb-6 shadow-lg shadow-emerald-950/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Designed Specially for Pakistani Business Environments
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] drop-shadow-md">
            Pakistan&apos;s Complete Enterprise{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              Business Management Platform
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow">
            Unify your company across Karachi, Lahore, Faisalabad, and Islamabad. Seamlessly
            manage <strong>FBR Sales Tax Invoicing</strong>, <strong>EOBI &amp; PESSI Payroll</strong>,{' '}
            <strong>Multi-Godown Inventory</strong>, and <strong>1Link / Raast Banking</strong> from one secure cloud.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Launch Live ERP System</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-sm transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>Employee &amp; Admin Sign In</span>
            </Link>
          </div>

          {/* Pakistan Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FBR Digital Invoicing &amp; Annex-C</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>EOBI &amp; Provincial Social Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1Link &amp; Raast Direct Salary Credit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Karachi • Lahore • Islamabad Sync</span>
            </div>
          </div>

          {/* 4. INTERACTIVE ERP PREVIEW CARD */}
          <div className="mt-12 relative max-w-5xl mx-auto rounded-2xl border border-slate-700/80 bg-slate-950/90 shadow-2xl overflow-hidden text-left p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  portal.nexora.pk/dashboard — Karachi Corporate HQ
                </span>
              </div>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live Cloud Instance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Workforce</span>
                <div className="text-2xl font-bold text-white mt-1">84 Staff</div>
                <span className="text-[11px] text-emerald-400 font-medium">Karachi, Lahore &amp; ISB</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">YTD Revenue (PKR)</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">Rs. 82.5M</div>
                <span className="text-[11px] text-slate-400 font-medium">+18.5% YoY Growth</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">FBR Sales Tax Invoices</span>
                <div className="text-2xl font-bold text-white mt-1">Rs. 1.84M</div>
                <span className="text-[11px] text-amber-400 font-medium">Annexure-C Reconciled</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Multi-Godown Stock</span>
                <div className="text-2xl font-bold text-white mt-1">49,400 Units</div>
                <span className="text-[11px] text-slate-400 font-medium">Port Qasim &amp; Sundar</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct FBR Iris Integration Active</h4>
                  <p className="text-xs text-slate-400">
                    Automated tax invoices generated with digital QR codes, NTN verification, and 17% sales tax calculations.
                  </p>
                </div>
              </div>
              <Link
                href="/sales/invoices"
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all whitespace-nowrap"
              >
                Inspect Invoices
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PAKISTAN STATS COUNTER BAR */}
      <section className="py-12 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">Rs. 4.2B+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Annual Corporate Volume</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">120+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Pakistani Enterprises</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">99.98%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">PTCL &amp; Nayatel Cloud Uptime</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">FBR &amp; SECP Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPLETE ERP MODULES SECTION */}
      <section id="modules" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Built for Scale &amp; Speed
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              All 6 Pillars of Pakistani Enterprise Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Replace fragmented Excel sheets and disparate legacy software with one centralized,
              bulletproof system designed for local compliance and global growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1: HR & Payroll */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">HR, Attendance &amp; EOBI Payroll</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Complete staff directory, biometric &amp; web attendance, EOBI contributions, provincial
                social security (SESSI/PESSI), income tax withholdings, and 1-click PDF payslips.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Friday Jummah schedule support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Raast &amp; 1Link direct salary transfers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Gazetted Pakistani holiday calendar
                </li>
              </ul>
              <Link href="/hr/employees" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-5 group-hover:underline">
                Explore HR Module <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Module 2: CRM & Sales */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">B2B CRM &amp; Sales Pipeline</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Track high-velocity opportunities with visual Kanban deal stages. Manage customer lifetime
                values, sales targets, and formal quotations in Pakistani Rupees.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Lead → Won sales pipeline tracking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 1-Click Quotation to Invoice conversion
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Probability-weighted forecasting
                </li>
              </ul>
              <Link href="/crm/leads" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-bold mt-5 group-hover:underline">
                Explore Sales CRM <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Module 3: Invoicing & Billing */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">FBR Invoicing &amp; Billing</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Generate professional FBR-compliant digital invoices with sales tax, payment terms,
                and payment collection records. Export beautiful PDF invoices with NTN and STRN numbers.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 17% Provincial &amp; Federal Sales Tax
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Partial collections &amp; aging schedules
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Download verified PDF invoices
                </li>
              </ul>
              <Link href="/sales/invoices" className="inline-flex items-center gap-1.5 text-xs text-teal-400 font-bold mt-5 group-hover:underline">
                Explore Invoicing <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Module 4: Multi-Godown Inventory */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Godown Inventory</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Control stock across Port Qasim (Karachi), Sundar Industrial Estate (Lahore), and Rawat
                Dry Port. Low stock alert notifications and live stock adjustments.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> SKU &amp; barcode cataloging
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Capacity utilization meters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Inter-warehouse transfer records
                </li>
              </ul>
              <Link href="/inventory/products" className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold mt-5 group-hover:underline">
                Explore Inventory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Module 5: Procurement & Vendors */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Procurement &amp; Supply Chain</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Manage Pakistani vendors and suppliers. Purchase Orders progress from Submitted to
                Approved to Goods Received with automatic warehouse stock replenishment.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Multi-tier manager sign-offs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Automated inventory replenishment
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Vendor ledger reconciliation
                </li>
              </ul>
              <Link href="/inventory/procurement" className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-bold mt-5 group-hover:underline">
                Explore Procurement <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Module 6: Financial Ledger & Analytics */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">General Ledger &amp; Reports</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                GAAP &amp; IFRS trial balance, expense reimbursement workflows, sprint task boards,
                and instant 1-click exports to PDF, Excel (.xlsx), and CSV.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Assets, liabilities &amp; equity ledgers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Immutable security audit logs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Automated database backups
                </li>
              </ul>
              <Link href="/reports" className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold mt-5 group-hover:underline">
                Explore Reports Center <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PAKISTAN LOCALIZATION & COMPLIANCE SHOWCASE */}
      <section id="compliance" className="py-20 bg-slate-950 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Tax &amp; Regulatory Alignment
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                Engineered for Pakistan&apos;s Legal &amp; Financial Landscape
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Operating a business in Pakistan requires juggling federal FBR policies, provincial
                revenue authorities (SRB, PRA, KPRA, BRA), and labor social security boards. Nexora handles
                this out of the box with zero custom plugin headaches.
              </p>

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">FBR Iris Sales Tax Annexure-C Generation</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Auto-computes standard 17% sales tax and produces exportable data tables for monthly filing.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
                  <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Islamic &amp; Conventional Bank Integrations</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pre-formatted IBAN file formats for Meezan Bank, HBL, Bank Alfalah, MCB, and Raast instant clearing.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Friday Jummah Prayer &amp; Shift Management</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configurable shift hours recognizing Jummah prayers and Ramadan work schedules automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 relative shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Active Pakistani Compliance Ledger</span>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  VERIFIED
                </span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">NTN Registration:</span>
                  <span className="font-mono text-white whitespace-nowrap">7492819&#8209;3 (Active FBR)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Sales Tax STRN:</span>
                  <span className="font-mono text-white">32-77-8761-234-56</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">SECP Company ID:</span>
                  <span className="font-mono text-white">SECP-CORP-0189283-PK</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">EOBI Employer Code:</span>
                  <span className="font-mono text-white">KHI-EOBI-998210</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Disbursal Gateway:</span>
                  <span className="font-mono text-emerald-400 font-bold">1Link / SBP Raast Real-Time</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Data Sovereignty:</span>
                <span className="text-xs text-white font-medium">Encrypted &amp; Stored Locally</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING IN PAKISTANI RUPEES (PKR) */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Transparent Pakistani Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Simple, Predictable Plans in PKR
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              No hidden dollar conversion fluctuations. Invoiced locally in PKR with official tax receipts.
            </p>

            {/* Toggle */}
            <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Billing (Save 20%)
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: SME Starter */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SME Starter</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {billingCycle === 'annual' ? 'Rs. 25,000' : 'Rs. 30,000'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Perfect for growing retail and wholesale businesses with up to 25 staff.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Up to 25 Employee Profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Attendance &amp; Leave Tracker
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 1 Primary Warehouse Godown
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Standard Invoicing &amp; Quotations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Excel &amp; PDF Exports
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white text-center border border-slate-700 transition-all"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Plan 2: Business Pro (Featured) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                Most Popular in Pakistan
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Business Pro</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {billingCycle === 'annual' ? 'Rs. 65,000' : 'Rs. 78,000'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  For mid-market multi-branch companies requiring full FBR tax and EOBI automation.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Up to 150 Employee Profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Automated FBR Annexure-C Generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Multi-City Branch Synchronization
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Up to 5 Godowns &amp; Stock Routing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Raast &amp; 1Link Disbursal Files
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Priority On-Ground Phone Support
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center shadow-lg shadow-emerald-500/25 transition-all"
              >
                Deploy Business Pro
              </Link>
            </div>

            {/* Plan 3: Enterprise Suite */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Suite</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {billingCycle === 'annual' ? 'Rs. 150,000' : 'Rs. 180,000'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Nationwide corporations, textile mills, retail chains, and manufacturing groups.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Unlimited Staff &amp; Branches
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Direct FBR Iris REST API Hook
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Unlimited Warehouses &amp; Barcode Scanners
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Dedicated Enterprise Cloud Cluster
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> 24/7 Dedicated Account Manager
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Custom SECP &amp; Audit Workflows
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="mt-8 w-full py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white text-center border border-slate-700 transition-all"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS FROM PAKISTANI LEADERS */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Client Testimonials</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Trusted Across Pakistani Industries</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Managing payroll across 400 textile operators while staying compliant with EOBI and FBR used
                to take 10 days every month. With Nexora, it takes under 2 hours with automated Meezan Bank transfers.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  SM
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Shahid Mansha</div>
                  <div className="text-[10px] text-slate-400">Chief Financial Officer • Textile Group (Faisalabad)</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Nexora&apos;s multi-godown sync between our Port Qasim warehouse and Gulberg outlet eliminated
                stockouts entirely. The real-time valuation is spot on for our quarterly audits.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                  NA
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Naveed Asghar</div>
                  <div className="text-[10px] text-slate-400">Head of Operations • Retail Chain (Lahore &amp; Islamabad)</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;The built-in FBR sales tax invoice formatting saved us from thousands of manual data entry errors.
                Nexora is easily the cleanest ERP product built in Pakistan.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-xs">
                  AP
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Asif Peer</div>
                  <div className="text-[10px] text-slate-400">Managing Director • Systems Engineering (Karachi)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. OFFICES & LOCATIONS (KHI, LHE, ISB) */}
      <section id="locations" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Nationwide Presence</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Our Offices Across Pakistan</h2>
            <p className="text-xs text-slate-400 mt-2">
              On-ground customer success, deployment consultants, and technical engineers in your city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                Karachi Corporate HQ
              </div>
              <h3 className="text-base font-bold text-white">Dolmen Executive Tower</h3>
              <p className="text-xs text-slate-400">
                Level 14, Dolmen City, Clifton Block 4, Marine Drive, Karachi.
              </p>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div>Tel: +92 (21) 3587-9921</div>
                <div>Email: karachi@nexora.pk</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                Lahore Tech Hub
              </div>
              <h3 className="text-base font-bold text-white">Gulberg Technology Suites</h3>
              <p className="text-xs text-slate-400">
                Floor 6, MM Alam Road, Gulberg III, Lahore, Punjab.
              </p>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div>Tel: +92 (42) 3578-1122</div>
                <div>Email: lahore@nexora.pk</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="inline-block px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 text-xs font-bold">
                Islamabad Regional Center
              </div>
              <h3 className="text-base font-bold text-white">Saudi Pak Tower</h3>
              <p className="text-xs text-slate-400">
                Level 8, Jinnah Avenue, Blue Area, Islamabad.
              </p>
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <div>Tel: +92 (51) 280-4491</div>
                <div>Email: islamabad@nexora.pk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Common Questions</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-sm text-white">How does Nexora connect with the FBR Digital POS system?</h4>
              <p className="text-slate-400 mt-1.5 leading-relaxed">
                Nexora contains automated FBR Iris formatting routines. When an invoice or retail transaction is
                finalized, it generates the cryptographic fiscal QR code and records the withholding and sales tax
                breakdowns according to current SRO guidelines.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-sm text-white">Is our business data stored in Pakistan?</h4>
              <p className="text-slate-400 mt-1.5 leading-relaxed">
                Yes. Nexora supports local Pakistani hosting clusters ensuring strict compliance with the State
                Bank of Pakistan (SBP) and Government of Pakistan Cloud First data sovereignty regulations.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-sm text-white">Can we pay for Nexora through local bank transfer?</h4>
              <p className="text-slate-400 mt-1.5 leading-relaxed">
                Yes! We accept 1Link corporate transfers, Raast IBAN direct clearing, Pay Orders, and corporate credit cards
                in Pakistani Rupees (PKR) with official tax-compliant invoices.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-sm text-white">Can we migrate from our existing QuickBooks, Tally, or Excel sheets?</h4>
              <p className="text-slate-400 mt-1.5 leading-relaxed">
                Nexora includes a 1-click Excel/CSV import and export engine across all modules (Employees, Invoices,
                Products, Customers, Chart of Accounts). Our on-ground teams in Karachi, Lahore, and Islamabad also
                assist with full data onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CALL TO ACTION BANNER */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 border-t border-emerald-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Transform Your Company with Nexora?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Join hundreds of Pakistani enterprises modernizing their workforce, sales, inventory,
            and FBR compliance on the cloud.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-xl shadow-emerald-900/50 text-sm flex items-center gap-2 transition-all"
            >
              <span>Launch Live ERP System</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/hr/payroll"
              className="px-8 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm transition-all"
            >
              <span>Test Payroll Engine</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <NexoraLogo size="sm" href="/" animated={false} />

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link href="/dashboard" className="hover:text-white">ERP Dashboard</Link>
            <Link href="/hr/employees" className="hover:text-white">Employees</Link>
            <Link href="/sales/invoices" className="hover:text-white">FBR Invoices</Link>
            <Link href="/inventory/products" className="hover:text-white">Multi-Godown</Link>
            <Link href="/reports" className="hover:text-white">Reports Center</Link>
            <Link href="/settings" className="hover:text-white">Settings</Link>
          </div>

          <div className="text-center md:text-right text-slate-400">
            <span>© {new Date().getFullYear()} Nexora Business Solutions (Pvt.) Ltd. All rights reserved.</span>{' '}
            <span className="whitespace-nowrap font-semibold text-slate-200 inline-block">NTN:&nbsp;7492819&#8209;3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
