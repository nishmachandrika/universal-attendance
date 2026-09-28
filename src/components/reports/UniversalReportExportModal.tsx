import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Modal } from '../common/Modal';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export interface ReportKpi {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
}

export interface WorkingPlaceSummary {
  siteId?: string;
  siteName: string;
  isOriginalSite?: boolean;
  siteType?: 'original' | 'other';
  daysCount: number;
  mandays: number;
  foodCount?: number;
  allTimeDays?: number;
  allTimeFoodCount?: number;
  dates?: string[];
}

export interface TransferAuditRecord {
  id: string;
  date: string;
  type: 'site' | 'section';
  workerId?: string;
  workerName?: string;
  fromSiteName: string;
  fromSectionName: string;
  toSiteName: string;
  toSectionName: string;
  scope: string;
  reason: string;
  approvedBy: string;
  remarks?: string;
}

export interface CustomAuditSlipDetails {
  workerName?: string;
  workerId?: string;
  totalPresentCount: number;
  presentDates: string[];
  totalAbsentCount: number;
  absentDates: string[];
  workingPlacesBreakdown?: WorkingPlaceSummary[];
  transferHistory?: TransferAuditRecord[];
  advancePayments: Array<{
    date: string;
    amount: number;
    reason?: string;
    type?: 'advance' | 'recovery';
  }>;
  lastPresentDate: string;
  lastPresentRunningBalance: number;
  overallClosingBalance?: number;
  workerSignature?: string | null;
  supervisorSignature?: string | null;
}

export interface UniversalReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  subtitle?: string;
  periodLabel: string;
  filterSummary?: Array<{ label: string; value: string }>;
  summaryKpis?: ReportKpi[];
  tableHeaders: string[];
  tableRows: Array<Array<string | number>>;
  signatures?: {
    supervisorName?: string;
    showDualSignature?: boolean;
    workerName?: string;
    supervisorSignature?: string | null;
    workerSignature?: string | null;
  };
  customAuditDetails?: CustomAuditSlipDetails;
  reportRef?: React.RefObject<HTMLDivElement | null>;
}



export const UniversalReportExportModal: React.FC<UniversalReportExportModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  periodLabel,
  tableHeaders,
  tableRows,
  reportRef,
}) => {
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  /**
   * Generates a high-definition PNG image of the report using HTML5 Canvas
   */
  const handleExportAsImage = async () => {
    if (!reportRef?.current) {
      alert('Report content not found.');
      return;
    }
    setIsExportingImage(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 4, // High DPI for sharpness
        backgroundColor: '#f8fafc',
      });

      const sanitizedName = reportTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `${sanitizedName}_${periodLabel.replace(/[^a-z0-9]/gi, '_')}.png`;

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`Successfully downloaded "${filename}" as High-DPI PNG!`);
    } catch (err) {
      console.error('Image export failed:', err);
      alert('Failed to generate image. Please use PDF export instead.');
    } finally {
      setIsExportingImage(false);
    }
  };

  /**
   * Generates a printable PDF layout and invokes browser print
   */
  const handleExportAsPDF = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  /**
   * Generates a CSV file download
   */
  const handleExportAsCSV = () => {
    const csvContent = [
      tableHeaders.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...tableRows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportTitle.replace(/[^a-z0-9]/gi, '_')}_${periodLabel.replace(/[^a-z0-9]/gi, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded CSV data successfully!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Export Report: ${reportTitle}`}
      subtitle={`Download high-definition PNG image, or print/save as statutory PDF`}
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      size="2xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="text-xs text-slate-400 font-medium">
            Total Rows: <strong className="text-slate-700">{tableRows.length}</strong> | Total Columns:{' '}
            <strong className="text-slate-700">{tableHeaders.length}</strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportAsCSV}
              type="button"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportAsImage}
              disabled={isExportingImage}
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl inline-flex items-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExportingImage ? 'Generating Image...' : 'Download Image (PNG)'}</span>
            </button>

            <button
              onClick={handleExportAsPDF}
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl inline-flex items-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {toastMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
