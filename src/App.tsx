import { useState, useEffect, useCallback } from 'react';
import { Sidebar, type PageId } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { DashboardPage } from './components/pages/DashboardPage';
import { ScanAadhaarPage } from './components/pages/ScanAadhaarPage';
import { ScanResultPage } from './components/pages/ScanResultPage';
import { ScanHistoryPage } from './components/pages/ScanHistoryPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { HeroVideo } from './components/HeroVideo';
import { Navbar } from './components/Navbar';
import { InfoModals } from './components/InfoModals';
import {
  type AadhaarScanRecord,
  getStoredScans,
  deleteScanRecord,
} from './services/ocrService';

type ViewMode = 'hero' | 'dashboard';
type ModalType = 'how-it-works' | 'privacy' | 'about' | null;

export function App() {
  // Always open directly with the cinematic demo video by default
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=dashboard')) {
      return 'dashboard';
    }
    return 'hero';
  });

  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [scanInitialMode, setScanInitialMode] = useState<'camera' | 'upload'>('upload');
  const [scans, setScans] = useState<AadhaarScanRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<AadhaarScanRecord | null>(null);

  // Video and Transition states
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Load persisted scans on mount
  useEffect(() => {
    const loaded = getStoredScans();
    setScans(loaded);
    if (loaded.length > 0) {
      setActiveRecord(loaded[0]);
    }
  }, []);

  // Cinematic transition when GET STARTED is clicked
  const handleGetStartedTransition = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setViewMode('dashboard');
      setCurrentPage('dashboard');
      window.scrollTo(0, 0);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 850);
  }, [isTransitioning]);

  const handleStartScan = (initialMode: 'camera' | 'upload' = 'upload') => {
    setScanInitialMode(initialMode);
    setCurrentPage('scan');
  };

  const handleScanComplete = (newRecord: AadhaarScanRecord) => {
    const updated = getStoredScans();
    setScans(updated);
    setActiveRecord(newRecord);
    setCurrentPage('result');
  };

  const handleViewRecord = (record: AadhaarScanRecord) => {
    setActiveRecord(record);
    setCurrentPage('result');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deleteScanRecord(id);
    setScans(updated);
    if (activeRecord?.id === id) {
      setActiveRecord(updated[0] || null);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('aadhaar_scan_records_v1');
    setScans([]);
    setActiveRecord(null);
  };

  const handleRecordSaved = (updatedRecord: AadhaarScanRecord) => {
    setActiveRecord(updatedRecord);
    setScans(getStoredScans());
  };

  return (
    <div className="relative min-h-screen w-full font-sans antialiased overflow-x-hidden">
      {/* 
        VIEW 1: CINEMATIC DEMO VIDEO HERO EXPERIENCE (DEFAULT)
        - Full viewport: 100vw × 100vh
        - Plays provided demonstration video edge-to-edge
        - Holds on final frame
        - Sequential reveal of title, animated tabs, and GET STARTED
      */}
      {viewMode === 'hero' ? (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-50">
          <Navbar
            currentView="hero"
            isVideoEnded={isVideoEnded}
            onNavigateHome={() => setViewMode('hero')}
            onOpenHowItWorks={() => setActiveModal('how-it-works')}
            onOpenPrivacy={() => setActiveModal('privacy')}
            onOpenAbout={() => setActiveModal('about')}
          />

          <HeroVideo
            onGetStarted={handleGetStartedTransition}
            isTransitioning={isTransitioning}
            onVideoEndChange={setIsVideoEnded}
          />
        </div>
      ) : (
        /* 
          VIEW 2: ENTERPRISE SAAS DASHBOARD & WORKSTATION
          - Cinematic Looping Background Video from user
          - Glassmorphism & Minimalist Floating Cards
        */
        <div className="relative min-h-screen text-white overflow-x-hidden">
          {/* Ambient Video Background */}
          <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center scale-105"
              src="/videos/dashboard-bg.mp4"
            />
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none" />
          </div>

          {/* Content Layer with Floating Glass Cards */}
          <div className="relative z-10 flex min-h-screen p-3 sm:p-5 gap-4">
            <Sidebar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onWatchDemo={() => setViewMode('hero')}
            />

            <div className="flex-1 flex flex-col min-w-0 gap-4">
              <TopNavbar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onSearch={(query) => {
                  if (query && currentPage !== 'history') {
                    setCurrentPage('history');
                  }
                }}
              />

              <main className="flex-1 pb-10">
                {currentPage === 'dashboard' && (
                  <DashboardPage
                    scans={scans}
                    onStartScan={handleStartScan}
                    onViewRecord={handleViewRecord}
                  />
                )}

                {currentPage === 'scan' && (
                  <ScanAadhaarPage
                    initialMode={scanInitialMode}
                    onScanComplete={handleScanComplete}
                    onCancel={() => setCurrentPage('dashboard')}
                  />
                )}

                {currentPage === 'result' && activeRecord && (
                  <ScanResultPage
                    record={activeRecord}
                    onScanAnother={() => handleStartScan('upload')}
                    onSaved={handleRecordSaved}
                  />
                )}

                {currentPage === 'history' && (
                  <ScanHistoryPage
                    scans={scans}
                    onViewRecord={handleViewRecord}
                    onDeleteRecord={handleDeleteRecord}
                  />
                )}

                {currentPage === 'settings' && (
                  <SettingsPage onClearHistory={handleClearHistory} />
                )}
              </main>
            </div>
          </div>
        </div>
      )}

      {/* Global Cinematic Transition Overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 ease-in-out ${
          isTransitioning ? 'opacity-100 bg-white/90 backdrop-blur-md' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Technical Architecture, Privacy & Engine Information Modals */}
      <InfoModals
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}

export default App;
