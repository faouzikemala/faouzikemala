import React, { useState, useEffect } from 'react';
import { LockScreen } from './components/Windows11/LockScreen';
import { Desktop } from './components/Windows11/Desktop';
import { PhoneAppLayout } from './components/PhoneApp/PhoneAppLayout';

export default function App() {
  // Lock Screen state: defaults to locked on initial arrival as requested
  const [isLocked, setIsLocked] = useState<boolean>(true);

  // Language choice: 'en' for English or 'ar' for Arabic with professional typography
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

  // Mobile App Mode: defaults to true on mobile screens (< 768px)
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Track viewport resize
  useEffect(() => {
    const handleResize = () => {
      // If user hasn't explicitly toggled, keep in sync with viewport
      if (window.innerWidth < 768 && !isMobileMode) {
        setIsMobileMode(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020307] font-sans select-none text-slate-100">
      {isLocked ? (
        <LockScreen
          onUnlock={() => setIsLocked(false)}
          currentLang={currentLang}
          onToggleLang={() => setCurrentLang(l => (l === 'en' ? 'ar' : 'en'))}
        />
      ) : isMobileMode ? (
        <PhoneAppLayout
          currentLang={currentLang}
          onToggleLang={() => setCurrentLang(l => (l === 'en' ? 'ar' : 'en'))}
          onSwitchToDesktop={() => setIsMobileMode(false)}
        />
      ) : (
        <Desktop
          onLockScreen={() => setIsLocked(true)}
          currentLang={currentLang}
          onToggleLang={() => setCurrentLang(l => (l === 'en' ? 'ar' : 'en'))}
          onSwitchToPhone={() => setIsMobileMode(true)}
        />
      )}
    </div>
  );
}

