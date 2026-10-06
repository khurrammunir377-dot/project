import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: "Nexora - Complete Business Management Platform | Pakistan's Leading Enterprise ERP",
  description: 'Enterprise ERP for Pakistan: FBR Digital Invoicing, EOBI/PESSI HR Payroll, Multi-Godown Inventory, Raast Banking, and Sales CRM.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
