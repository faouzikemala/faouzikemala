import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Lock, Sparkles, Folder, Github, Globe, Phone, MapPin } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { StarfieldCanvas } from '../StarfieldCanvas';

interface LockScreenProps {
  onUnlock: () => void;
  currentLang: 'en' | 'ar';
  onToggleLang: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  currentLang,
  onToggleLang
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isPromptingPassword, setIsPromptingPassword] = useState(false);

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setDateStr(
        now.toLocaleDateString(currentLang === 'ar' ? 'ar-TN' : 'en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  const isArabic = currentLang === 'ar';

  return (
    <div
      id="windows11-lock-screen"
      className={`fixed inset-0 z-50 flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden bg-[#020307] text-white min-h-screen scroll-smooth ${
        isArabic ? 'font-[\'Cairo\',\'Tajawal\',sans-serif]' : 'font-[\'Plus_Jakarta_Sans\',\'Space_Grotesk\',sans-serif]'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Dynamic Starfield with Streaming Stars transition on Lock Screen (Fixed in Background) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <StarfieldCanvas />
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 pointer-events-none" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 p-3.5 sm:p-6 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse shrink-0" />
          <span className="hidden xs:inline sm:inline">
            {isArabic
              ? 'شاشة القفل — تدفق النجوم ثلاثي الأبعاد مع التمرير'
              : 'Cosmic Starstream — Scroll to accelerate through space'}
          </span>
          <span className="xs:hidden sm:hidden">
            {isArabic ? 'شاشة القفل' : 'Lock Screen'}
          </span>
        </div>

        {/* Clean Language Switcher: English or Arabic (Pro font) */}
        <button
          onClick={onToggleLang}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-black/70 hover:bg-black/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20 text-xs text-slate-200 hover:text-white transition-all shadow-lg active:scale-95 shrink-0"
          title="Switch Language / تبديل اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold">{isArabic ? 'English' : 'العربية (خط احترافي)'}</span>
        </button>
      </div>

      {/* Middle Centerpiece: Dynamic Name + Time & Date (Elevated & Compact on Mobile) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto py-2 sm:py-6">
        <motion.div
          key={currentLang}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`max-w-2xl transition-all duration-300 ${
            isPromptingPassword ? 'mb-2 sm:mb-4' : 'mb-3 sm:mb-6'
          }`}
        >
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-400 font-mono mb-1.5 sm:mb-2">
            {isArabic ? 'ملف السيرة الذاتية التفاعلي • ويندوز 11' : 'Interactive Portfolio Edition • Windows 11'}
          </div>

          <h1
            className={`text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.45)] transition-all duration-300 ${
              isArabic ? 'font-[\'Cairo\']' : 'font-[\'Space_Grotesk\']'
            }`}
          >
            {isArabic ? personalInfo.nameArabic : personalInfo.name}
          </h1>

          <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed line-clamp-2 sm:line-clamp-none">
            {isArabic ? personalInfo.titleArabic : personalInfo.title}
          </p>

          <div className="mt-1.5 sm:mt-2 flex items-center justify-center space-x-3 sm:space-x-4 rtl:space-x-reverse text-[11px] sm:text-xs text-slate-400">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
              <span>{isArabic ? personalInfo.locationArabic : personalInfo.location}</span>
            </span>
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
              <span className="font-mono">{personalInfo.contact.phone}</span>
            </span>
          </div>
        </motion.div>

        {/* Windows 11 Lock Screen Big Digital Clock */}
        <div className={`space-y-0.5 sm:space-y-1 transition-all duration-300 ${
          isPromptingPassword ? 'scale-90 sm:scale-100' : ''
        }`}>
          <div className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tighter text-white drop-shadow-lg font-mono">
            {timeStr || '12:00'}
          </div>
          <div className="text-xs sm:text-base md:text-lg font-normal text-slate-300 tracking-wide">
            {dateStr || 'Loading...'}
          </div>
        </div>

        {/* User Profile Card & Sign In Control */}
        <div className={`transition-all duration-300 ${
          isPromptingPassword ? 'mt-3 sm:mt-6' : 'mt-4 sm:mt-8'
        }`}>
          <AnimatePresence mode="wait">
            {!isPromptingPassword ? (
              <motion.button
                key="enter-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setIsPromptingPassword(true)}
                className="group flex items-center space-x-3 sm:space-x-3.5 rtl:space-x-reverse px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 text-white font-medium shadow-2xl transition-all hover:border-white/50 hover:shadow-white/20 active:scale-95 cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  FK
                </div>
                <div className="text-left rtl:text-right">
                  <div className="text-xs font-semibold text-white">
                    {isArabic ? `تسجيل الدخول: ${personalInfo.nameArabic}` : `Sign In as ${personalInfo.name}`}
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {isArabic ? 'اضغط لفتح سطح المكتب ومجلد السيرة الذاتية' : 'Click to Open Desktop & CV Folder'}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform shrink-0" />
              </motion.button>
            ) : (
              <motion.div
                key="prompt-box"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl rounded-2xl border border-white/25 shadow-2xl w-[88vw] max-w-[320px] sm:w-84"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-700 to-slate-400 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg mb-2 sm:mb-3 border-2 border-white/30">
                  FK
                </div>
                <div className="text-sm sm:text-base font-semibold text-white">
                  {isArabic ? personalInfo.nameArabic : personalInfo.name}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-mono mb-3 sm:mb-4">{personalInfo.contact.email}</div>

                <button
                  id="btn-enter-windows11"
                  onClick={onUnlock}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer ring-1 ring-white/30"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isArabic ? 'فتح سطح المكتب' : 'Enter Windows 11 Desktop'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Shortcuts / Status */}
      <div className="relative z-10 p-3.5 sm:p-6 flex justify-between items-center text-xs text-slate-400 shrink-0 mt-auto">
        <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
          <button
            onClick={onUnlock}
            className="flex items-center space-x-1.5 rtl:space-x-reverse hover:text-white transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] sm:text-xs">{isArabic ? 'مجلد السيرة الذاتية' : 'Direct to CV'}</span>
          </button>
          <a
            href={personalInfo.contact.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 rtl:space-x-reverse hover:text-white transition-colors font-mono text-[11px] sm:text-xs"
          >
            <Github className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">github.com/faouzikemala</span>
            <span className="sm:hidden">GitHub</span>
          </a>
        </div>

        <div className="text-right rtl:text-left font-mono text-[10px] sm:text-[11px] text-slate-500">
          Windows 11 Pro
        </div>
      </div>
    </div>
  );
};
