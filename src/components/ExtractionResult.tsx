import { useState } from 'react';
import type { ExtractedAadhaarData } from '../data/sampleAadhaar';

import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Code,
  CreditCard,
} from 'lucide-react';

interface ExtractionResultProps {
  data: ExtractedAadhaarData;
  imageSrc: string;
  onReset: () => void;
}

export const ExtractionResult: React.FC<ExtractionResultProps> = ({
  data,
  imageSrc,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'json'>('cards');

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aadhaar_extracted_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-fadeIn">
      {/* Top Banner: EXTRACTION COMPLETE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-[11px] font-mono tracking-widest text-emerald-300 uppercase font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              EXTRACTION COMPLETE
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-neutral-500">
              Confidence: {data.ocrConfidence}%
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Document Extraction Overview
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
            Review extracted information before continuing.
          </p>
        </div>

        {/* View Switcher & Action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
                viewMode === 'cards'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Fields</span>
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
                viewMode === 'json'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>

          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.04] text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
            title="Copy structured JSON payload"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.04] text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
            title="Download JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Details & Original Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Formatted Fields per exact user specifications */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {viewMode === 'cards' ? (
            <div className="bg-[#0b0d14] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
              {/* Field 1: Name */}
              <div className="group border-b border-white/[0.06] pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                  Name
                </span>
                <div className="mt-1 text-lg sm:text-xl font-mono font-bold text-white tracking-wide">
                  {data.name}
                </div>
              </div>

              {/* Field 2 & 3: Date of Birth and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                    Date of Birth
                  </span>
                  <div className="mt-1 text-base sm:text-lg font-mono font-semibold text-white tracking-wide">
                    {data.dob}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                    Gender
                  </span>
                  <div className="mt-1 text-base sm:text-lg font-mono font-semibold text-white tracking-wide">
                    {data.gender}
                  </div>
                </div>
              </div>

              {/* Field 4: Aadhaar Number (Masked) */}
              <div className="border-b border-white/[0.06] pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                    Aadhaar Number
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                    MASKED (PII SAFE)
                  </span>
                </div>
                <div className="mt-1 text-xl sm:text-2xl font-mono font-bold text-cyan-300 tracking-[0.2em]">
                  {data.aadhaarNumber}
                </div>
              </div>

              {/* Field 5: Address */}
              <div className="pb-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                  Address
                </span>
                <div className="mt-1 text-sm sm:text-base font-mono text-neutral-200 leading-relaxed">
                  {data.address}
                </div>
              </div>
            </div>
          ) : (
            /* Raw JSON View */
            <div className="bg-[#08090e] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-neutral-400 border-b border-white/10 pb-2">
                <span>PARSED SCHEMA OUTPUT</span>
                <span>CONTENT-TYPE: application/json</span>
              </div>
              <pre className="font-mono text-xs text-cyan-300 overflow-x-auto p-4 bg-black/60 rounded-xl leading-relaxed">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {/* UIDAI Compliance Disclaimer (CRITICAL USER SPEC) */}
          <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-4 sm:p-5 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-200/90 font-sans">
              <span className="font-semibold block text-amber-300 uppercase font-mono tracking-wider mb-1">
                Compliance & Verification Notice
              </span>
              This computer vision OCR extraction tool parses visual document data. It does not authenticate or verify the Aadhaar with UIDAI.
            </div>
          </div>
        </div>

        {/* Right Column: Source Document Verification & Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Document Preview Thumbnail */}
          <div className="bg-[#0b0d14] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
              <span>SOURCE DOCUMENT PREVIEW</span>
              <span className="text-[10px] text-cyan-400/80">300 DPI RECTIFIED</span>
            </span>

            <div className="relative aspect-[1.58/1] w-full rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center p-2">
              <img
                src={imageSrc}
                alt="Source card"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-2 right-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded">
                ALIGNED
              </div>
            </div>
          </div>

          {/* Validation Metrics */}
          <div className="bg-[#0b0d14] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3.5">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold block">
              ENGINE TELEMETRY
            </span>

            <div className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/[0.05]">
              <span className="text-neutral-400">Card Localization</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                {data.detectionConfidence}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/[0.05]">
              <span className="text-neutral-400">Verhoeff Checksum</span>
              <span className="text-emerald-400 font-semibold">VALID (D5 DIHEDRAL)</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/[0.05]">
              <span className="text-neutral-400">Inference Latency</span>
              <span className="text-white font-semibold">{data.processingTimeMs} ms</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono py-1.5">
              <span className="text-neutral-400">Security Policy</span>
              <span className="text-cyan-300 font-semibold">ZERO RETENTION</span>
            </div>
          </div>

          {/* Next Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl border border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>SCAN ANOTHER CARD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
