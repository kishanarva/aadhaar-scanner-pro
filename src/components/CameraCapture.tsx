import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Sparkles } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      setIsInitializing(true);
      setPermissionError(null);
      try {
        const constraints: MediaStreamConstraints = {
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }

        // Enumerate video devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableDevices(videoDevs);
      } catch (err: unknown) {
        console.error('Camera access error:', err);
        const errMsg =
          err instanceof Error
            ? err.message
            : 'Camera access denied or unavailable on this device.';
        setPermissionError(errMsg);
      } finally {
        setIsInitializing(false);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDeviceId]);

  // Capture current frame from camera
  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // Stop streams
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    onCapture(dataUrl);
  };

  const handleSwitchCamera = () => {
    if (availableDevices.length > 1) {
      const currentIndex = availableDevices.findIndex(
        (d) => d.deviceId === selectedDeviceId
      );
      const nextIndex = (currentIndex + 1) % availableDevices.length;
      setSelectedDeviceId(availableDevices[nextIndex].deviceId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#090b10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0e14]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-white/90 font-semibold">
              LIVE OPTICAL VIEWFINDER
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-video max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
          {permissionError ? (
            <div className="p-8 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-80" />
              <h3 className="font-mono text-sm tracking-wider uppercase text-white font-semibold mb-2">
                Camera Access Required
              </h3>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                {permissionError}
                <br />
                Please ensure camera permissions are allowed in your browser settings, or use the image upload option.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                Return to Upload Option
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

              {/* Targeting HUD & Alignment Frame */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                {/* 1.58:1 Standard ID-1 Aadhaar Card Aspect Ratio Frame */}
                <div className="relative w-full max-w-[500px] aspect-[1.58/1] border-2 border-dashed border-cyan-400/40 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between p-4">
                  {/* Glowing Corner Brackets */}
                  <span className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                  <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                  {/* Top HUD status */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300/80 tracking-widest uppercase">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                      AUTO-LOCALIZE ACTIVE
                    </span>
                    <span>RATIO: ID-1 (85.6 × 54mm)</span>
                  </div>

                  {/* Center reticle */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full" />
                    </div>
                  </div>

                  {/* Bottom instruction */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] font-mono tracking-wider text-white/90 border border-white/10">
                      ALIGN PHYSICAL AADHAAR CARD WITHIN BORDER
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        {!permissionError && (
          <div className="p-6 bg-[#0c0e14] border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {availableDevices.length > 1 && (
                <button
                  onClick={handleSwitchCamera}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch Camera</span>
                </button>
              )}
            </div>

            <button
              onClick={captureFrame}
              disabled={isInitializing}
              className="group relative flex items-center gap-3 px-8 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            >
              <Camera className="w-4 h-4" />
              <span>CAPTURE DOCUMENT</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
