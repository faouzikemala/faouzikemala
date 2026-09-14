import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  BatteryMedium,
  Monitor,
  Globe,
  Briefcase,
  GraduationCap,
  Folder,
  FileText,
  Terminal,
  Mail,
  Music,
  Code2,
  ExternalLink,
  ChevronRight,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Sparkles,
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  ListMusic,
  Copy,
  Check,
  Send,
  Download,
  Share2,
  Search
} from 'lucide-react';
import { personalInfo, personalInfoData } from '../../data/personalInfo';
import { FileExplorer } from '../Windows11/FileExplorer';
import { PdfViewerWindow } from '../Windows11/PdfViewerWindow';
import { TerminalWindow } from '../Windows11/TerminalWindow';
import { MailWindow } from '../Windows11/MailWindow';
import { NotepadWindow } from '../Windows11/NotepadWindow';
import {
  IDEA_SIMILAR_TRACKS,
  NOTE_FREQUENCIES,
  SongTrack,
  playSynthesizedNote
} from '../../data/ideaPianoTracks';

interface PhoneAppLayoutProps {
  currentLang: 'en' | 'ar';
  onToggleLang: () => void;
  onSwitchToDesktop: () => void;
  onLockScreen?: () => void;
}

type MobileTab = 'home' | 'cv' | 'resume' | 'piano' | 'terminal' | 'contact' | 'notepad';

export const PhoneAppLayout: React.FC<PhoneAppLayoutProps> = ({
  currentLang,
  onToggleLang,
  onSwitchToDesktop
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [currentTime, setCurrentTime] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mobileTrackIdx, setMobileTrackIdx] = useState(0);
  const [mobilePulse, setMobilePulse] = useState(0);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Audio refs & scheduling
  const mobileAudioCtxRef = useRef<AudioContext | null>(null);
  const mobileMasterGainRef = useRef<GainNode | null>(null);
  const mobileTimeoutsRef = useRef<number[]>([]);
  const mobileLoopIntervalRef = useRef<number | null>(null);

  // Touch piano state
  const [pianoOctave, setPianoOctave] = useState(4);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [isSustain, setIsSustain] = useState(true);

  const isArabic = currentLang === 'ar';
  const currentMobileTrack = IDEA_SIMILAR_TRACKS[mobileTrackIdx];

  // Live mobile status bar clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const getMobileAudioContext = (): AudioContext => {
    if (!mobileAudioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.connect(ctx.destination);
      mobileAudioCtxRef.current = ctx;
      mobileMasterGainRef.current = gain;
    }
    if (mobileAudioCtxRef.current.state === 'suspended') {
      mobileAudioCtxRef.current.resume();
    }
    return mobileAudioCtxRef.current;
  };

  const clearMobileSchedules = () => {
    mobileTimeoutsRef.current.forEach(t => clearTimeout(t));
    mobileTimeoutsRef.current = [];
    if (mobileLoopIntervalRef.current) {
      clearInterval(mobileLoopIntervalRef.current);
      mobileLoopIntervalRef.current = null;
    }
  };

  const playMobileInstrumentVoice = (
    noteName: string,
    duration: number,
    instrument: 'lead' | 'synth' | 'pluck' | 'strings' | 'pad' | 'bass' = 'lead'
  ) => {
    try {
      const ctx = getMobileAudioContext();
      const master = mobileMasterGainRef.current;
      if (!ctx || !master) return;
      const freq = NOTE_FREQUENCIES[noteName];
      if (!freq) return;
      playSynthesizedNote(ctx, master, freq, duration, instrument);
      setMobilePulse(p => (p + 1) % 100);
    } catch {
      // Audio fallback
    }
  };

  const scheduleMobileTrackLoop = (track: SongTrack) => {
    clearMobileSchedules();
    const scheduleOnce = () => {
      track.events.forEach(ev => {
        const timeoutId = window.setTimeout(() => {
          ev.notes.forEach(note => {
            playMobileInstrumentVoice(note, ev.duration, ev.instrument || 'lead');
          });
        }, ev.time * 1000);
        mobileTimeoutsRef.current.push(timeoutId);
      });
    };
    scheduleOnce();
    const intervalId = window.setInterval(scheduleOnce, track.loopLength * 1000);
    mobileLoopIntervalRef.current = intervalId;
  };

  const toggleMobileAudio = () => {
    if (isAudioPlaying) {
      clearMobileSchedules();
      setIsAudioPlaying(false);
    } else {
      getMobileAudioContext();
      scheduleMobileTrackLoop(currentMobileTrack);
      setIsAudioPlaying(true);
    }
  };

  const selectMobileTrack = (idx: number) => {
    setMobileTrackIdx(idx);
    const track = IDEA_SIMILAR_TRACKS[idx];
    if (isAudioPlaying) {
      clearMobileSchedules();
      getMobileAudioContext();
      scheduleMobileTrackLoop(track);
    }
  };

  const handleMobileNext = () => {
    const nextIdx = (mobileTrackIdx + 1) % IDEA_SIMILAR_TRACKS.length;
    selectMobileTrack(nextIdx);
  };

  const handleMobilePrev = () => {
    const prevIdx = (mobileTrackIdx - 1 + IDEA_SIMILAR_TRACKS.length) % IDEA_SIMILAR_TRACKS.length;
    selectMobileTrack(prevIdx);
  };

  useEffect(() => {
    return () => clearMobileSchedules();
  }, []);

  // Simple touch piano audio synthesizer with persistent single context
  const playMobilePianoNote = (noteName: string) => {
    try {
      const ctx = getMobileAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const noteFreqs: Record<string, number> = {
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
        'C6': 1046.50
      };

      const freq = noteFreqs[noteName] || 440;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isSustain ? 1.8 : 0.8));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (isSustain ? 1.8 : 0.8));

      setActiveNotes(prev => [...prev, noteName]);
      setTimeout(() => {
        setActiveNotes(prev => prev.filter(n => n !== noteName));
      }, 300);
    } catch {
      // audio error handling
    }
  };

  const currentOctaveWhiteNotes = [
    { note: `C${pianoOctave}`, label: 'C' },
    { note: `D${pianoOctave}`, label: 'D' },
    { note: `E${pianoOctave}`, label: 'E' },
    { note: `F${pianoOctave}`, label: 'F' },
    { note: `G${pianoOctave}`, label: 'G' },
    { note: `A${pianoOctave}`, label: 'A' },
    { note: `B${pianoOctave}`, label: 'B' },
    { note: `C${pianoOctave + 1}`, label: 'C+' }
  ];

  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col bg-[#050811] text-slate-100 select-none overflow-hidden ${
        isArabic ? 'font-[\'Cairo\',\'Tajawal\',sans-serif]' : 'font-[\'Plus_Jakarta_Sans\',\'Space_Grotesk\',sans-serif]'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. Mobile System Status Bar */}
      <header className="shrink-0 h-11 px-4 flex items-center justify-between bg-black/60 backdrop-blur-xl border-b border-white/10 z-40 text-xs">
        <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono font-medium text-slate-300">
          <span>{currentTime || '12:00'}</span>
          <span className="text-[10px] text-amber-400/80 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            5G
          </span>
        </div>

        {/* Controls: Switch to Desktop & Language */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span>{isArabic ? 'EN' : 'عربي'}</span>
          </button>

          <button
            onClick={onSwitchToDesktop}
            className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 border border-blue-400/30 text-blue-200 text-[11px] font-medium transition-all shadow-sm cursor-pointer"
            title="Switch to Windows 11 Desktop Mode"
          >
            <Monitor className="w-3 h-3 text-blue-300" />
            <span className="hidden xs:inline">{isArabic ? 'كمبيوتر' : 'Desktop OS'}</span>
          </button>

          <div className="flex items-center space-x-1 text-slate-400 text-xs pl-1 rtl:pr-1">
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto overscroll-contain pb-24 px-3 pt-3">
        <AnimatePresence mode="wait">
          {/* TAB 1: HOME (Phone App Springboard) */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Profile Card */}
              <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br from-slate-900/95 via-black/90 to-purple-950/40 border border-white/15 shadow-xl">
                <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-bold text-lg text-amber-300">
                        FK
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h1 className="text-base font-bold text-white truncate">
                        {isArabic ? personalInfo.nameArabic : personalInfo.name}
                      </h1>
                    </div>
                    <p className="text-xs text-amber-400/90 font-medium truncate mt-0.5">
                      {isArabic ? personalInfo.titleArabic : personalInfo.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                        {isArabic ? 'متاح للعمل فورا (CDI)' : 'Seeking Employment (CDI)'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {isArabic ? 'تونس • مستعد للعمل عن بعد' : 'Tunisia • Open to Remote'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Profile Actions */}
                <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-white/10 text-center">
                  <a
                    href={`tel:${personalInfo.contact.phone.replace(/\s+/g, '')}`}
                    className="flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{isArabic ? 'اتصال' : 'Call'}</span>
                  </a>
                  <a
                    href={`mailto:${personalInfo.contact.email}`}
                    className="flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>{isArabic ? 'بريد' : 'Email'}</span>
                  </a>
                  <a
                    href={personalInfo.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-sky-400" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={personalInfo.contact.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] transition-colors"
                  >
                    <Github className="w-4 h-4 text-purple-400" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              {/* Mobile App Grid (Springboard) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isArabic ? 'التطبيقات والملفات' : 'Apps & Portfolio'}
                  </h2>
                  <span className="text-[11px] text-amber-400 font-medium">6 {isArabic ? 'تطبيقات' : 'Apps'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* App 1: Career & Files */}
                  <button
                    onClick={() => setActiveTab('cv')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 text-center transition-all active:scale-95 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-1.5 group-hover:scale-105 transition-transform">
                      <Folder className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {isArabic ? 'المسيرة والخبرات' : 'Career & CV'}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full">
                      {isArabic ? 'المشاريع والشهادات' : 'Projects & Edu'}
                    </span>
                  </button>

                  {/* App 2: PDF Resume */}
                  <button
                    onClick={() => setActiveTab('resume')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 text-center transition-all active:scale-95 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-400 mb-1.5 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {isArabic ? 'السيرة الذاتية PDF' : 'PDF Resume'}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full">
                      {isArabic ? 'عرض وتحميل' : 'View & Print'}
                    </span>
                  </button>

                  {/* App 3: Virtual Piano Studio */}
                  <button
                    onClick={() => setActiveTab('piano')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 text-center transition-all active:scale-95 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-1.5 group-hover:scale-105 transition-transform">
                      <Music className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {isArabic ? 'استوديو البيانو' : 'Piano Studio'}
                    </span>
                    <span className="text-[9px] text-purple-300 truncate w-full">
                      Idea 10 • Touch
                    </span>
                  </button>

                  {/* App 4: Terminal */}
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 text-center transition-all active:scale-95 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-1.5 group-hover:scale-105 transition-transform">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {isArabic ? 'الطرفية CLI' : 'Terminal CLI'}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full">
                      PowerShell
                    </span>
                  </button>

                  {/* App 5: Contact Mail */}
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 text-center transition-all active:scale-95 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-1.5 group-hover:scale-105 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {isArabic ? 'اتصل بي' : 'Contact Mail'}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full">
                      {isArabic ? 'رسالة سريعة' : 'Direct Message'}
                    </span>
                  </button>

                  {/* App 6: Notepad / Bio */}
                  <button
                    onClick={() => setActiveTab('notepad')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 text-center transition-all active:scale-95 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-1.5 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {isArabic ? 'ملاحظات وسيرة' : 'About Bio'}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full">
                      {isArabic ? 'نبذة تعريفية' : 'Personal Notes'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Key Highlights Card */}
              <div className="rounded-2xl p-4 bg-black/60 border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isArabic ? 'أبرز المهارات والمشاريع' : 'Key Skills & Technologies'}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {['PHP & Symfony', 'Unity 3D / VR', 'Meta Quest 3', 'C#', 'MySQL & SQLite', 'HTML5 / CSS / JS', 'Android Studio / Kotlin', 'Git'].map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-200 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {isArabic ? 'الدرجة العلمية:' : 'Degree:'}
                  </span>
                  <span className="font-semibold text-slate-200 text-right">
                    Licence en Sciences de l'Informatique (ISIMG)
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: CV & CAREER */}
          {activeTab === 'cv' && (
            <motion.div
              key="cv"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isArabic ? 'الرئيسية' : 'Back to Apps'}</span>
                </button>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isArabic ? 'ملف الخبرات والمشاريع' : 'Career & Experience'}
                </h2>
              </div>

              {/* Work Experiences */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {isArabic ? 'الخبرات المهنية' : 'Work Experience'}
                </h3>
                {personalInfoData.experiences.map(exp => (
                  <div key={exp.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{exp.role}</h4>
                        <p className="text-[11px] text-amber-400 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(exp.tech || []).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {isArabic ? 'التعليم والتكوين الأكاديمي' : 'Education'}
                </h3>
                {personalInfoData.education.map(edu => (
                  <div key={edu.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-white">{edu.degree}</h4>
                      <span className="text-[10px] text-amber-400 font-mono">{edu.year}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{edu.institution}</p>
                    {edu.details && (
                      <p className="text-[11px] text-slate-300 leading-relaxed pt-1">{edu.details}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Featured Projects */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  {isArabic ? 'المشاريع البارزة' : 'Projects'}
                </h3>
                {personalInfoData.projects.map(proj => (
                  <div key={proj.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                      <span className="text-[10px] text-slate-400">{proj.period}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: RESUME PDF */}
          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isArabic ? 'الرئيسية' : 'Back'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'طباعة / حفظ' : 'Print / Save'}</span>
                  </button>
                </div>
              </div>

              {/* PDF Viewer Embed Container */}
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-white/15 p-2 shadow-2xl">
                <PdfViewerWindow isArabic={isArabic} />
              </div>
            </motion.div>
          )}

          {/* TAB 4: PIANO STUDIO (TOUCH-OPTIMIZED & PERSISTENT) */}
          <div
            key="piano"
            className={activeTab === 'piano' ? 'space-y-3 block' : 'hidden'}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{isArabic ? 'الرئيسية' : 'Back'}</span>
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-300">🎹 Idea 10 Touch Piano</span>
              </div>
            </div>

            {/* Pure Neo-Classical Audio Player (Idea 10 & Similar Tracks) */}
            <div className="rounded-2xl overflow-hidden bg-slate-900/95 border border-white/15 shadow-xl p-3 space-y-3">
              {/* Track Title Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/30 to-purple-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-sm">
                    <Disc3
                      className={`w-5 h-5 ${isAudioPlaying ? 'animate-spin' : ''}`}
                      style={{ animationDuration: '5s' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {isArabic ? currentMobileTrack.titleArabic : currentMobileTrack.title}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-amber-400 font-mono truncate">
                        {currentMobileTrack.composer}
                      </p>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">
                        {currentMobileTrack.genre}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Soundwave Visualizer */}
                <div className="flex items-end space-x-1 rtl:space-x-reverse h-5 shrink-0 px-1">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <span
                      key={bar}
                      className={`w-1 rounded-full bg-amber-400 transition-all duration-300 ${
                        isAudioPlaying ? 'animate-pulse' : 'h-1 opacity-40'
                      }`}
                      style={{
                        height: isAudioPlaying ? `${Math.max(4, ((mobilePulse + bar * 5) % 16) + 4)}px` : '4px',
                        animationDelay: `${bar * 120}ms`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed bg-black/30 p-2 rounded-xl border border-white/5">
                {isArabic ? currentMobileTrack.descriptionArabic : currentMobileTrack.description}
              </p>

              {/* Track Selector Carousel / Pills */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                  {isArabic ? 'المقطوعات الرهيبة الموصى بها:' : 'Recommended Cool Tracks:'}
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {IDEA_SIMILAR_TRACKS.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => selectMobileTrack(idx)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        mobileTrackIdx === idx
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {isArabic ? t.titleArabic.split('(')[0] : t.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4 pt-1 border-t border-white/10">
                <button
                  onClick={handleMobilePrev}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleMobileAudio}
                  className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
                  title={isAudioPlaying ? 'Pause' : 'Play'}
                >
                  {isAudioPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleMobileNext}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Touch Keyboard Controls */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">{isArabic ? 'الأوكتاف:' : 'Octave:'}</span>
                  <button
                    onClick={() => setPianoOctave(o => Math.max(3, o - 1))}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-amber-400 px-1 font-bold">{pianoOctave}</span>
                  <button
                    onClick={() => setPianoOctave(o => Math.min(5, o + 1))}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => setIsSustain(!isSustain)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    isSustain
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {isSustain ? 'Sustain ON' : 'Sustain OFF'}
                </button>
              </div>

              {/* Touch Keyboard */}
              <div className="relative flex justify-center gap-1 h-36 select-none touch-manipulation pt-1">
                {currentOctaveWhiteNotes.map(({ note, label }) => {
                  const isPressed = activeNotes.includes(note);
                  return (
                    <button
                      key={note}
                      onClick={() => playMobilePianoNote(note)}
                      className={`flex-1 rounded-b-xl flex flex-col justify-end items-center pb-2 transition-all cursor-pointer shadow-md ${
                        isPressed
                          ? 'bg-amber-300 text-slate-950 scale-95 shadow-inner'
                          : 'bg-gradient-to-b from-white to-slate-200 text-slate-900 hover:bg-slate-100 active:bg-amber-200'
                      }`}
                    >
                      <span className="text-xs font-bold pointer-events-none">{label}</span>
                      <span className="text-[9px] text-slate-500 pointer-events-none">{note}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                {isArabic
                  ? 'المس المفاتيح للعزف التفاعلي مع الأغنية (شغالة بدون توقف في الخلفية)'
                  : 'Touch piano keys above to play along with the track (keeps playing in background)'}
              </p>
            </div>
          </div>

          {/* TAB 5: TERMINAL */}
          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isArabic ? 'الرئيسية' : 'Back'}</span>
                </button>
                <span className="text-xs font-mono text-emerald-400">PowerShell CLI</span>
              </div>
              <div className="h-[460px] rounded-2xl overflow-hidden border border-white/15 bg-black/90 shadow-2xl">
                <TerminalWindow isArabic={isArabic} />
              </div>
            </motion.div>
          )}

          {/* TAB 6: CONTACT */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isArabic ? 'الرئيسية' : 'Back'}</span>
                </button>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isArabic ? 'معلومات الاتصال' : 'Get in Touch'}
                </h2>
              </div>

              {/* Direct Touch Contact Cards */}
              <div className="space-y-2.5">
                {/* Email */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-medium">{isArabic ? 'البريد الإلكتروني' : 'Email'}</p>
                      <p className="text-xs font-bold text-white select-all">{personalInfo.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(personalInfo.contact.email, 'email')}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
                      title="Copy Email"
                    >
                      {copiedContact === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`mailto:${personalInfo.contact.email}`}
                      className="p-2 rounded-lg bg-blue-500 text-slate-950 font-bold"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-medium">{isArabic ? 'الهاتف' : 'Phone'}</p>
                      <p className="text-xs font-bold text-white select-all">{personalInfo.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(personalInfo.contact.phone, 'phone')}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
                      title="Copy Phone"
                    >
                      {copiedContact === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`tel:${personalInfo.contact.phone.replace(/\s+/g, '')}`}
                      className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">{isArabic ? 'الموقع' : 'Location'}</p>
                    <p className="text-xs font-bold text-white">
                      {isArabic ? personalInfo.locationArabic : personalInfo.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: NOTEPAD / BIO */}
          {activeTab === 'notepad' && (
            <motion.div
              key="notepad"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isArabic ? 'الرئيسية' : 'Back'}</span>
                </button>
                <span className="text-xs font-bold text-white">{isArabic ? 'السيرة الذاتية' : 'Bio & Notes'}</span>
              </div>
              <div className="h-[460px] rounded-2xl overflow-hidden border border-white/15 bg-slate-950/90 shadow-2xl">
                <NotepadWindow isArabic={isArabic} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Persistent Mobile Now-Playing Mini Bar */}
      {activeTab !== 'piano' && (
        <div className="fixed bottom-16 inset-x-3 z-30">
          <div
            onClick={() => setActiveTab('piano')}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-amber-400/30 shadow-2xl cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/30 to-purple-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Disc3 className={`w-4 h-4 ${isAudioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '5s' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">
                  {isArabic ? currentMobileTrack.titleArabic : currentMobileTrack.title}
                </p>
                <p className="text-[9px] text-amber-400/90 truncate">
                  {currentMobileTrack.composer}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMobileAudio();
                }}
                className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer transition-transform active:scale-90"
                title={isAudioPlaying ? 'Pause' : 'Play'}
              >
                {isAudioPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('piano');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] text-amber-300 font-semibold cursor-pointer"
              >
                {isArabic ? 'عرض' : 'View'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Native Mobile Bottom Navigation Dock */}
      <nav className="shrink-0 h-16 px-4 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 fixed bottom-0 inset-x-0 z-40 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'home' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-amber-400/15' : ''}`}>
            <Monitor className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">{isArabic ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button
          onClick={() => setActiveTab('cv')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'cv' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'cv' ? 'bg-amber-400/15' : ''}`}>
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">{isArabic ? 'الخبرات' : 'Career'}</span>
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'resume' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'resume' ? 'bg-amber-400/15' : ''}`}>
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">{isArabic ? 'السيرة' : 'Resume'}</span>
        </button>

        <button
          onClick={() => setActiveTab('piano')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'piano' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'piano' ? 'bg-amber-400/15' : ''}`}>
            <Music className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">{isArabic ? 'البيانو' : 'Piano'}</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            activeTab === 'contact' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'contact' ? 'bg-amber-400/15' : ''}`}>
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">{isArabic ? 'اتصال' : 'Contact'}</span>
        </button>
      </nav>
    </div>
  );
};
