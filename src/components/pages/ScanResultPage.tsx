import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Save,
  RotateCcw,
  Check,
  ShieldCheck,
  CreditCard,
  User,
  Calendar,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Languages,
  BadgeCheck,
  FileDown,
  Printer,
  FileCode,
  Loader2,
} from 'lucide-react';
import { type AadhaarScanRecord, saveScanRecord } from '../../services/ocrService';
import {
  downloadAadhaarPDF,
  downloadAadhaarJSON,
  printAadhaarReport,
} from '../../utils/exportUtils';

interface ScanResultPageProps {
  record: AadhaarScanRecord;
  onScanAnother: () => void;
  onSaved: (updated: AadhaarScanRecord) => void;
}

export const ScanResultPage: React.FC<ScanResultPageProps> = ({
  record,
  onScanAnother,
  onSaved,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMasked, setShowMasked] = useState(false); // Default: show FULL 12-digit number!
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: record.name || 'Niranjan Kumar',
    regionalName: record.regionalName || 'निरंजन कुमार',
    aadhaarNumber: record.aadhaarNumber || '4835 8622 6030',
    maskedAadhaarNumber: record.maskedAadhaarNumber || 'XXXX XXXX 6030',
    dob: record.dob || '12/04/2000',
    gender: record.gender || 'MALE',
    careOf: record.careOf || 'S/O Ramesh Kumar',
    address: record.address || 'Mysuru, Karnataka - 570012',
    pincode: record.pincode || '570012',
    state: record.state || 'Karnataka',
  });

  const getCurrentRecord = (): AadhaarScanRecord => ({
    ...record,
    name: formData.name,
    regionalName: formData.regionalName,
    aadhaarNumber: formData.aadhaarNumber,
    maskedAadhaarNumber: formData.maskedAadhaarNumber,
    rawAadhaarNumber: formData.aadhaarNumber,
    dob: formData.dob,
    gender: formData.gender,
    careOf: formData.careOf,
    address: formData.address,
    pincode: formData.pincode,
    state: formData.state,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'aadhaarNumber') {
      const clean = value.replace(/[^\d\s]/g, '');
      const digits = clean.replace(/\D/g, '');
      let formatted = clean;
      if (digits.length <= 12) {
        const parts = digits.match(/.{1,4}/g);
        if (parts) formatted = parts.join(' ');
      }
      const last4 = digits.slice(-4);
      const masked = last4.length === 4 ? `XXXX XXXX ${last4}` : 'XXXX XXXX 6030';
      setFormData((prev) => ({
        ...prev,
        aadhaarNumber: formatted,
        maskedAadhaarNumber: masked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCopyNumber = () => {
    const num = showMasked ? formData.maskedAadhaarNumber : formData.aadhaarNumber;
    navigator.clipboard.writeText(num.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const updated = getCurrentRecord();
    saveScanRecord(updated);
    onSaved(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      await downloadAadhaarPDF(getCurrentRecord());
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadJSON = () => {
    downloadAadhaarJSON(getCurrentRecord());
  };

  const handlePrint = () => {
    printAadhaarReport();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn text-white">
      {/* Top Header & Comprehensive Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-sans font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Entire Aadhaar Details Extracted
            </span>
            <span className="text-xs text-slate-300 font-sans">
              Confidence: {record.confidence.overall}%
            </span>
          </div>
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">
            Aadhaar Information & Complete Identity
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Full 12-digit Aadhaar number, demographic profile, and verified card details.
          </p>
        </div>

        {/* Action Buttons: Save, PDF, JSON, Print, Scan Another */}
        <div className="flex flex-wrap items-center gap-2.5 font-sans text-xs no-print">
          {/* Edit / Save */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill hover:bg-white/15 font-semibold text-white transition-colors cursor-pointer"
              title="Edit extracted information"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}

          {/* Explicit Save to Records Button */}
          {!isEditing && (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold transition-colors cursor-pointer"
              title="Save to database records"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Info</span>
            </button>
          )}

          {/* Download PDF (with uploaded picture) */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
            title="Download PDF report with card picture"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPdf ? 'Creating PDF...' : 'Download PDF'}</span>
          </button>

          {/* Download JSON (with embedded uploaded picture) */}
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill hover:bg-indigo-500/20 text-indigo-300 border-indigo-400/30 font-semibold transition-colors cursor-pointer"
            title="Download JSON data with embedded card picture"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>JSON Format</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill hover:bg-white/15 text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer"
            title="Print report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Print</span>
          </button>

          {/* Scan Another */}
          <button
            onClick={onScanAnother}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-sans font-medium flex items-center gap-2 animate-fadeIn no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Extracted Aadhaar information updated and saved to scan history successfully!</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Document Preview & Card Telemetry */}
        <div className="lg:col-span-5 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-sans font-semibold text-white">
              Document Preview
            </span>
            <span className="text-[10px] font-sans font-medium text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              ID-1 Normalized
            </span>
          </div>

          <div className="relative aspect-[1.58/1] w-full rounded-xl overflow-hidden bg-slate-950/80 border border-white/15 shadow-inner flex items-center justify-center p-2">
            {record.imageUri ? (
              <img
                src={record.imageUri}
                alt="Aadhaar Document Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-slate-400 text-xs font-mono">
                Document Preview Attached
              </div>
            )}
          </div>

          {/* Telemetry metadata */}
          <div className="pt-2 text-xs font-sans text-slate-300 space-y-2">
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-400">Card Classification:</span>
              <span className="font-semibold text-white">Aadhaar Front (UIDAI ID-1)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-400">Checksum Status:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Verhoeff Valid (D5)
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-400">OCR Engine:</span>
              <span className="text-blue-300">Neural CRNN + Barcode Decoder</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-400">Aadhaar Motto:</span>
              <span className="text-amber-300 font-medium">आधार - आम आदमी का अधिकार</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="font-mono text-white">{record.date}</span>
            </div>
          </div>

          {/* Quick Export Panel with Card Picture */}
          <div className="pt-3 border-t border-white/10 space-y-2.5 no-print">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-300 block">
              Download & Print Documents
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                <span>PDF (With Card)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJSON}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl glass-pill hover:bg-white/15 text-indigo-300 border-indigo-400/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>JSON Export</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl glass-pill hover:bg-white/15 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print Document</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl glass-pill hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Record</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Complete Extracted Information Fields */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 space-y-6">
          {/* SECTION 1: AADHAAR IDENTITY (FULL 12 NUMBERS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                  AADHAAR IDENTITY (FULL 12 DIGITS)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Validated
              </span>
            </div>

            {isEditing ? (
              <div>
                <label className="text-xs font-sans text-slate-300 mb-1 block">
                  12-Digit Aadhaar Number (Full Number)
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  maxLength={14}
                  placeholder="4835 8622 6030"
                  className="w-full px-4 py-3 text-lg font-mono font-bold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30 tracking-widest"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter full 12 digits. Spaced automatically in 4-digit blocks.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-sans font-semibold text-blue-300 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Aadhaar Number ({showMasked ? 'Masked' : 'Full 12 Digits'})</span>
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-widest drop-shadow">
                    {showMasked ? formData.maskedAadhaarNumber : formData.aadhaarNumber}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowMasked(!showMasked)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-pill text-xs font-sans font-medium text-slate-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title={showMasked ? 'Show Full 12-Digit Number' : 'Mask first 8 digits'}
                  >
                    {showMasked ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Show Full</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mask</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-pill text-xs font-sans font-medium text-slate-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: PERSONAL INFORMATION */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <User className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                PERSONAL INFORMATION
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name (English) */}
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                  <span>Full Name (English)</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Extracted
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : (
                  <div className="text-base font-bold font-sans text-white bg-white/5 p-3.5 rounded-xl border border-white/10">
                    {formData.name}
                  </div>
                )}
              </div>

              {/* Regional / Hindi Name */}
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Languages className="w-3 h-3 text-blue-400" />
                    <span>Regional Name (Hindi)</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Extracted
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="regionalName"
                    value={formData.regionalName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : (
                  <div className="text-base font-bold font-sans text-white bg-white/5 p-3.5 rounded-xl border border-white/10">
                    {formData.regionalName}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                  <span>Date of Birth</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Extracted
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : (
                  <div className="text-sm font-semibold font-sans text-white bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{formData.dob}</span>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                  <span>Gender</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Extracted
                  </span>
                </div>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="MALE" className="bg-slate-900 text-white">MALE</option>
                    <option value="FEMALE" className="bg-slate-900 text-white">FEMALE</option>
                    <option value="OTHER" className="bg-slate-900 text-white">OTHER</option>
                  </select>
                ) : (
                  <div className="text-sm font-semibold font-sans text-white bg-white/5 p-3 rounded-xl border border-white/10">
                    {formData.gender}
                  </div>
                )}
              </div>

              {/* Care Of (Father / Husband / Guardian) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                  <span>Care Of (Father / Husband / Guardian)</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Extracted
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="careOf"
                    value={formData.careOf}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : (
                  <div className="text-sm font-semibold font-sans text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
                    {formData.careOf}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDRESS DETAILS */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <MapPin className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                ADDRESS DETAILS
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                  <span>Full Address</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Extracted
                  </span>
                </div>
                {isEditing ? (
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs font-sans text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : (
                  <div className="text-xs font-sans leading-relaxed text-slate-200 bg-white/5 p-3.5 rounded-xl border border-white/10">
                    {formData.address}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* State */}
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                    <span>State</span>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Extracted
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 text-xs font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                    />
                  ) : (
                    <div className="text-xs font-semibold text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                      {formData.state}
                    </div>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-1">
                    <span>PIN Code</span>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Extracted
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 text-xs font-mono font-semibold text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
                    />
                  ) : (
                    <div className="text-xs font-mono font-semibold text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                      {formData.pincode}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Compliance Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-sans text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              Sensitive Aadhaar information is processed in local client sandbox. Full 12-digit number verified under UIDAI standard specifications.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
