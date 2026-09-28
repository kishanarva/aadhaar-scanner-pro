import React from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Settings as SettingsIcon,
  Shield,
  MoreVertical,
  QrCode,
  FileText,
} from 'lucide-react';
import type { AadhaarScanRecord } from '../../services/ocrService';

interface DashboardPageProps {
  scans: AadhaarScanRecord[];
  onStartScan: (initialMode?: 'camera' | 'upload') => void;
  onViewRecord: (record: AadhaarScanRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  scans,
  onStartScan,
  onViewRecord,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartScan('upload');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-white">
      {/* 
        TOP HERO BANNER
        - Aadhaar OCR pill
        - Huge Title: Scan. Extract. Verify.
        - Subtitle
        - Action Buttons: [+ Scan Aadhaar] and [Upload Aadhaar]
      */}
      <div className="pt-2 pb-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-blue-300 text-xs font-medium mb-3">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span>Aadhaar OCR</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Scan. Extract.<br />
          Verify.
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
          Scan an Aadhaar card using your camera or upload an image to securely extract information with OCR.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <button
            onClick={() => onStartScan('camera')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-white" />
            <span>+ Scan Aadhaar</span>
          </button>

          <button
            onClick={() => onStartScan('upload')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-pill hover:bg-white/15 text-white font-medium text-xs transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-300" />
            <span>Upload Aadhaar</span>
          </button>
        </div>
      </div>

      {/* 
        MAIN CONTENT GRID:
        Left (approx 8 cols) | Right (approx 4 cols)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Stats + Main Scan/Demo Card + Recent Scans */}
        <div className="lg:col-span-8 space-y-5">
          {/* THREE STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Total Scans */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-medium">Total Scans</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                12
              </div>
              <div className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>20% from last week</span>
              </div>
            </div>

            {/* Stat 2: Successful OCR */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-medium">Successful OCR</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                11
              </div>
              <div className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>22% from last week</span>
              </div>
            </div>

            {/* Stat 3: Failed Scans */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300 font-medium">Failed Scans</span>
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                1
              </div>
              <div className="mt-1 text-[11px] text-rose-400 font-medium flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>50% from last week</span>
              </div>
            </div>
          </div>

          {/* 
            MAIN SCAN SECTION & FICTIONAL DEMO AADHAAR CARD
            Combined into a wide glass card matching the reference image layout
          */}
          <div className="glass-card p-5 sm:p-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
              {/* Left Sub-Panel: Actions and Drop Zone (7 cols) */}
              <div className="xl:col-span-7 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Scan Aadhaar
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Capture an Aadhaar card using your camera or upload an image.
                  </p>
                </div>

                {/* Two Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onStartScan('camera')}
                    className="p-3.5 rounded-xl glass-pill hover:bg-white/15 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Scan with Camera</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Use device camera</p>
                    </div>
                  </button>

                  <button
                    onClick={() => onStartScan('upload')}
                    className="p-3.5 rounded-xl glass-pill hover:bg-white/15 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Upload Aadhaar</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or JPEG</p>
                    </div>
                  </button>
                </div>

                {/* Drag & Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => onStartScan('upload')}
                  className="p-4 rounded-xl border border-dashed border-white/20 hover:border-blue-400 hover:bg-white/5 transition-all text-center cursor-pointer group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 mx-auto mb-1.5 transition-colors" />
                  <p className="text-xs text-slate-300">
                    Drag and drop your Aadhaar card here <span className="text-blue-400 underline underline-offset-2">or click to browse</span>
                  </p>
                </div>

                {/* Small Note */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Only Aadhaar cards are supported.</span>
                </div>
              </div>

              {/* Right Sub-Panel: Fictional DEMO Aadhaar Card Preview (5 cols) */}
              <div className="xl:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm bg-white rounded-2xl p-4 text-slate-900 shadow-2xl border border-slate-200 select-none">
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 tracking-wider">
                      DEMO AADHAAR CARD
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 tracking-wider">
                      NOT A REAL ID
                    </span>
                  </div>

                  {/* Emblem & Tricolor */}
                  <div className="border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-700 font-serif">
                        🏛️
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 tracking-wide uppercase">
                        Government of India
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-amber-600">AADHAAR</span>
                    </div>
                  </div>

                  {/* Avatar & Details */}
                  <div className="flex items-start gap-3">
                    {/* Illustrated Portrait Avatar */}
                    <div className="w-16 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=150&fit=crop&crop=face"
                        alt="Priya Sharma Demo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-xs font-bold text-slate-500">PHOTO</span>';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-400 block leading-tight">Name</span>
                        <p className="font-bold text-slate-900 leading-tight">Priya Sharma</p>
                      </div>
                      <div className="flex gap-3">
                        <div>
                          <span className="text-[9px] text-slate-400 block leading-tight">DOB</span>
                          <p className="font-semibold text-slate-700 leading-tight">14/08/1998</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block leading-tight">Gender</span>
                          <p className="font-semibold text-slate-700 leading-tight">Female</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <span className="text-[9px] text-slate-400 block leading-tight">Address</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-700">
                          <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">Mysuru, Karnataka</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code graphic */}
                    <div className="w-12 h-12 bg-slate-900 rounded-md p-1 shrink-0 flex items-center justify-center text-white">
                      <QrCode className="w-full h-full" />
                    </div>
                  </div>

                  {/* Masked Aadhaar Number Bar */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
                    <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                      XXXX XXXX 4821
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 italic text-center">
                  Example Aadhaar Card — Demo
                </p>
              </div>
            </div>
          </div>

          {/* 
            RECENT SCANS TABLE
            Glassmorphic table matching the reference image
          */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h4 className="font-sans text-xs uppercase tracking-wider text-white font-bold">
                  Recent Scans
                </h4>
              </div>
              <button
                onClick={() => onStartScan('upload')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-300 font-sans font-medium border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Aadhaar Number</th>
                    <th className="px-5 py-3">Address</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                        {scan.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-200 whitespace-nowrap">
                        {scan.aadhaarNumber || scan.maskedAadhaarNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 max-w-[160px] truncate">
                        {scan.address}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap font-sans text-[11px]">
                        {scan.date}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium ${
                            scan.status === 'Extracted'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : scan.status === 'Processing'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {scan.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onViewRecord(scan)}
                            className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button className="text-slate-400 hover:text-white p-1">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Today's Processing & Quick & Secure (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 
            CARD 1: TODAY'S PROCESSING
            - Blue circle with Zap icon
            - 4 connected steps with green checkmarks
            - Bottom protection pill
          */}
          <div className="glass-card p-5 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-blue-400" />
              </div>
              <h4 className="font-sans text-xs uppercase tracking-wider text-white font-bold">
                Today's Processing
              </h4>
            </div>

            {/* Connected Vertical Timeline */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/40">
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-sm shadow-emerald-500/40">
                  ✓
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Aadhaar Detected</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Completed</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-sm shadow-emerald-500/40">
                  ✓
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>OCR Processing</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Completed</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-sm shadow-emerald-500/40">
                  ✓
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Information Extracted</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Completed</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-sm shadow-emerald-500/40">
                  ✓
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Validation Complete</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Completed</span>
                </div>
              </div>
            </div>

            {/* Bottom protection notice */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px]">
                Your Aadhaar information is protected.
              </span>
            </div>
          </div>

          {/* 
            CARD 2: QUICK & SECURE
            - Blue circle with Shield icon
            - 3 features with circular icons
          */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-start gap-2.5 pb-2 border-b border-white/10">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-sans text-xs uppercase tracking-wider text-white font-bold">
                  Quick & Secure
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Extract Aadhaar information in seconds with high accuracy and security.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Fast OCR Processing</p>
                  <p className="text-[11px] text-slate-400">Powered by advanced OCR</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Aadhaar Compatible</p>
                  <p className="text-[11px] text-slate-400">Only Aadhaar documents</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Your Data, Your Control</p>
                  <p className="text-[11px] text-slate-400">Secure and private</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
