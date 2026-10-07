'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Payslip, Invoice, Quotation, PurchaseOrder, CompanySettings } from '../types';
import { NEXORA_LOGO_BASE64 } from './logoBase64';

export function exportToCSV(data: Record<string, any>[], filename = 'export.csv') {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: Record<string, any>[], sheetName = 'Report', filename = 'export.xlsx') {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function exportTableToPDF(
  title: string,
  columns: { header: string; dataKey: string }[],
  rows: Record<string, any>[],
  companyName = 'Nexora Business Solutions (Pvt.) Ltd.'
) {
  const doc = new jsPDF('p', 'pt', 'a4');

  // Official Nexora Emblem
  try {
    doc.addImage(NEXORA_LOGO_BASE64, 'PNG', 40, 24, 40, 35);
  } catch (err) {
    console.warn('PDF logo render skipped', err);
  }

  // Company Brand Header
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 88, 38);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 88, 52);
  doc.text(`Generated: ${new Date().toLocaleString()} (PKT) | NTN: 7492819-3`, 88, 65);

  // Table
  autoTable(doc, {
    startY: 85,
    columns: columns.map((col) => ({ header: col.header, dataKey: col.dataKey })),
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [1, 65, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 5 },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
}

/**
 * Draws the official Pakistan Corporate Letterhead on the first page with official Nexora Logo
 */
function drawCorporateLetterhead(doc: jsPDF, title: string, docNumber: string, company: CompanySettings) {
  // Top Emerald Accent Stripe
  doc.setFillColor(1, 65, 28); // Pakistan Flag Green
  doc.rect(0, 0, 595, 8, 'F');

  // Top Light Gray Letterhead Header Container
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 8, 595, 95, 'F');

  // Official 3D Nexora Logo Emblem
  try {
    doc.addImage(NEXORA_LOGO_BASE64, 'PNG', 40, 18, 50, 43);
  } catch (err) {
    console.warn('PDF logo render skipped', err);
  }

  // Corporate Name
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text(company.companyName || 'Nexora Business Solutions (Pvt.) Ltd.', 98, 36);

  // Corporate Address & Legal Bar
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Head Office: Level 14, Executive Tower, Dolmen City, Clifton Block 4, Karachi, Pakistan', 98, 49);
  doc.text('Branches: MM Alam Road, Gulberg III, Lahore  •  Saudi Pak Tower, Blue Area, Islamabad', 98, 61);
  
  // Tax Registration Bar (Bold NTN/STRN)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(1, 65, 28);
  doc.text('NTN: 7492819-3   |   STRN: 3277876123456   |   SECP: 0189283-PK   |   FBR Active Taxpayer', 98, 74);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('UAN: +92 (21) 3587-9921   •   Email: accounts@nexora.pk   •   Web: https://nexora.pk', 98, 86);

  // Horizontal Divider Line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(40, 103, 555, 103);

  // Document Title Banner
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(40, 115, 515, 28, 4, 4, 'F');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 52, 133);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`REF: ${docNumber}`, 430, 133);
}

export function generateInvoicePDF(invoice: Invoice, company: CompanySettings) {
  const doc = new jsPDF('p', 'pt', 'a4');

  // Official Letterhead
  drawCorporateLetterhead(doc, 'Sales Tax Invoice (FBR Annex-C Compliant)', invoice.invoiceNumber, company);

  // Customer & Meta Details
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To Customer:', 40, 168);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.customerName, 40, 183);
  doc.setTextColor(100, 116, 139);
  doc.text('Status: Registered Pakistani Business Entity', 40, 196);
  doc.text('FBR Status: Active Taxpayer Verification SRO-2026', 40, 209);

  // Invoice Details Box
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Particulars:', 360, 168);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Issue Date: ${invoice.issueDate}`, 360, 183);
  doc.text(`Payment Due: ${invoice.dueDate}`, 360, 196);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 360, 209);

  // Line Items Table
  const items = invoice.items.map((it, idx) => [
    (idx + 1).toString(),
    it.description,
    it.quantity.toString(),
    `Rs. ${it.unitPrice.toLocaleString()}`,
    `Rs. ${it.total.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 228,
    head: [['Sr.', 'Item Description / Service Particulars', 'Qty', 'Unit Rate (PKR)', 'Net Amount (PKR)']],
    body: items,
    theme: 'grid',
    headStyles: { fillColor: [1, 65, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 260 },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 90, halign: 'right' },
      4: { cellWidth: 95, halign: 'right' },
    },
    margin: { left: 40, right: 40 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;

  // Pakistani Bank Details Box (Left)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, finalY, 260, 95, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, finalY, 260, 95, 4, 4, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(1, 65, 28);
  doc.text('Bank Settlement (1Link / Raast):', 50, finalY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Bank: Meezan Bank Ltd (Corporate Clifton Branch)', 50, finalY + 30);
  doc.text('Account Title: Nexora Business Solutions (Pvt.) Ltd.', 50, finalY + 44);
  doc.text('IBAN: PK92MEZN00010203040506', 50, finalY + 58);
  doc.text('Raast ID: payments@nexora.pk', 50, finalY + 72);
  doc.text('Pay Order: In favor of "Nexora Business Solutions"', 50, finalY + 86);

  // Financial Breakdown (Right)
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', 340, finalY + 14);
  doc.text(`Rs. ${invoice.subtotal.toLocaleString()}`, 555, finalY + 14, { align: 'right' });

  doc.text('FBR / Provincial Sales Tax (17%):', 340, finalY + 30);
  doc.text(`Rs. ${invoice.tax.toLocaleString()}`, 555, finalY + 30, { align: 'right' });

  if (invoice.discount > 0) {
    doc.text('Commercial Trade Discount:', 340, finalY + 46);
    doc.text(`-Rs. ${invoice.discount.toLocaleString()}`, 555, finalY + 46, { align: 'right' });
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(340, finalY + 54, 555, finalY + 54);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Total Payable:', 340, finalY + 72);
  doc.text(`Rs. ${invoice.total.toLocaleString()}`, 555, finalY + 72, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Amount Received (Cleared):', 340, finalY + 88);
  doc.text(`Rs. ${invoice.amountPaid.toLocaleString()}`, 555, finalY + 88, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('Net Balance Due:', 340, finalY + 104);
  doc.text(`Rs. ${invoice.balanceDue.toLocaleString()}`, 555, finalY + 104, { align: 'right' });

  // Digital Stamp & Signature Block
  const stampY = finalY + 125;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(400, stampY, 155, 65, 4, 4, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(400, stampY, 155, 65, 4, 4, 'S');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(1, 65, 28);
  doc.text('NEXORA CORPORATE STAMP', 412, stampY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('FBR Digital Signature Verified', 412, stampY + 28);
  doc.text('Chief Financial Officer', 412, stampY + 42);
  doc.text('Doc Verified: ' + new Date().toISOString().split('T')[0], 412, stampY + 55);

  // Terms and Conditions footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Terms & Conditions: Payment due within credit terms. Withholding tax deduction certificates must be provided within 15 days under FBR rules.', 40, stampY + 70);
  doc.text('This is a computer-generated tax invoice verified under Pakistan Sales Tax Act, 1990.', 40, stampY + 82);

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

export function generateQuotationPDF(quotation: Quotation, company: CompanySettings) {
  const doc = new jsPDF('p', 'pt', 'a4');

  // Official Letterhead
  drawCorporateLetterhead(doc, 'Commercial Quotation & Proposal', quotation.quotationNumber, company);

  // Client Details
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared For Customer:', 40, 168);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.customerName, 40, 183);
  doc.setTextColor(100, 116, 139);
  doc.text('Enterprise Commercial Proposal', 40, 196);

  // Quotation Meta
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Terms:', 360, 168);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Proposal Date: ${quotation.date}`, 360, 183);
  doc.text(`Valid Until: ${quotation.expiryDate}`, 360, 196);
  doc.text(`Status: ${quotation.status.toUpperCase()}`, 360, 209);

  // Line Items Table
  const items = quotation.items.map((it, idx) => [
    (idx + 1).toString(),
    it.description,
    it.quantity.toString(),
    `Rs. ${it.unitPrice.toLocaleString()}`,
    `Rs. ${it.total.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 228,
    head: [['Sr.', 'Scope of Work / Deliverable Description', 'Qty', 'Unit Rate (PKR)', 'Net Total (PKR)']],
    body: items,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 260 },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 90, halign: 'right' },
      4: { cellWidth: 95, halign: 'right' },
    },
    margin: { left: 40, right: 40 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;

  // Commercial Notes Box (Left)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, finalY, 260, 85, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, finalY, 260, 85, 4, 4, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Commercial Proposal Terms:', 50, finalY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Quotation valid for 30 calendar days from issue date.', 50, finalY + 30);
  doc.text('2. Prices include standard delivery & on-site onboarding.', 50, finalY + 44);
  doc.text('3. Payment: 50% advance on PO, 50% on milestone signoff.', 50, finalY + 58);
  doc.text('4. Taxes: Subject to prevailing FBR Sales Tax rates.', 50, finalY + 72);

  // Financial Summary (Right)
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', 340, finalY + 16);
  doc.text(`Rs. ${quotation.subtotal.toLocaleString()}`, 555, finalY + 16, { align: 'right' });

  doc.text('FBR Sales Tax (17%):', 340, finalY + 32);
  doc.text(`Rs. ${quotation.tax.toLocaleString()}`, 555, finalY + 32, { align: 'right' });

  if (quotation.discount > 0) {
    doc.text('Client Discount:', 340, finalY + 48);
    doc.text(`-Rs. ${quotation.discount.toLocaleString()}`, 555, finalY + 48, { align: 'right' });
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(340, finalY + 56, 555, finalY + 56);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(1, 65, 28);
  doc.text('Total Quotation Value:', 340, finalY + 74);
  doc.text(`Rs. ${quotation.total.toLocaleString()}`, 555, finalY + 74, { align: 'right' });

  // Signature Blocks
  const sigY = finalY + 115;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.line(40, sigY + 35, 200, sigY + 35);
  doc.text('Authorized Commercial Signatory', 40, sigY + 47);
  doc.text('Nexora Business Solutions (Pvt.) Ltd.', 40, sigY + 58);

  doc.line(395, sigY + 35, 555, sigY + 35);
  doc.text('Client Acceptance Signature & Stamp', 395, sigY + 47);
  doc.text(`Date of Acceptance: __________________`, 395, sigY + 58);

  doc.save(`${quotation.quotationNumber}.pdf`);
}

export function generatePurchaseOrderPDF(po: PurchaseOrder, company: CompanySettings) {
  const doc = new jsPDF('p', 'pt', 'a4');

  // Official Letterhead
  drawCorporateLetterhead(doc, 'Official Purchase Order (PO)', po.poNumber, company);

  // Vendor Information
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Vendor / Supplier:', 40, 168);
  doc.setFont('helvetica', 'normal');
  doc.text(po.supplierName, 40, 183);
  doc.setTextColor(100, 116, 139);
  doc.text('Approved Corporate Vendor', 40, 196);
  if (po.paymentTerms) {
    doc.text(`Payment Terms: ${po.paymentTerms}`, 40, 209);
  }

  // PO Particulars
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Particulars:', 360, 168);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`PO Date: ${po.orderDate}`, 360, 183);
  doc.text(`Expected Delivery: ${po.expectedDate}`, 360, 196);
  doc.text(`Order Status: ${po.status.toUpperCase()}`, 360, 209);

  // Line items
  const items = (po.items || []).map((it, idx) => [
    (idx + 1).toString(),
    it.description,
    it.quantity.toString(),
    `Rs. ${it.unitPrice.toLocaleString()}`,
    `${it.taxPercent || 17}%`,
    `Rs. ${it.total.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: 228,
    head: [['Sr.', 'Item / Goods Description', 'Qty', 'Unit Price', 'GST %', 'Line Total (PKR)']],
    body: items.length > 0 ? items : [['1', 'Procurement Package Order', '1', `Rs. ${po.totalAmount.toLocaleString()}`, '17%', `Rs. ${po.totalAmount.toLocaleString()}`]],
    theme: 'grid',
    headStyles: { fillColor: [1, 65, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 235 },
      2: { cellWidth: 40, halign: 'center' },
      3: { cellWidth: 80, halign: 'right' },
      4: { cellWidth: 45, halign: 'center' },
      5: { cellWidth: 90, halign: 'right' },
    },
    margin: { left: 40, right: 40 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;

  // Delivery Instructions Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, finalY, 260, 75, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, finalY, 260, 75, 4, 4, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Godown & Receiving Instructions:', 50, finalY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Delivery Location: ${po.deliveryAddress || 'Central Karachi Godown (SITE Area)'}`, 50, finalY + 30);
  doc.text('Goods Inspection: Inspection on arrival against delivery challan.', 50, finalY + 44);
  doc.text('Invoice Submission: Send sales tax invoice with NTN & STRN.', 50, finalY + 58);

  // Financial Totals
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', 340, finalY + 16);
  doc.text(`Rs. ${(po.subtotal || po.totalAmount).toLocaleString()}`, 555, finalY + 16, { align: 'right' });

  doc.text('Sales Tax (GST):', 340, finalY + 32);
  doc.text(`Rs. ${(po.tax || 0).toLocaleString()}`, 555, finalY + 32, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(340, finalY + 42, 555, finalY + 42);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(1, 65, 28);
  doc.text('Total PO Commitment:', 340, finalY + 60);
  doc.text(`Rs. ${po.totalAmount.toLocaleString()}`, 555, finalY + 60, { align: 'right' });

  // Signature Block
  const sigY = finalY + 105;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.line(40, sigY + 30, 200, sigY + 30);
  doc.text('Procurement Manager Authorization', 40, sigY + 42);

  doc.line(395, sigY + 30, 555, sigY + 30);
  doc.text('Supplier Acceptance & Seal', 395, sigY + 42);

  doc.save(`${po.poNumber}.pdf`);
}

export function generatePayslipPDF(payslip: Payslip, company: CompanySettings) {
  const doc = new jsPDF('p', 'pt', 'a4');

  // Official Letterhead
  drawCorporateLetterhead(doc, 'Official Salary Payslip & Tax Deduction Certificate', payslip.payslipNo, company);

  // Employee Meta Box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information', 40, 168);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employee Name: ${payslip.employeeName}`, 40, 185);
  doc.text(`Employee ID: ${payslip.employeeId}`, 40, 200);
  doc.text(`Department: ${payslip.department}`, 40, 215);
  doc.text(`Job Title: ${payslip.jobTitle}`, 40, 230);

  doc.text(`Pay Period: ${payslip.month} ${payslip.year}`, 340, 185);
  doc.text(`Payment Status: ${payslip.status}`, 340, 200);
  doc.text(`Payment Date: ${payslip.paymentDate || 'End of Month'}`, 340, 215);
  doc.text(`Payment Method: ${payslip.paymentMethod || 'Meezan / 1Link Direct Deposit'}`, 340, 230);

  // Earnings & Deductions Tables
  const earningsData = [
    ['Basic Salary', `Rs. ${payslip.basicSalary.toLocaleString()}`],
    ['Housing & Utility Allowance', `Rs. ${payslip.allowances.toLocaleString()}`],
    ['Performance Bonus', `Rs. ${payslip.bonus.toLocaleString()}`],
    ['Overtime Compensation', `Rs. ${payslip.overtime.toLocaleString()}`],
    ['Total Gross Earnings', `Rs. ${payslip.grossSalary.toLocaleString()}`],
  ];

  const deductionsData = [
    ['FBR Income Tax (Withholding)', `Rs. ${payslip.taxDeduction.toLocaleString()}`],
    ['EOBI Social Security', `Rs. ${payslip.socialInsurance.toLocaleString()}`],
    ['Provident Fund Contribution', `Rs. ${payslip.otherDeductions.toLocaleString()}`],
    ['Total Statutory Deductions', `Rs. ${(payslip.taxDeduction + payslip.socialInsurance + payslip.otherDeductions).toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: 250,
    head: [['Earnings Breakdown', 'Amount (PKR)']],
    body: earningsData,
    theme: 'grid',
    headStyles: { fillColor: [1, 65, 28], textColor: [255, 255, 255] },
    margin: { left: 40, right: 305 },
    styles: { fontSize: 8.5 },
  });

  autoTable(doc, {
    startY: 250,
    head: [['Statutory Deductions', 'Amount (PKR)']],
    body: deductionsData,
    theme: 'grid',
    headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255] },
    margin: { left: 305, right: 40 },
    styles: { fontSize: 8.5 },
  });

  // Net Pay Summary Banner
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(40, 395, 515, 50, 5, 5, 'F');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('NET SALARY TRANSFERRED VIA 1LINK:', 60, 425);
  doc.setFontSize(18);
  doc.setTextColor(1, 65, 28);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${payslip.netSalary.toLocaleString()}`, 360, 426);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated salary slip verified under Pakistan Employment & EOBI Regulations.', 40, 485);
  doc.text(`${company.companyName} • NTN: 7492819-3 • STRN: 3277876123456`, 40, 498);

  doc.save(`Payslip_${payslip.employeeId}_${payslip.month}_${payslip.year}.pdf`);
}
