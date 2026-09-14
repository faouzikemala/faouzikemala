import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Terminal,
  Mail,
  Github,
  Search,
  Wifi,
  Volume2,
  BatteryCharging,
  Bell,
  Music
} from 'lucide-react';

interface OpenWindowStatus {
  isOpen: boolean;
  isMinimized: boolean;
}

interface TaskbarProps {
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  openWindows: Record<string, OpenWindowStatus>;
  activeWindowId: string | null;
  onToggleWindow: (id: string) => void;
  onShowDesktop: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isStartMenuOpen,
  onToggleStartMenu,
  openWindows,
  activeWindowId,
  onToggleWindow,
  onShowDesktop
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const apps = [
    {
      id: 'explorer',
      title: 'CV Folder (File Explorer)',
      icon: <Folder className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'pdf',
      title: 'Curriculum Vitae (PDF Reader)',
      icon: (
        <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white text-[8px] font-bold">
          PDF
        </div>
      )
    },
    {
      id: 'notepad',
      title: 'Notepad',
      icon: <FileText className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'terminal',
      title: 'Windows PowerShell',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'mail',
      title: 'Windows Mail',
      icon: <Mail className="w-5 h-5 text-pink-400" />
    },
    {
      id: 'piano',
      title: 'Virtual Piano Studio',
      icon: (
        <div className="w-5 h-5 rounded bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-300">
          <Music className="w-3.5 h-3.5" />
        </div>
      )
    }
  ];

  return (
    <div
      id="windows11-taskbar"
      className="fixed bottom-0 left-0 right-0 h-12 z-40 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-3 select-none font-sans text-xs text-slate-100"
    >
      {/* Left Tray: Weather / Status widget */}
      <div className="flex items-center space-x-2 text-slate-400 text-xs w-44">
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-md hover:bg-white/10 cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-300">Space Mode: Online</span>
        </div>
      </div>

      {/* Centered App Dock */}
      <div className="flex items-center space-x-1">
        {/* Windows 11 Start Button */}
        <button
          id="win11-start-button"
          onClick={onToggleStartMenu}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            isStartMenuOpen ? 'bg-white/15 shadow-inner' : 'hover:bg-white/10'
          }`}
          title="Start"
        >
          {/* Windows 11 4-square logo */}
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-cyan-400 rounded-[1px]" />
            <div className="bg-cyan-500 rounded-[1px]" />
            <div className="bg-cyan-500 rounded-[1px]" />
            <div className="bg-cyan-400 rounded-[1px]" />
          </div>
        </button>

        {/* Search button */}
        <button
          onClick={onToggleStartMenu}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        {/* Running / Pinned Apps */}
        {apps.map((app) => {
          const status = openWindows[app.id];
          const isOpen = status?.isOpen;
          const isMinimized = status?.isMinimized;
          const isActive = isOpen && !isMinimized && activeWindowId === app.id;

          return (
            <button
              key={app.id}
              onClick={() => onToggleWindow(app.id)}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-white/15'
                  : isOpen
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'hover:bg-white/10 opacity-80 hover:opacity-100'
              }`}
              title={app.title}
            >
              {app.icon}

              {/* Windows 11 Running App Indicator Pill */}
              {isOpen && (
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all ${
                    isActive
                      ? 'w-4 h-0.5 bg-cyan-400'
                      : 'w-1.5 h-0.5 bg-slate-400'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* GitHub Direct Link on Taskbar */}
        <a
          href="https://github.com/faouzikemala"
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors opacity-80 hover:opacity-100"
          title="GitHub: faouzikemala"
        >
          <Github className="w-4 h-4 text-white" />
        </a>
      </div>

      {/* Right System Tray */}
      <div className="flex items-center space-x-2 text-slate-300">
        <div className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-white/10 cursor-pointer">
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
        </div>

        {/* Clock & Date */}
        <div
          onClick={onShowDesktop}
          className="flex flex-col items-end px-2 py-0.5 rounded-md hover:bg-white/10 cursor-pointer text-[11px] leading-tight"
          title="Click to toggle Show Desktop"
        >
          <span className="font-medium text-slate-200">{timeStr}</span>
          <span className="text-[10px] text-slate-400">{dateStr}</span>
        </div>

        <button
          onClick={onToggleStartMenu}
          className="p-1.5 rounded-md hover:bg-white/10 text-slate-300"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* Show Desktop sliver line on extreme right */}
        <div
          onClick={onShowDesktop}
          className="w-1.5 h-7 border-l border-white/20 hover:bg-white/20 cursor-pointer ml-1"
          title="Show desktop"
        />
      </div>
    </div>
  );
};
