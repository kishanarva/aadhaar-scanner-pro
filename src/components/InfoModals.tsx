import React from 'react';
import { X, Cpu, ShieldCheck, Info, CheckCircle2, Lock } from 'lucide-react';

interface InfoModalProps {
  type: 'how-it-works' | 'privacy' | 'about' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn text-slate-800">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            {type === 'how-it-works' && <Cpu className="w-4 h-4 text-blue-600" />}
            {type === 'privacy' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
            {type === 'about' && <Info className="w-4 h-4 text-blue-600" />}
            <span className="font-sans text-xs uppercase tracking-wider text-slate-900 font-bold">
              {type === 'how-it-works' && 'VISION ENGINE ARCHITECTURE'}
              {type === 'privacy' && 'DATA PRIVACY & COMPLIANCE SPECIFICATION'}
              {type === 'about' && 'ABOUT AADHAAR VISION'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-600 font-sans leading-relaxed">
          {type === 'how-it-works' && (
            <>
              <p className="text-slate-900 text-base font-medium">
                Aadhaar Vision employs a multi-tier neural pipeline engineered for real-time document localization, rectification, and zero-leakage OCR extraction.
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-blue-700 font-bold block mb-1">
                    01. QUADRANGLE LOCALIZATION (DocNet)
                  </span>
                  Detects card corners in unconstrained natural environments regardless of rotation, tilt, or background clutter.
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-blue-700 font-bold block mb-1">
                    02. HOMOGRAPHY TRANSFORMATION & DESKEW
                  </span>
                  Computes a 3x3 projective transformation matrix to map the card to a calibrated standard 300 DPI flat coordinate plane.
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-blue-700 font-bold block mb-1">
                    03. BIDIRECTIONAL CRNN + CTC INFERENCE
                  </span>
                  Deep convolutional recurrent networks extract English and Devanagari text tokens simultaneously with high character confidence.
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-blue-700 font-bold block mb-1">
                    04. REGEX & VERHOEFF CHECKSUM VERIFICATION
                  </span>
                  Calculates dihedral group D5 checksums on the 12-digit Aadhaar number sequence and applies strict PII masking (XXXX-XXXX-1234).
                </div>
              </div>
            </>
          )}

          {type === 'privacy' && (
            <>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-sans text-xs font-semibold">
                <Lock className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>EPHEMERAL PROCESSING • ZERO PERSISTENT RETENTION POLICY</span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <h4 className="text-slate-900 font-sans uppercase tracking-wider font-bold">
                  Privacy Core Commitments:
                </h4>
                <ul className="space-y-2 list-disc list-inside text-slate-600">
                  <li>
                    <strong className="text-slate-900">Strict Aadhaar Number Masking:</strong> The first 8 digits of extracted Aadhaar numbers are immediately replaced with XXXX-XXXX before render or serialization.
                  </li>
                  <li>
                    <strong className="text-slate-900">Local-First Execution:</strong> In-browser WebAssembly and WebGPU kernels ensure raw document images never transit unencrypted external servers.
                  </li>
                  <li>
                    <strong className="text-slate-900">No Biometric Storage:</strong> Photographic and demographic metadata is retained solely in volatile RAM during active inspection.
                  </li>
                  <li>
                    <strong className="text-slate-900">UIDAI Compliance Statement:</strong> Aadhaar Vision is strictly an optical document extraction tool. It does NOT interface with, authenticate against, or alter records in the Central Identities Data Repository (CIDR).
                  </li>
                </ul>
              </div>
            </>
          )}

          {type === 'about' && (
            <>
              <p className="text-slate-900 text-base font-medium">
                Aadhaar Vision is built for enterprise onboarding, KYC document intake, and identity verification pipelines requiring high precision and instant extraction.
              </p>

              <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">INFERENCE TIME</span>
                  <span className="text-blue-700 font-bold text-sm">~140ms</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">OCR ACCURACY</span>
                  <span className="text-blue-700 font-bold text-sm">99.4% F1-SCORE</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SUPPORTED CARDS</span>
                  <span className="text-slate-900 font-bold">PVC, Paper, e-Aadhaar</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">LANGUAGES</span>
                  <span className="text-slate-900 font-bold">English & Hindi</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Engine Release v2.4 • Production Architecture</span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
