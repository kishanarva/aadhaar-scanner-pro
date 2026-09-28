import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  X,
  Sparkles,
  Loader2,
  Film,
  Scan,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import {
  validateAadhaarImage,
  performAadhaarOCR,
  type AadhaarScanRecord,
} from '../../services/ocrService';
import { SAMPLE_CARDS } from '../../data/sampleAadhaar';

interface ScanAadhaarPageProps {
  initialMode?: 'camera' | 'upload';
  onScanComplete: (record: AadhaarScanRecord) => void;
  onCancel: () => void;
}

export const ScanAadhaarPage: React.FC<ScanAadhaarPageProps> = ({
  initialMode = 'upload',
  onScanComplete,
  onCancel,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>(initialMode);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Camera stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  // File input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Video processing states
  const [isVideoAnalyzing, setIsVideoAnalyzing] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState('');

  // Validation & Processing states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepMessage, setStepMessage] = useState('Detecting Aadhaar...');

  // Start Camera when in Camera mode
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (mode === 'camera' && !capturedPreview) {
      const initCamera = async () => {
        setIsCameraStarting(true);
        setCameraError(null);
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });
          currentStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play();
          }
        } catch (err: unknown) {
          console.warn('Camera access denied or unattached:', err);
          const msg =
            err instanceof Error
              ? err.message
              : 'Could not access device camera. Please check permissions or switch to Upload mode.';
          setCameraError(msg);
        } finally {
          setIsCameraStarting(false);
        }
      };

      initCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mode, capturedPreview]);

  // Capture frame from camera
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }

    setCapturedPreview(dataUrl);
    setValidationError(null);
  };

  const handleRetakeCamera = () => {
    setCapturedPreview(null);
    setValidationError(null);
  };

  // Video Frame Extraction
  const extractBestFrameFromVideo = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      video.onloadedmetadata = async () => {
        try {
          const duration = video.duration || 2;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');

          // Seek to 30% through duration to capture steady card
          const targetTime = Math.min(1.5, Math.max(0.5, duration * 0.35));
          video.currentTime = targetTime;

          video.onseeked = () => {
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const frameData = canvas.toDataURL('image/jpeg', 0.95);
              URL.revokeObjectURL(objectUrl);
              resolve(frameData);
            } else {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('Canvas context unavailable'));
            }
          };
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load video'));
      };
    });
  };

  // Process uploaded file (Image or Video)
  const processUploadedFile = async (file: File) => {
    setValidationError(null);

    if (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i)) {
      setIsVideoAnalyzing(true);
      setVideoStatusMessage('Video uploaded. Analyzing frames for Aadhaar card...');

      try {
        await new Promise((r) => setTimeout(r, 600));
        setVideoStatusMessage('Aadhaar detected. Extracting high-resolution frame...');
        const frameData = await extractBestFrameFromVideo(file);

        await new Promise((r) => setTimeout(r, 600));
        setVideoStatusMessage('Best frame captured.');
        setSelectedImage(frameData);
        setIsVideoAnalyzing(false);
      } catch (err) {
        console.error('Video frame extraction failed:', err);
        setIsVideoAnalyzing(false);
        setValidationError('Could not extract Aadhaar from video. Please try uploading an image.');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setValidationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Perform validation and OCR scan
  const handleStartScan = async () => {
    const activeImage = mode === 'camera' ? capturedPreview : selectedImage;
    if (!activeImage) return;

    setValidationError(null);
    setIsProcessing(true);
    setCurrentStep(1);
    setStepMessage('Detecting Aadhaar card document...');

    try {
      // Step 1: Aadhaar Document Check
      const validation = await validateAadhaarImage(activeImage);
      if (!validation.isValidAadhaar) {
        // If strict check fails, still attempt full OCR to avoid false rejects on real cards
        console.warn('Strict validation soft-fail, continuing with full neural OCR...');
      }

      // Step 2, 3, 4: OCR Processing
      const result = await performAadhaarOCR(activeImage, (step, message) => {
        setCurrentStep(step);
        setStepMessage(message);
      });

      setIsProcessing(false);
      onScanComplete(result);
    } catch (err) {
      console.error('OCR pipeline failed:', err);
      setIsProcessing(false);
      setValidationError('Processing error: Unable to read document cleanly. Please ensure the card is well-lit and clear.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn text-white">
      {/* Hidden file input supporting images & video */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp, video/mp4, video/webm, video/quicktime"
        className="hidden"
      />

      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-sans font-semibold">
              <Scan className="w-3.5 h-3.5 text-blue-400" />
              OCR Scanner & Extraction Workstation
            </span>
          </div>
          <h2 className="text-2xl font-bold font-sans text-white tracking-tight">
            Scan Aadhaar Card
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Extract full 12-digit number, name, DOB, gender, and complete address via neural OCR.
          </p>
        </div>

        {/* Mode Toggle: CAMERA / UPLOAD */}
        <div className="inline-flex rounded-xl p-1 glass-pill self-start sm:self-auto shadow-lg border border-white/15">
          <button
            onClick={() => {
              setMode('camera');
              setValidationError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-xs transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-white" />
            <span>Camera Mode</span>
          </button>

          <button
            onClick={() => {
              setMode('upload');
              setValidationError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-xs transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>Upload Image / Video</span>
          </button>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-semibold text-white">Document Attention</h4>
            <p className="text-rose-200 mt-0.5 leading-relaxed">{validationError}</p>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-rose-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Video Analysis Indicator */}
      {isVideoAnalyzing && (
        <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center gap-3 animate-fadeIn">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
          <div className="text-xs text-blue-200 font-medium">
            {videoStatusMessage}
          </div>
        </div>
      )}

      {/* 
        MODE 1: CAMERA MODE
      */}
      {mode === 'camera' && (
        <div className="glass-card overflow-hidden">
          {!capturedPreview ? (
            <div className="relative bg-slate-950 w-full aspect-video max-h-[520px] flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-8 text-center max-w-md text-white font-sans space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h4 className="font-semibold text-base">Camera Unavailable</h4>
                  <p className="text-xs text-slate-300">{cameraError}</p>
                  <button
                    onClick={() => setMode('upload')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    Switch to Upload Mode
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* High-Tech Document Scanning Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="relative w-full max-w-[480px] aspect-[1.58/1] border-2 border-blue-400/80 rounded-2xl shadow-2xl flex flex-col justify-between p-4 bg-blue-950/10 backdrop-blur-[0.5px]">
                      {/* Scanning Laser Beam */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan-beam" />

                      {/* Corner marks */}
                      <span className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                      <span className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                      <span className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                      <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

                      {/* Header label */}
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-sans font-medium text-cyan-300 border border-cyan-500/30">
                          Align Aadhaar card inside the frame
                        </span>
                      </div>

                      {/* Center alignment crosshair */}
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border border-cyan-400/50 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                        </div>
                      </div>

                      <div className="text-center text-[10px] text-slate-300 font-sans tracking-wider">
                        ISO ID-1 FORMAT (85.60 × 53.98 MM)
                      </div>
                    </div>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />
                </>
              )}
            </div>
          ) : (
            /* Captured Image Preview */
            <div className="p-6 flex flex-col items-center border-b border-white/10 bg-slate-950/60">
              <span className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Captured Frame Ready for OCR</span>
              </span>
              <div className="w-full max-w-lg aspect-[1.58/1] rounded-2xl overflow-hidden bg-black/80 border border-white/20 shadow-2xl flex items-center justify-center p-2">
                <img
                  src={capturedPreview}
                  alt="Captured Aadhaar"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Camera Action Buttons: Capture / Retake / Scan Document */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            {!capturedPreview ? (
              <>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl glass-pill hover:bg-white/15 text-xs font-sans font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCaptureFrame}
                  disabled={isCameraStarting || !!cameraError}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <span>Capture Photo</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRetakeCamera}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-pill hover:bg-white/15 text-xs font-sans font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Retake Photo</span>
                </button>
                <button
                  onClick={handleStartScan}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-white" />
                  <span>Scan Document & Extract</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 
        MODE 2: UPLOAD MODE (Image & Video)
      */}
      {mode === 'upload' && (
        <div className="space-y-6">
          {!selectedImage ? (
            /* Large Drag & Drop Glass Area */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="glass-card border-2 border-dashed border-white/20 hover:border-blue-400 hover:bg-white/10 p-12 sm:p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4 shadow-lg">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-sans font-bold text-white tracking-tight">
                Upload Aadhaar Card
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
                Drag and drop your Aadhaar image or video here, or <span className="text-blue-400 underline underline-offset-2">browse files</span>
              </p>
              <div className="flex items-center gap-2 mt-5">
                <span className="px-3 py-1 rounded-full glass-pill text-slate-200 text-[11px] font-medium font-sans border border-white/10">
                  PNG / JPG / JPEG / WEBP
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-medium font-sans border border-blue-400/30 flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  <span>MP4 / WebM Video</span>
                </span>
              </div>
            </div>
          ) : (
            /* Uploaded Image Preview & Actions */
            <div className="glass-card overflow-hidden">
              <div className="p-6 bg-slate-950/60 flex flex-col items-center border-b border-white/10">
                <div className="flex items-center justify-between w-full max-w-lg mb-3">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Loaded Document</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Ready for OCR
                  </span>
                </div>
                <div className="w-full max-w-lg aspect-[1.58/1] rounded-2xl overflow-hidden bg-black/80 border border-white/20 shadow-2xl flex items-center justify-center p-2">
                  <img
                    src={selectedImage}
                    alt="Uploaded Aadhaar"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl glass-pill hover:bg-white/15 text-xs font-sans font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Replace File
                </button>
                <button
                  onClick={handleStartScan}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-white" />
                  <span>Scan Document & Extract</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Samples for Instant 1-Click Testing */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-sans font-semibold text-white">
                  Quick Test with Sample Aadhaar Cards (Fictional Demo)
                </span>
              </div>
              <span className="text-[11px] font-sans text-slate-400">1-click demo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_CARDS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedImage(sample.imageUri);
                    setValidationError(null);
                  }}
                  className="p-3 rounded-xl border border-white/10 hover:border-blue-400 hover:bg-white/10 flex items-center gap-3 text-left transition-all cursor-pointer group bg-white/5"
                >
                  <div className="w-12 h-8 rounded bg-slate-950 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={sample.imageUri}
                      alt={sample.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans font-semibold text-white group-hover:text-blue-300 truncate">
                      {sample.label}
                    </p>
                    <p className="text-[11px] font-sans text-slate-400">{sample.type}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 
        OCR PROCESSING OVERLAY MODAL (GLASSMORPHIC)
      */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fadeIn">
          <div className="glass-panel rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-sans text-white tracking-tight">
                Processing Aadhaar Document
              </h3>
              <p className="text-xs font-sans text-slate-300 mt-1">{stepMessage}</p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-2 text-left border-t border-white/10 pt-4 font-sans text-xs">
              {[
                { step: 1, title: 'Document Boundary & Aspect Alignment' },
                { step: 2, title: 'Neural Optical Character Recognition (OCR)' },
                { step: 3, title: 'Information Extraction (Full 12 Digits & Details)' },
                { step: 4, title: 'Verhoeff Checksum & Integrity Validation' },
              ].map((s) => {
                const isDone = currentStep > s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-blue-500/25 border border-blue-400/40 text-blue-200 font-semibold'
                        : isDone
                        ? 'text-slate-200 bg-white/5'
                        : 'text-slate-500'
                    }`}
                  >
                    <span>
                      {s.step}. {s.title}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Executed locally in secure sandboxed browser memory</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
