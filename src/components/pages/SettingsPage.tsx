import React, { useState } from 'react';
import {
  User,
  Camera,
  Cpu,
  ShieldCheck,
  Check,
  Trash2,
} from 'lucide-react';

interface SettingsPageProps {
  onClearHistory: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onClearHistory }) => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    orgName: 'AadhaarScan AI Node',
    operatorName: 'Lakshmi Ar',
    email: 'operator@aadhaarscan.ai',
  });
  const [ocrConfig, setOcrConfig] = useState({
    confidenceThreshold: 90,
    autoDeskew: true,
    bilingualSupport: true,
    verhoeffValidation: true,
  });
  const [cameraConfig, setCameraConfig] = useState({
    hdResolution: true,
    facingMode: 'environment',
  });

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">
            Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Configure OCR parameters, camera devices, and security rules.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : null}
          <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: PROFILE */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-slate-300 mb-1">
                Organization / Node
              </label>
              <input
                type="text"
                value={profile.orgName}
                onChange={(e) => setProfile({ ...profile, orgName: e.target.value })}
                className="w-full px-3 py-2 text-xs font-sans text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-300 mb-1">
                Operator Name
              </label>
              <input
                type="text"
                value={profile.operatorName}
                onChange={(e) => setProfile({ ...profile, operatorName: e.target.value })}
                className="w-full px-3 py-2 text-xs font-sans text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-sans font-medium text-slate-300 mb-1">
                Operator Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 text-xs font-sans text-white glass-input rounded-xl focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: OCR PARAMETERS */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              OCR Parameters
            </h3>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Minimum Confidence Threshold</span>
                <span className="font-semibold text-blue-400">{ocrConfig.confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={ocrConfig.confidenceThreshold}
                onChange={(e) =>
                  setOcrConfig({ ...ocrConfig, confidenceThreshold: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl glass-pill cursor-pointer">
                <input
                  type="checkbox"
                  checked={ocrConfig.autoDeskew}
                  onChange={(e) => setOcrConfig({ ...ocrConfig, autoDeskew: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-white block">Auto Perspective Deskew</span>
                  <span className="text-[10px] text-slate-400">Correct card rotation angle</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl glass-pill cursor-pointer">
                <input
                  type="checkbox"
                  checked={ocrConfig.bilingualSupport}
                  onChange={(e) =>
                    setOcrConfig({ ...ocrConfig, bilingualSupport: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-white block">Bilingual Neural OCR</span>
                  <span className="text-[10px] text-slate-400">English + Devanagari script</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl glass-pill cursor-pointer sm:col-span-2">
                <input
                  type="checkbox"
                  checked={ocrConfig.verhoeffValidation}
                  onChange={(e) =>
                    setOcrConfig({ ...ocrConfig, verhoeffValidation: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold text-white block">Enforce Verhoeff D5 Checksum</span>
                  <span className="text-[10px] text-slate-400">
                    Mathematically validate genuine Aadhaar 12-digit numbers
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: CAMERA SPECIFICATIONS */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
              Camera Specifications
            </h3>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex items-center justify-between p-3 rounded-xl glass-pill">
              <div>
                <span className="font-semibold text-white block">High Definition Stream (1080p)</span>
                <span className="text-[10px] text-slate-400">Optimize for sharp micro-print legibility</span>
              </div>
              <input
                type="checkbox"
                checked={cameraConfig.hdResolution}
                onChange={(e) =>
                  setCameraConfig({ ...cameraConfig, hdResolution: e.target.checked })
                }
                className="rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-pill">
              <div>
                <span className="font-semibold text-white block">Default Lens</span>
                <span className="text-[10px] text-slate-400">Environment facing camera (back lens)</span>
              </div>
              <select
                value={cameraConfig.facingMode}
                onChange={(e) =>
                  setCameraConfig({ ...cameraConfig, facingMode: e.target.value })
                }
                className="bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="environment">Environment (Back)</option>
                <option value="user">User (Front / Webcam)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: DATA RETENTION & PURGE */}
        <div className="glass-card p-6 space-y-4 border-rose-500/20">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-sans font-bold text-rose-300 uppercase tracking-wider">
              Data Privacy & Local Storage
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-sans">
              <span className="font-semibold text-white block">Purge Local Scan History</span>
              <span className="text-[10px] text-slate-400">
                Immediately clear all stored scan records and in-memory caches.
              </span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to purge all local scan records?')) {
                  onClearHistory();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-sans font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Scan History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
