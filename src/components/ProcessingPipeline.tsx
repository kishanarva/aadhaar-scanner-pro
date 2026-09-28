import React, { useState, useEffect } from 'react';
import type { ExtractedAadhaarData } from '../data/sampleAadhaar';

import {
  Scan,
  Layers,
  FileSearch,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface ProcessingPipelineProps {
  imageSrc: string;
  targetData: ExtractedAadhaarData;
  onComplete: (data: ExtractedAadhaarData) => void;
}

type PipelineStep =
  | 'detection'
  | 'processing'
  | 'ocr'
  | 'extraction'
  | 'validation'
  | 'complete';

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  imageSrc,
  targetData,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<PipelineStep>('detection');
  const [stepProgress, setStepProgress] = useState(15);
  const [logs, setLogs] = useState<string[]>([]);

  // Step sequence orchestration
  useEffect(() => {
    // 1. Detection (0 - 900ms)
    setLogs((prev) => [
      ...prev,
      'Initializing document detector (YOLOv8-DocNet)...',
      'Searching for quadrangle keypoints: 4 corners localized.',
    ]);

    const timer1 = setTimeout(() => {
      setCurrentStep('processing');
      setStepProgress(35);
      setLogs((prev) => [
        ...prev,
        'Computing homography transformation matrix...',
        'Perspective warp applied • Deskew angle: +1.4° normalized to 300 DPI.',
      ]);
    }, 950);

    // 2. Image Processing (950 - 1900ms)
    const timer2 = setTimeout(() => {
      setCurrentStep('ocr');
      setStepProgress(60);
      setLogs((prev) => [
        ...prev,
        'Deploying text region proposal network (CRNN-CTC)...',
        'Recognizing text tokens: 18 character bounding boxes mapped.',
      ]);
    }, 2000);

    // 3. OCR (2000 - 3000ms)
    const timer3 = setTimeout(() => {
      setCurrentStep('extraction');
      setStepProgress(80);
      setLogs((prev) => [
        ...prev,
        'Classifying named entities: Name, DOB, Gender, UID, Address.',
        'Extracting masked Aadhaar sequence: XXXX-XXXX-1234.',
      ]);
    }, 3100);

    // 4. Validation (3100 - 3900ms)
    const timer4 = setTimeout(() => {
      setCurrentStep('validation');
      setStepProgress(95);
      setLogs((prev) => [
        ...prev,
        'Computing Verhoeff dihedral D5 checksum verification...',
        'Checksum valid • UID structure conforms to ISO/IEC 7812.',
      ]);
    }, 4000);

    // 5. Complete & Transition to Result (4800ms)
    const timer5 = setTimeout(() => {
      setCurrentStep('complete');
      setStepProgress(100);
      onComplete(targetData);
    }, 4900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [targetData, onComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Top Phase Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400 font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            REAL-TIME INFERENCE PIPELINE
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Analyzing Aadhaar Document
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48 bg-white/[0.06] rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <span className="font-mono text-xs text-white/70 font-semibold w-10 text-right">
            {stepProgress}%
          </span>
        </div>
      </div>

      {/* Grid: Interactive Visual Canvas + Live System Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Visual Document Inspection Canvas with dynamic overlays */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[1.58/1] w-full rounded-xl bg-black border border-white/15 overflow-hidden flex items-center justify-center p-3">
            {/* The Document Image */}
            <img
              src={imageSrc}
              alt="Document being processed"
              className={`max-w-full max-h-full object-contain transition-all duration-500 ${
                currentStep === 'processing' ? 'filter contrast-125 brightness-110' : ''
              }`}
            />

            {/* STAGE 1: DOCUMENT DETECTION CORNERS OVERLAY */}
            {(currentStep === 'detection' || currentStep === 'processing') && (
              <div className="absolute inset-4 pointer-events-none border border-cyan-400/80 rounded-lg animate-pulse">
                {/* 4 Corner Keypoint Nodes */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-cyan-400/40 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-300">
                  QUAD DETECTED: 99.4% CONFIDENCE
                </div>
              </div>
            )}

            {/* STAGE 3: OCR LASER SCANNING BEAM & BOUNDING BOXES */}
            {currentStep === 'ocr' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Laser Bar */}
                <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_4px_#22d3ee] animate-laser" />

                {/* Simulated Bounding Boxes */}
                <div className="absolute top-[28%] left-[28%] w-[35%] h-[12%] border border-cyan-400/70 bg-cyan-400/10 rounded" />
                <div className="absolute top-[42%] left-[28%] w-[25%] h-[10%] border border-cyan-400/70 bg-cyan-400/10 rounded" />
                <div className="absolute top-[42%] left-[56%] w-[20%] h-[10%] border border-cyan-400/70 bg-cyan-400/10 rounded" />
                <div className="absolute top-[68%] left-[8%] w-[84%] h-[16%] border border-cyan-400/90 bg-cyan-400/15 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
                <div className="absolute top-[23%] right-[7%] w-[18%] h-[28%] border border-emerald-400/80 bg-emerald-400/10 rounded" />

                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm border border-cyan-400/50 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-300">
                  SCANNING TEXT MATRICES...
                </div>
              </div>
            )}

            {/* STAGE 4 & 5: EXTRACTION & VALIDATION OVERLAY */}
            {(currentStep === 'extraction' || currentStep === 'validation') && (
              <div className="absolute inset-0 pointer-events-none bg-cyan-950/20 backdrop-blur-[1px] flex items-center justify-center p-6">
                <div className="bg-black/85 border border-cyan-500/40 rounded-xl p-5 shadow-2xl max-w-sm w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold">
                      {currentStep === 'extraction'
                        ? 'Parsing Named Fields'
                        : 'Verhoeff Checksum Check'}
                    </span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] text-white/80">
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/40">NAME:</span>
                      <span className="text-cyan-300 font-semibold">{targetData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/40">DOB:</span>
                      <span className="text-white">{targetData.dob}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/40">GENDER:</span>
                      <span className="text-white">{targetData.gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/40">AADHAAR:</span>
                      <span className="text-red-400 font-semibold">{targetData.aadhaarNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-2">
            <span>INPUT: RGB ID-1 DOCUMENT</span>
            <span>ASPECT RATIO: 1.586</span>
            <span>COLOR SPACE: sRGB</span>
          </div>
        </div>

        {/* Right: Step Status Cards & Console Log Stream */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0b0d14] border border-white/10 rounded-xl p-5 shadow-lg">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/80 font-semibold mb-4">
              PIPELINE STAGES
            </h3>

            <div className="space-y-3">
              {/* Stage 1: Document Detection */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  currentStep === 'detection'
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : currentStep === 'complete' || stepProgress > 20
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <Scan
                  className={`w-4 h-4 mt-0.5 ${
                    currentStep === 'detection' ? 'text-cyan-400 animate-spin' : 'text-emerald-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                      1. Document Detection
                    </span>
                    {stepProgress > 25 && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Corner localization & quadrangle boundary segmentation.
                  </p>
                </div>
              </div>

              {/* Stage 2: Image Preprocessing */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  currentStep === 'processing'
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : stepProgress > 45
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <Layers
                  className={`w-4 h-4 mt-0.5 ${
                    currentStep === 'processing' ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                      2. Image Preprocessing
                    </span>
                    {stepProgress > 50 && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Homography deskewing, binarization & contrast enhancement.
                  </p>
                </div>
              </div>

              {/* Stage 3: OCR Engine */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  currentStep === 'ocr'
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : stepProgress > 70
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <FileSearch
                  className={`w-4 h-4 mt-0.5 ${
                    currentStep === 'ocr' ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                      3. OCR Recognition
                    </span>
                    {stepProgress > 75 && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Bidirectional LSTM + CTC token recognition.
                  </p>
                </div>
              </div>

              {/* Stage 4: Field Extraction & Validation */}
              <div
                className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  currentStep === 'extraction' || currentStep === 'validation'
                    ? 'border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : stepProgress >= 95
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <ShieldAlert
                  className={`w-4 h-4 mt-0.5 ${
                    currentStep === 'validation' ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                      4. Extraction & Validation
                    </span>
                    {stepProgress === 100 && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Verhoeff checksum computation & PII masking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time telemetry log feed */}
          <div className="bg-[#07090e] border border-white/10 rounded-xl p-4 font-mono text-[10px] text-neutral-300 max-h-44 overflow-y-auto space-y-1.5">
            <div className="text-neutral-500 border-b border-white/10 pb-1 flex items-center justify-between">
              <span>SYSTEM EVENT STREAM</span>
              <span className="text-cyan-400/80">LATENCY: 142MS</span>
            </div>
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-cyan-400/60">{'>'}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
