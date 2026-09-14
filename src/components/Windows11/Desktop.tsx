import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Folder,
  FileText,
  Terminal as TerminalIcon,
  Mail,
  Github,
  Trash2,
  Lock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
  FileBadge,
  Globe,
  Music,
  GripHorizontal,
  Smartphone
} from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { GalaxyWallpaper } from '../GalaxyWallpaper';
import { CalmPianoWidget } from './CalmPianoWidget';
import { VirtualPianoWindow } from './VirtualPianoWindow';
import { WindowWrapper } from './WindowWrapper';
import { FileExplorer } from './FileExplorer';
import { PdfViewerWindow } from './PdfViewerWindow';
import { NotepadWindow } from './NotepadWindow';
import { TerminalWindow } from './TerminalWindow';
import { MailWindow } from './MailWindow';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';

interface DesktopProps {
  onLockScreen: () => void;
  currentLang: 'en' | 'ar';
  onToggleLang: () => void;
  onSwitchToPhone?: () => void;
}

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export const Desktop: React.FC<DesktopProps> = ({
  onLockScreen,
  currentLang,
  onToggleLang,
  onSwitchToPhone
}) => {
  // Start Menu state
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });

  // Selected desktop icon
  const [selectedIconId, setSelectedIconId] = useState<string | null>('cv_folder');

  // Highest z-index tracking (starting at 30 so open/maximized windows sit cleanly above desktop background widgets)
  const [topZIndex, setTopZIndex] = useState(30);

  // Windows State - open CV Folder by default for immediate creative display!
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    explorer: { isOpen: true, isMinimized: false, zIndex: 30 },
    pdf: { isOpen: false, isMinimized: false, zIndex: 29 },
    notepad: { isOpen: false, isMinimized: false, zIndex: 28 },
    terminal: { isOpen: false, isMinimized: false, zIndex: 27 },
    mail: { isOpen: false, isMinimized: false, zIndex: 26 },
    piano: { isOpen: false, isMinimized: false, zIndex: 25 }
  });

  // Track which windows are maximized
  const [maximizedWindows, setMaximizedWindows] = useState<Record<string, boolean>>({});

  const isAnyWindowMaximized = useMemo(() => {
    return Object.entries(maximizedWindows).some(([id, isMax]) => {
      const win = windows[id];
      return isMax && win?.isOpen && !win?.isMinimized;
    });
  }, [maximizedWindows, windows]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>('explorer');

  // Custom text or file for Notepad
  const [notepadData, setNotepadData] = useState<{ text?: string; title?: string }>({});

  const bringToFront = (id: string) => {
    setTopZIndex(z => z + 1);
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: topZIndex + 1
      }
    }));
    setActiveWindowId(id);
  };

  const openApp = (id: string) => {
    bringToFront(id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
    setMaximizedWindows(prev => ({
      ...prev,
      [id]: false
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleWindowFromTaskbar = (id: string) => {
    const w = windows[id];
    if (!w || !w.isOpen) {
      bringToFront(id);
    } else if (w.isMinimized) {
      bringToFront(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  const handleShowDesktop = () => {
    const anyOpen = (Object.values(windows) as WindowState[]).some(w => w.isOpen && !w.isMinimized);
    setWindows(prev => {
      const updated: Record<string, WindowState> = {};
      Object.keys(prev).forEach(key => {
        updated[key] = {
          ...prev[key],
          isMinimized: anyOpen ? true : false
        };
      });
      return updated;
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.min(e.clientY, window.innerHeight - 200),
      visible: true
    });
  };

  const closeContextMenu = () => {
    if (contextMenu.visible) {
      setContextMenu(prev => ({ ...prev, visible: false }));
    }
  };

  const isArabic = currentLang === 'ar';

  const desktopIcons = [
    {
      id: 'cv_folder',
      title: isArabic ? "مجلد السيرة الذاتية" : "Faouzi's CV & Career",
      badge: 'Main Folder',
      icon: <Folder className="w-11 h-11 text-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]" />,
      action: () => openApp('explorer')
    },
    {
      id: 'pdf_cv',
      title: isArabic ? 'السيرة_الذاتية.pdf' : 'Resume_Official.pdf',
      badge: 'PDF Reader',
      icon: (
        <div className="w-11 h-11 rounded-lg bg-red-600/90 border border-red-400 flex flex-col items-center justify-center text-white shadow-lg drop-shadow-md">
          <span className="text-[10px] font-black tracking-widest">PDF</span>
          <FileBadge className="w-4 h-4 mt-0.5 opacity-90" />
        </div>
      ),
      action: () => openApp('pdf')
    },
    {
      id: 'about_txt',
      title: isArabic ? 'نبذة_عني.txt' : 'About_Faouzi.txt',
      badge: 'Notepad',
      icon: <FileText className="w-11 h-11 text-blue-400 drop-shadow-md" />,
      action: () => openApp('notepad')
    },
    {
      id: 'powershell',
      title: 'PowerShell Terminal',
      badge: 'Command Line',
      icon: (
        <div className="w-11 h-11 rounded-lg bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
          <TerminalIcon className="w-6 h-6" />
        </div>
      ),
      action: () => openApp('terminal')
    },
    {
      id: 'mail_app',
      title: isArabic ? 'الاتصال والمراسلة' : 'Contact & Inquiries',
      badge: 'Windows Mail',
      icon: <Mail className="w-11 h-11 text-pink-400 drop-shadow-md" />,
      action: () => openApp('mail')
    },
    {
      id: 'github_link',
      title: 'GitHub (faouzikemala)',
      badge: 'External Web',
      icon: (
        <div className="w-11 h-11 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-white shadow-lg">
          <Github className="w-6 h-6" />
        </div>
      ),
      action: () => window.open(personalInfo.contact.githubUrl, '_blank')
    },
    {
      id: 'piano_app',
      title: isArabic ? 'استوديو البيانو' : 'Virtual Piano',
      badge: 'Interactive App',
      icon: (
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/30 to-amber-700/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xl group-hover:scale-105 transition-transform">
          <Music className="w-6 h-6" />
        </div>
      ),
      action: () => openApp('piano')
    },
    {
      id: 'recycle_bin',
      title: isArabic ? 'سلة المحذوفات' : 'Recycle Bin',
      badge: 'Empty',
      icon: <Trash2 className="w-11 h-11 text-slate-400/80 drop-shadow" />,
      action: () => {
        setNotepadData({
          title: 'Recycle_Bin_Log.txt',
          text: isArabic
            ? 'سلة المحذوفات فارغة. جميع المشاريع والشيفرات محفوظة ومنظمة على جيت هاب!'
            : 'Recycle bin is empty. All projects and code are maintained in version control on GitHub!'
        });
        openApp('notepad');
      }
    }
  ];

  return (
    <div
      id="windows11-desktop"
      onContextMenu={handleContextMenu}
      onClick={() => {
        closeContextMenu();
        setSelectedIconId(null);
      }}
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none bg-[#020307] text-slate-100 ${
        isArabic ? 'font-[\'Cairo\',\'Tajawal\',sans-serif]' : 'font-[\'Plus_Jakarta_Sans\',\'Space_Grotesk\',sans-serif]'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. Live 3D Milky Way Wallpaper with Central Radiant Sun (interactive with mouse & wheel zoom) */}
      <GalaxyWallpaper className="z-0" />

      {/* Subtle monochrome dark overlay for clear desktop readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none z-0" />

      {/* 2. Discreet, Movable Center-Top Status Pill */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.06}
        whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-grab active:cursor-grabbing flex items-center space-x-2.5 rtl:space-x-reverse bg-black/55 hover:bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-slate-300 shadow-xl transition-all select-none"
        title={isArabic ? 'اسحب لتحريك هذا الشريط' : 'Click and drag to reposition'}
      >
        <GripHorizontal className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 -mr-1 rtl:-ml-1" />
        <span className="font-semibold text-slate-200 tracking-wide">
          {isArabic ? personalInfo.nameArabic : personalInfo.name}
        </span>
        <span className="text-slate-600 select-none">•</span>
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isArabic ? 'أبحث عن عمل (CDI)' : 'Seeking Employment (CDI)'}
        </span>
        <span className="text-slate-600 select-none">•</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLang();
          }}
          className="flex items-center space-x-1 rtl:space-x-reverse text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="font-medium">{isArabic ? 'EN' : 'عربي'}</span>
        </button>
        {onSwitchToPhone && (
          <>
            <span className="text-slate-600 select-none">•</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToPhone();
              }}
              className="flex items-center space-x-1 rtl:space-x-reverse text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              title={isArabic ? 'التبديل إلى واجهة تطبيق الهاتف الذكي' : 'Switch to Smartphone App UI'}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{isArabic ? 'هاتف' : 'Phone'}</span>
            </button>
          </>
        )}
      </motion.div>

      {/* 3. Calm Piano Side Widget on Desktop */}
      <CalmPianoWidget
        isArabic={isArabic}
        onOpenPianoApp={() => openApp('piano')}
        isAnyWindowMaximized={isAnyWindowMaximized}
      />

      {/* 4. Desktop Grid Icons */}
      <div className="relative z-10 p-4 grid grid-flow-col grid-rows-6 gap-3 w-fit h-[calc(100vh-60px)]">
        {desktopIcons.map((item) => {
          const isSelected = selectedIconId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIconId(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className={`flex flex-col items-center justify-center w-24 h-24 p-2 rounded-xl transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-white/20 border border-white/40 shadow-lg'
                  : 'hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="transform group-hover:scale-105 transition-transform flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[11px] font-medium text-slate-200 text-center mt-1.5 leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. Active Windows */}
      {/* CV Folder File Explorer Window */}
      <WindowWrapper
        id="explorer"
        title="📁 File Explorer — This PC > Documents > Faouzi_Kemala_CV"
        isOpen={windows.explorer.isOpen}
        isMinimized={windows.explorer.isMinimized}
        zIndex={windows.explorer.zIndex}
        initialWidth={940}
        initialHeight={620}
        initialX={Math.max(20, (window.innerWidth - 940) / 2)}
        initialY={Math.max(20, (window.innerHeight - 660) / 2)}
        onFocus={() => bringToFront('explorer')}
        onClose={() => closeWindow('explorer')}
        onMinimize={() => minimizeWindow('explorer')}
        onMaximizeChange={(isMax) => setMaximizedWindows(prev => ({ ...prev, explorer: isMax }))}
      >
        <FileExplorer
          isArabic={isArabic}
          onOpenPdf={() => openApp('pdf')}
          onOpenNotepad={(text, title) => {
            setNotepadData({ text, title });
            openApp('notepad');
          }}
          onOpenMail={() => openApp('mail')}
        />
      </WindowWrapper>

      {/* PDF Viewer Window */}
      <WindowWrapper
        id="pdf"
        title="📄 Adobe / Windows Reader — Faouzi_Kemala_Curriculum_Vitae.pdf"
        isOpen={windows.pdf.isOpen}
        isMinimized={windows.pdf.isMinimized}
        zIndex={windows.pdf.zIndex}
        initialWidth={880}
        initialHeight={640}
        onFocus={() => bringToFront('pdf')}
        onClose={() => closeWindow('pdf')}
        onMinimize={() => minimizeWindow('pdf')}
        onMaximizeChange={(isMax) => setMaximizedWindows(prev => ({ ...prev, pdf: isMax }))}
      >
        <PdfViewerWindow isArabic={isArabic} />
      </WindowWrapper>

      {/* Notepad Window */}
      <WindowWrapper
        id="notepad"
        title={`📝 Notepad — ${notepadData.title || 'About_Faouzi_Kemala.txt'}`}
        isOpen={windows.notepad.isOpen}
        isMinimized={windows.notepad.isMinimized}
        zIndex={windows.notepad.zIndex}
        initialWidth={680}
        initialHeight={500}
        onFocus={() => bringToFront('notepad')}
        onClose={() => closeWindow('notepad')}
        onMinimize={() => minimizeWindow('notepad')}
        onMaximizeChange={(isMax) => setMaximizedWindows(prev => ({ ...prev, notepad: isMax }))}
      >
        <NotepadWindow
          initialText={notepadData.text}
          initialFileName={notepadData.title || 'About_Faouzi_Kemala.txt'}
        />
      </WindowWrapper>

      {/* Terminal Window */}
      <WindowWrapper
        id="terminal"
        title="💻 Windows PowerShell — C:\Users\Faouzi"
        isOpen={windows.terminal.isOpen}
        isMinimized={windows.terminal.isMinimized}
        zIndex={windows.terminal.zIndex}
        initialWidth={740}
        initialHeight={460}
        onFocus={() => bringToFront('terminal')}
        onClose={() => closeWindow('terminal')}
        onMinimize={() => minimizeWindow('terminal')}
        onMaximizeChange={(isMax) => setMaximizedWindows(prev => ({ ...prev, terminal: isMax }))}
      >
        <TerminalWindow />
      </WindowWrapper>

      {/* Mail Window */}
      <WindowWrapper
        id="mail"
        title="✉️ Windows Mail — faouzikemala205@gmail.com"
        isOpen={windows.mail.isOpen}
        isMinimized={windows.mail.isMinimized}
        zIndex={windows.mail.zIndex}
        initialWidth={660}
        initialHeight={520}
        onFocus={() => bringToFront('mail')}
        onClose={() => closeWindow('mail')}
        onMinimize={() => minimizeWindow('mail')}
        onMaximizeChange={(isMax) => setMaximizedWindows(prev => ({ ...prev, mail: isMax }))}
      >
        <MailWindow />
      </WindowWrapper>

      {/* Virtual Piano Studio Window */}
      <WindowWrapper
        id="piano"
        title="🎹 Virtual Piano Studio — Grand Polyphonic Keyboard"
        isOpen={windows.piano.isOpen}
        isMinimized={windows.piano.isMinimized}
        zIndex={windows.piano.zIndex}
        initialWidth={880}
        initialHeight={500}
        onFocus={() => bringToFront('piano')}
        onClose={() => closeWindow('piano')}
        onMinimize={() => minimizeWindow('piano')}
        onMaximizeChange={(isMax) => setMaximizedWindows(prev => ({ ...prev, piano: isMax }))}
      >
        <VirtualPianoWindow />
      </WindowWrapper>

      {/* 5. Desktop Right-Click Context Menu */}
      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-1.5 text-xs text-slate-200 select-none font-sans animate-in fade-in duration-100"
        >
          <button
            onClick={() => {
              openApp('explorer');
              closeContextMenu();
            }}
            className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-white/10 text-left rtl:text-right text-cyan-300 font-medium"
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>{isArabic ? 'فتح مجلد السيرة الذاتية' : 'Open CV Folder'}</span>
          </button>
          <button
            onClick={() => {
              openApp('piano');
              closeContextMenu();
            }}
            className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-white/10 text-left rtl:text-right text-amber-300 font-medium"
          >
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>{isArabic ? 'فتح استوديو البيانو' : 'Open Virtual Piano'}</span>
          </button>
          <button
            onClick={() => {
              openApp('pdf');
              closeContextMenu();
            }}
            className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-white/10 text-left rtl:text-right"
          >
            <FileBadge className="w-3.5 h-3.5 text-red-400" />
            <span>{isArabic ? 'فتح السيرة الذاتية (PDF)' : 'Open PDF Resume'}</span>
          </button>
          <button
            onClick={() => {
              openApp('terminal');
              closeContextMenu();
            }}
            className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-white/10 text-left rtl:text-right"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'فتح موجه الأوامر (Terminal)' : 'Open in Terminal'}</span>
          </button>
          <div className="h-[1px] bg-white/10 my-1" />
          <button
            onClick={() => {
              onToggleLang();
              closeContextMenu();
            }}
            className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-white/10 text-left rtl:text-right text-slate-300"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{isArabic ? 'Switch to English' : 'التحويل إلى العربية'}</span>
          </button>
          <div className="h-[1px] bg-white/10 my-1" />
          <button
            onClick={() => {
              onLockScreen();
              closeContextMenu();
            }}
            className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-white/10 text-left rtl:text-right text-slate-300"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'قفل الشاشة' : 'Lock Screen'}</span>
          </button>
        </div>
      )}

      {/* 6. Windows 11 Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenApp={(id) => openApp(id)}
        onLockScreen={onLockScreen}
        onRestart={() => {
          setWindows({
            explorer: { isOpen: true, isMinimized: false, zIndex: 10 },
            pdf: { isOpen: false, isMinimized: false, zIndex: 9 },
            notepad: { isOpen: false, isMinimized: false, zIndex: 8 },
            terminal: { isOpen: false, isMinimized: false, zIndex: 7 },
            mail: { isOpen: false, isMinimized: false, zIndex: 6 },
            piano: { isOpen: false, isMinimized: false, zIndex: 5 }
          });
        }}
      />

      {/* 7. Windows 11 Taskbar */}
      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
        openWindows={windows}
        activeWindowId={activeWindowId}
        onToggleWindow={toggleWindowFromTaskbar}
        onShowDesktop={handleShowDesktop}
      />
    </div>
  );
};

