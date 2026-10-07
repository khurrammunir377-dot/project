'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Download,
  Filter,
  Plus,
  ArrowUpRight,
  PieChart,
  Megaphone,
  Globe,
  Share2,
  Video,
  MessageSquare,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Coins,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { exportToExcel, exportTableToPDF } from '@/lib/export';

interface AdCampaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta (FB & IG)' | 'TikTok Ads' | 'LinkedIn B2B' | 'YouTube Video' | 'SMS / WhatsApp Direct';
  objective: 'Sales / Conversions' | 'Lead Generation' | 'Brand Reach' | 'App Installs';
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  status: 'Active' | 'Completed' | 'Paused';
}

const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'camp-1',
    name: 'Q3 Enterprise ERP Search - Karachi & Lahore',
    platform: 'Google Ads',
    objective: 'Sales / Conversions',
    spend: 650000,
    impressions: 480000,
    clicks: 14200,
    conversions: 320,
    revenue: 4200000,
    status: 'Active',
  },
  {
    id: 'camp-2',
    name: 'Pakistan Manufacturers B2B Retargeting',
    platform: 'Meta (FB & IG)',
    objective: 'Sales / Conversions',
    spend: 520000,
    impressions: 1150000,
    clicks: 22400,
    conversions: 410,
    revenue: 3450000,
    status: 'Active',
  },
  {
    id: 'camp-3',
    name: 'C-Suite CFOs & Directors Sponsored InMail',
    platform: 'LinkedIn B2B',
    objective: 'Lead Generation',
    spend: 480000,
    impressions: 185000,
    clicks: 5800,
    conversions: 94,
    revenue: 2980000,
    status: 'Active',
  },
  {
    id: 'camp-4',
    name: 'Gen-Z & Retail Merchant Outreach',
    platform: 'TikTok Ads',
    objective: 'Lead Generation',
    spend: 340000,
    impressions: 2400000,
    clicks: 38000,
    conversions: 285,
    revenue: 1650000,
    status: 'Active',
  },
  {
    id: 'camp-5',
    name: 'Nexora ERP 2.0 Product Tour Walkthrough',
    platform: 'YouTube Video',
    objective: 'Brand Reach',
    spend: 280000,
    impressions: 890000,
    clicks: 9800,
    conversions: 68,
    revenue: 1180000,
    status: 'Completed',
  },
  {
    id: 'camp-6',
    name: 'Direct SMS & Raast Notification Flash Push',
    platform: 'SMS / WhatsApp Direct',
    objective: 'Sales / Conversions',
    spend: 180000,
    impressions: 320000,
    clicks: 26500,
    conversions: 340,
    revenue: 1430000,
    status: 'Active',
  },
];

export default function MarketingReportPage() {
  const { state, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [selectedPeriod, setSelectedPeriod] = useState<'This Month' | 'Last Quarter' | 'FY 2026 YTD'>('This Month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Campaign Form
  const [newCamp, setNewCamp] = useState({
    name: '',
    platform: 'Google Ads' as AdCampaign['platform'],
    objective: 'Sales / Conversions' as AdCampaign['objective'],
    spend: 200000,
    impressions: 150000,
    clicks: 4500,
    conversions: 85,
    revenue: 1200000,
    status: 'Active' as AdCampaign['status'],
  });

  // Calculate Aggregates
  const totalAdSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalAttributedRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const blendedROAS = (totalAttributedRevenue / (totalAdSpend || 1)).toFixed(2);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const avgCAC = Math.round(totalAdSpend / (totalConversions || 1));

  // Financial Integration (P&L Simulation)
  const totalInvoicedSales = state.invoices.reduce((acc, inv) => acc + inv.total, 0) || 18450000;
  const estimatedCOGS = Math.round(totalInvoicedSales * 0.44); // 44% Cost of goods
  const grossProfit = totalInvoicedSales - estimatedCOGS;
  const otherOPEX = 3850000; // Salaries, cloud infrastructure, office
  const totalOPEX = otherOPEX + totalAdSpend;
  const ebitda = grossProfit - totalOPEX;
  const corporateTax = Math.round(Math.max(0, ebitda) * 0.29); // 29% FBR corporate tax
  const netProfit = ebitda - corporateTax;

  const marketingShareOfOPEX = ((totalAdSpend / totalOPEX) * 100).toFixed(1);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.name) return;

    const created: AdCampaign = {
      id: `camp-${Date.now()}`,
      name: newCamp.name,
      platform: newCamp.platform,
      objective: newCamp.objective,
      spend: Number(newCamp.spend),
      impressions: Number(newCamp.impressions),
      clicks: Number(newCamp.clicks),
      conversions: Number(newCamp.conversions),
      revenue: Number(newCamp.revenue),
      status: newCamp.status,
    };

    setCampaigns([created, ...campaigns]);
    logAudit(
      'Logged Ad Campaign',
      'reports',
      `Registered ad campaign: ${newCamp.name} on ${newCamp.platform} (Spend: Rs. ${Number(newCamp.spend).toLocaleString()})`,
      currentUser.name,
      currentUser.id
    );

    setIsModalOpen(false);
  };

  const handleExportPDF = () => {
    exportTableToPDF(
      'Marketing & Ads P&L Performance Report',
      [
        { header: 'Campaign Name', dataKey: 'name' },
        { header: 'Platform', dataKey: 'platform' },
        { header: 'Objective', dataKey: 'objective' },
        { header: 'Ad Spend (PKR)', dataKey: 'spend' },
        { header: 'Conversions', dataKey: 'conversions' },
        { header: 'Revenue (PKR)', dataKey: 'revenue' },
        { header: 'Status', dataKey: 'status' },
      ],
      campaigns,
      state.settings.companyName
    );
  };

  const handleExportExcel = () => {
    exportToExcel(campaigns, 'Nexora_Marketing_Ads_Report', 'Ad Campaigns');
  };

  const columns: Column<AdCampaign>[] = [
    {
      header: 'Campaign & Objective',
      accessorKey: 'name',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{c.name}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{c.objective}</div>
        </div>
      ),
    },
    {
      header: 'Platform',
      accessorKey: 'platform',
      sortable: true,
      render: (c) => {
        const icons: Record<string, any> = {
          'Google Ads': <Globe className="w-3.5 h-3.5 text-blue-500" />,
          'Meta (FB & IG)': <Share2 className="w-3.5 h-3.5 text-indigo-500" />,
          'TikTok Ads': <TrendingUp className="w-3.5 h-3.5 text-pink-500" />,
          'LinkedIn B2B': <Building2 className="w-3.5 h-3.5 text-sky-600" />,
          'YouTube Video': <Video className="w-3.5 h-3.5 text-rose-500" />,
          'SMS / WhatsApp Direct': <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />,
        };
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {icons[c.platform]}
            <span>{c.platform}</span>
          </div>
        );
      },
    },
    {
      header: 'Ad Spend (PKR)',
      accessorKey: 'spend',
      sortable: true,
      render: (c) => (
        <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
          Rs. {c.spend.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Conversions / Leads',
      accessorKey: 'conversions',
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-mono font-bold text-xs">{c.conversions}</span>
          <span className="text-[10px] text-slate-400 block">
            CPA: Rs. {Math.round(c.spend / (c.conversions || 1)).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: 'Attributed Sales',
      accessorKey: 'revenue',
      sortable: true,
      render: (c) => (
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          Rs. {c.revenue.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'ROAS',
      render: (c) => {
        const roas = (c.revenue / (c.spend || 1)).toFixed(2);
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono">
            {roas}x
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (c) => {
        const variants: Record<string, any> = {
          Active: 'success',
          Completed: 'neutral',
          Paused: 'warning',
        };
        return <Badge variant={variants[c.status]}>{c.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-600" /> Marketing &amp; Ads Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive analysis by advertising platform — fully integrated with the Corporate Profit &amp; Loss (P&amp;L) statement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportPDF} icon={<Download className="w-3.5 h-3.5" />}>
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}>
            Export Excel
          </Button>
          {can('reports', 'create') && (
            <Button size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-3.5 h-3.5" />}>
              Log Ad Campaign
            </Button>
          )}
        </div>
      </div>

      {/* 2. Top Executive Metric Radar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Ad Spend (OPEX)"
          value={`Rs. ${totalAdSpend.toLocaleString()}`}
          icon={<Coins className="w-5 h-5" />}
          subtitle={`Represents ${marketingShareOfOPEX}% of Total OPEX`}
          colorScheme="rose"
        />
        <StatCard
          title="Attributed Sales Revenue"
          value={`Rs. ${totalAttributedRevenue.toLocaleString()}`}
          icon={<Receipt className="w-5 h-5" />}
          subtitle="Direct invoice sales from ads"
          colorScheme="emerald"
        />
        <StatCard
          title="Blended ROAS Multiplier"
          value={`${blendedROAS}x`}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Gross return per rupee spent"
          colorScheme="indigo"
        />
        <StatCard
          title="Avg Customer Acquisition Cost"
          value={`Rs. ${avgCAC.toLocaleString()}`}
          icon={<BarChart3 className="w-5 h-5" />}
          subtitle={`${totalConversions} commercial conversions`}
          colorScheme="sky"
        />
      </div>

      {/* 3. P&L INTEGRATION HIGHLIGHT (THE FINANCIAL STATEMENT TIE-IN) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time P&amp;L Financial Integration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Marketing Contribution to Corporate P&amp;L Statement
            </h2>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">
              Track how advertising expenditures directly translate through Cost of Goods Sold (COGS), Operating Expenses, and FBR Corporate Taxes into Net Bottom-Line Profit.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Ad Contribution to Net Margin</span>
              <span className="text-xl font-black font-mono text-emerald-400">
                +Rs. {(totalAttributedRevenue - totalAdSpend).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* P&L Financial Waterfall Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">1. Gross Invoicing</span>
            <span className="font-mono font-bold text-white text-sm">
              Rs. {totalInvoicedSales.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">100% Top-line</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">2. Estimated COGS</span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              -Rs. {estimatedCOGS.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">44% of Revenue</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">3. Gross Margin</span>
            <span className="font-mono font-bold text-white text-sm">
              Rs. {grossProfit.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1">56% Margin</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-rose-300 block mb-1 font-semibold">4. Paid Ad Spend</span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              -Rs. {totalAdSpend.toLocaleString()}
            </span>
            <span className="text-[10px] text-rose-300 block mt-1">Marketing OPEX</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">5. Other OPEX</span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              -Rs. {otherOPEX.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Admin &amp; Facilities</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-emerald-300 block mb-1 font-semibold">6. Net Profit</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              Rs. {netProfit.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-1">After 29% FBR Tax</span>
          </div>
        </div>
      </div>

      {/* 4. Platform Performance Cards Breakdown */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-600" />
          <span>Platform Multi-Channel Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              platform: 'Google Ads (Search & PMax)',
              spend: 650000,
              sales: 4200000,
              roas: '6.46x',
              color: 'from-blue-500 to-indigo-600',
              icon: <Globe className="w-4 h-4 text-white" />,
            },
            {
              platform: 'Meta Ads (Facebook & Instagram)',
              spend: 520000,
              sales: 3450000,
              roas: '6.63x',
              color: 'from-indigo-500 to-blue-600',
              icon: <Share2 className="w-4 h-4 text-white" />,
            },
            {
              platform: 'LinkedIn B2B Sponsored Content',
              spend: 480000,
              sales: 2980000,
              roas: '6.20x',
              color: 'from-sky-600 to-cyan-600',
              icon: <Building2 className="w-4 h-4 text-white" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {item.platform}
                  </span>
                </div>
                <span className="font-mono font-extrabold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                  {item.roas}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Ad Spend</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    Rs. {item.spend.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Attributed Sales</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Rs. {item.sales.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Campaign Performance Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Active Campaigns Ledger</span>
          </h3>
          <span className="text-xs text-slate-400">
            {campaigns.length} total campaigns monitored
          </span>
        </div>

        <DataTable
          data={campaigns}
          columns={columns}
          searchPlaceholder="Search campaigns by name, platform, objective..."
          searchKey={(c) => `${c.name} ${c.platform} ${c.objective}`}
          exportFileName="Nexora_Marketing_Ads_Performance"
        />
      </div>

      {/* 6. LOG AD CAMPAIGN MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Ad Campaign / Platform Spend"
        description="Record marketing campaign budgets, platform allocations, and attributed conversion returns."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <Input
            label="Campaign Name"
            required
            value={newCamp.name}
            onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
            placeholder="e.g. Q4 Karachi Corporate Procurement Blitz"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Advertising Platform"
              value={newCamp.platform}
              onChange={(e) => setNewCamp({ ...newCamp, platform: e.target.value as any })}
              options={[
                { label: 'Google Ads', value: 'Google Ads' },
                { label: 'Meta (FB & IG)', value: 'Meta (FB & IG)' },
                { label: 'TikTok Ads', value: 'TikTok Ads' },
                { label: 'LinkedIn B2B', value: 'LinkedIn B2B' },
                { label: 'YouTube Video', value: 'YouTube Video' },
                { label: 'SMS / WhatsApp Direct', value: 'SMS / WhatsApp Direct' },
              ]}
            />
            <Select
              label="Campaign Objective"
              value={newCamp.objective}
              onChange={(e) => setNewCamp({ ...newCamp, objective: e.target.value as any })}
              options={[
                { label: 'Sales / Conversions', value: 'Sales / Conversions' },
                { label: 'Lead Generation', value: 'Lead Generation' },
                { label: 'Brand Reach', value: 'Brand Reach' },
                { label: 'App Installs', value: 'App Installs' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad Spend (PKR)"
              type="number"
              value={newCamp.spend}
              onChange={(e) => setNewCamp({ ...newCamp, spend: Number(e.target.value) })}
            />
            <Input
              label="Attributed Revenue (PKR)"
              type="number"
              value={newCamp.revenue}
              onChange={(e) => setNewCamp({ ...newCamp, revenue: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Impressions"
              type="number"
              value={newCamp.impressions}
              onChange={(e) => setNewCamp({ ...newCamp, impressions: Number(e.target.value) })}
            />
            <Input
              label="Clicks"
              type="number"
              value={newCamp.clicks}
              onChange={(e) => setNewCamp({ ...newCamp, clicks: Number(e.target.value) })}
            />
            <Input
              label="Conversions"
              type="number"
              value={newCamp.conversions}
              onChange={(e) => setNewCamp({ ...newCamp, conversions: Number(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
