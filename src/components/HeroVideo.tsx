import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GetStartedButton } from './GetStartedButton';
import { Play, RotateCcw, Volume2, VolumeX, Eye } from 'lucide-react';

interface HeroVideoProps {
  onGetStarted: () => void;
  isTransitioning: boolean;
  onVideoEndChange?: (ended: boolean) => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  onGetStarted,
  isTransitioning,
  onVideoEndChange,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Staged reveal states
  const [revealOverlay, setRevealOverlay] = useState(false);
  const [revealTitle, setRevealTitle] = useState(false);
  const [revealSubtitle, setRevealSubtitle] = useState(false);
  const [revealCTA, setRevealCTA] = useState(false);

  // Trigger staged reveal sequence when video finishes
  const triggerEndSequence = useCallback(() => {
    if (hasEnded) return;
    setHasEnded(true);
    onVideoEndChange?.(true);

    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Step 1: Light frosted overlay
    setRevealOverlay(true);

    // Step 2: Fade in title (300ms)
    const t1 = setTimeout(() => {
      setRevealTitle(true);
    }, 300);

    // Step 3: Reveal description & tabs (650ms)
    const t2 = setTimeout(() => {
      setRevealSubtitle(true);
    }, 650);

    // Step 4: Reveal GET STARTED button (1000ms)
    const t3 = setTimeout(() => {
      setRevealCTA(true);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hasEnded, onVideoEndChange]);

  // Attempt autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          console.warn('Autoplay blocked:', err);
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }
  }, []);

  const handlePlayManual = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          console.error('Play error:', err);
        });
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      setHasEnded(false);
      setRevealOverlay(false);
      setRevealTitle(false);
      setRevealSubtitle(false);
      setRevealCTA(false);
      onVideoEndChange?.(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleFastForwardToEnd = () => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.duration - 0.1);
      triggerEndSequence();
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    if (!duration && video.duration) {
      setDuration(video.duration);
    }

    if (video.duration > 0 && video.currentTime >= video.duration - 0.15 && !hasEnded) {
      triggerEndSequence();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[#f8fafc] select-none flex items-center justify-center">
      {/* 
        Video Player
        - 100vw × 100vh full viewport
        - object-cover edge to edge without black bars
      */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-100">
        <video
          ref={videoRef}
          src="/videos/aadhaar-vision-demo.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={triggerEndSequence}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          className="w-full h-full min-w-full min-h-full object-cover object-center transition-all duration-700"
        />
      </div>

      {/* Subtle bottom edge hairline progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200 z-20 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 
        DURING VIDEO PLAYBACK:
        Minimal light badges bottom-left
      */}
      <div
        className={`absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 flex flex-col gap-1.5 pointer-events-none transition-opacity duration-500 ${
          hasEnded ? 'opacity-20' : 'opacity-90'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="font-mono text-[10px] md:text-[11px] font-semibold tracking-wider text-slate-700 uppercase">
            SYSTEM DEMONSTRATION
          </span>
        </div>
        <p className="font-mono text-xs tracking-wider text-slate-800 uppercase font-bold px-3">
          AI DOCUMENT INTELLIGENCE
        </p>
      </div>

      {/* Subtle bottom-right control tools */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex items-center gap-2.5">
        {hasEnded ? (
          <button
            onClick={handleReplay}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 font-sans text-xs font-semibold tracking-wide transition-all shadow-xs backdrop-blur-sm cursor-pointer"
            title="Replay Video"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Replay</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-full border border-slate-200 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              onClick={handleFastForwardToEnd}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 font-sans text-xs font-medium tracking-wide transition-all shadow-xs backdrop-blur-sm cursor-pointer"
              title="Skip to CTA"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Skip to CTA</span>
            </button>
          </>
        )}
      </div>

      {/* Autoplay blocked fallback button */}
      {autoplayBlocked && !isPlaying && !hasEnded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <button
            onClick={handlePlayManual}
            className="flex items-center gap-3 px-6 py-3.5 rounded-xl border border-blue-500 bg-blue-600 text-white shadow-lg transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5 fill-white text-white" />
            <span className="font-sans text-sm tracking-wider uppercase font-semibold">
              PLAY DEMO
            </span>
          </button>
        </div>
      )}

      {/* 
        CRITICAL END-OF-VIDEO LIGHT FROSTED OVERLAY & REVEAL SEQUENCE
      */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 transition-all duration-700 ease-out pointer-events-none ${
          revealOverlay
            ? 'opacity-100 bg-white/75 backdrop-blur-md'
            : 'opacity-0 bg-transparent'
        }`}
        aria-hidden={!revealOverlay}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center pointer-events-auto">
          {/* Subtle Project Tag / Eyebrow */}
          <div
            className={`transition-all duration-700 transform ${
              revealTitle
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="inline-block px-3 py-1 mb-4 rounded-full border border-blue-200 bg-blue-50 font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-blue-700 font-semibold uppercase shadow-xs">
              NEXT-GEN COMPUTER VISION ENGINE
            </span>
          </div>

          {/* Project Title: AadhaarScan AI */}
          <h1
            className={`font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs transition-all duration-700 transform ${
              revealTitle
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-95'
            }`}
          >
            AadhaarScan AI
          </h1>

          {/* Subtitle Description */}
          <p
            className={`mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-sans text-slate-600 font-medium tracking-normal max-w-xl transition-all duration-700 transform ${
              revealSubtitle
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Scan. Extract. Verify.
          </p>

          {/* 
            Types of Tab - Light Segmented Pill Tabs matching UI reference image (Option 4 / Option 6)
          */}
          <div
            className={`mt-6 flex flex-col items-center gap-2 transition-all duration-700 transform ${
              revealSubtitle
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div
              role="tablist"
              className="relative inline-flex items-center p-1 rounded-full bg-slate-100/90 border border-slate-200 shadow-xs"
            >
              {/* Smooth Animated Sliding Pill Backdrop */}
              <span
                className="absolute top-1 bottom-1 rounded-full bg-white border border-slate-200/90 shadow-xs transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: '4px',
                  width: `calc((100% - 8px) / 3)`,
                  transform: `translateX(${activeTab * 100}%)`,
                }}
              />

              {[
                { id: 0, label: 'Real-Time Local OCR' },
                { id: 1, label: 'Masked PII Safe' },
                { id: 2, label: 'Sub-150ms Inference' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative z-10 px-3.5 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-sans text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 select-none ${
                      isActive
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-xs" />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary CTA: GET STARTED (Appears only after sequence) */}
          <div
            className={`mt-7 sm:mt-8 transition-all duration-700 transform ${
              revealCTA
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
            }`}
          >
            <GetStartedButton
              onClick={onGetStarted}
              isTransitioning={isTransitioning}
            />
          </div>
        </div>
      </div>

      {/* Cinematic Transition Overlay when GET STARTED is clicked */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-500 ${
          isTransitioning
            ? 'opacity-100 bg-[#f8fafc]'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-700 font-semibold">
              INITIALIZING WORKSTATION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
