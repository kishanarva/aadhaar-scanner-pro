import { useState } from 'react';
import {
  Search,
  Trash2,
  Eye,
  Filter,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import type { AadhaarScanRecord } from '../../services/ocrService';

interface ScanHistoryPageProps {
  scans: AadhaarScanRecord[];
  onViewRecord: (record: AadhaarScanRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const ScanHistoryPage: React.FC<ScanHistoryPageProps> = ({
  scans,
  onViewRecord,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Extracted' | 'Failed'>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = scans.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.maskedAadhaarNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const confirmDelete = (id: string) => {
    onDeleteRecord(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">
            Scan History
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Search, review and manage past extracted Aadhaar documents.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans text-slate-300 glass-pill px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Persistent Cloud Storage</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, Aadhaar or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-sans glass-input rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto font-sans text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Extracted">Successful</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Showing {filtered.length} of {scans.length} records
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-sans font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Aadhaar Number</th>
                <th className="px-6 py-3.5">Address</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-sans">
                    No scans found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {record.aadhaarNumber || record.maskedAadhaarNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {record.address}
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap font-sans text-[11px]">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium ${
                          record.status === 'Extracted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3 font-sans">
                        <button
                          onClick={() => onViewRecord(record)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(record.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full text-center space-y-4 font-sans">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete Scan Record?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                This will permanently delete this Aadhaar extraction from your local records.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
