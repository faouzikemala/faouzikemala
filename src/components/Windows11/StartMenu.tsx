import React, { useState } from 'react';
import {
  Search,
  Folder,
  FileText,
  Terminal,
  Mail,
  Github,
  Lock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Power,
  Music
} from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  onLockScreen: () => void;
  onRestart: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onLockScreen,
  onRestart
}) => {
  const [search, setSearch] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  if (!isOpen) return null;

  const pinnedApps = [
    {
      id: 'explorer',
      title: 'CV Folder',
      subtitle: 'Documents & Career',
      icon: <Folder className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'pdf',
      title: 'Official CV (PDF)',
      subtitle: 'Printable Resume',
      icon: (
        <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-[9px] font-bold">
          PDF
        </div>
      )
    },
    {
      id: 'notepad',
      title: 'Notepad',
      subtitle: 'About_Faouzi.txt',
      icon: <FileText className="w-6 h-6 text-blue-400" />
    },
    {
      id: 'terminal',
      title: 'PowerShell',
      subtitle: 'Interactive CLI',
      icon: <Terminal className="w-6 h-6 text-cyan-400" />
    },
    {
      id: 'mail',
      title: 'Windows Mail',
      subtitle: 'Contact Faouzi',
      icon: <Mail className="w-6 h-6 text-pink-400" />
    },
    {
      id: 'piano',
      title: 'Virtual Piano Studio',
      subtitle: 'Interactive Keyboard App',
      icon: (
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
          <Music className="w-4 h-4" />
        </div>
      )
    },
    {
      id: 'github',
      title: 'GitHub Repo',
      subtitle: 'faouzikemala',
      icon: <Github className="w-6 h-6 text-white" />
    }
  ];

  const filteredApps = pinnedApps.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Click outside backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/10"
      />

      <div
        id="windows11-start-menu"
        className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 w-[540px] max-w-[95vw] bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col font-sans select-none animate-in fade-in slide-in-from-bottom-5 duration-150"
      >
        {/* Top Search Input */}
        <div className="p-5 pb-3">
          <div className="flex items-center space-x-2.5 px-3 py-2 bg-slate-950/60 border border-white/10 rounded-full text-xs">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type here to search apps, CV sections, or web..."
              className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-xs"
              autoFocus
            />
          </div>
        </div>

        {/* Pinned Section */}
        <div className="px-6 py-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-300">Pinned</span>
            <button
              onClick={() => onOpenApp('explorer')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center"
            >
              <span>All CV Files</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  if (app.id === 'github') {
                    window.open(personalInfo.contact.githubUrl, '_blank');
                  } else {
                    onOpenApp(app.id);
                  }
                  onClose();
                }}
                className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
              >
                <div className="p-2 rounded-xl bg-slate-800/80 group-hover:scale-105 transition-transform shadow-md">
                  {app.icon}
                </div>
                <div className="text-xs font-medium text-slate-200 mt-2 truncate w-full">
                  {app.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate w-full">
                  {app.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Files Section */}
        <div className="px-6 py-3 border-t border-white/10">
          <div className="text-xs font-semibold text-slate-300 mb-2">Recommended</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenApp('pdf');
                onClose();
              }}
              className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white/5 text-left transition-colors"
            >
              <div className="w-7 h-7 rounded bg-red-600/80 flex items-center justify-center text-white text-[8px] font-bold">
                PDF
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-200 truncate">
                  Faouzi_Kemala_Curriculum_Vitae.pdf
                </div>
                <div className="text-[10px] text-slate-400">Recently updated</div>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenApp('explorer');
                onClose();
              }}
              className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white/5 text-left transition-colors"
            >
              <Folder className="w-7 h-7 text-amber-400 p-1" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-200 truncate">
                  Faouzi_Kemala_CV_Folder
                </div>
                <div className="text-[10px] text-slate-400">Main directory</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Profile & Power Footer */}
        <div className="relative mt-auto px-6 py-3 bg-slate-950/60 border-t border-white/10 flex items-center justify-between">
          <div
            onClick={() => {
              onOpenApp('explorer');
              onClose();
            }}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              FK
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">{personalInfo.name}</div>
              <div className="text-[10px] text-slate-400">{personalInfo.contact.email}</div>
            </div>
          </div>

          {/* Power Options */}
          <div className="relative">
            <button
              onClick={() => setShowPowerMenu(!showPowerMenu)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Power Options"
            >
              <Power className="w-4 h-4" />
            </button>

            {showPowerMenu && (
              <div className="absolute right-0 bottom-10 w-44 bg-slate-900 border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
                <button
                  onClick={() => {
                    setShowPowerMenu(false);
                    onLockScreen();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left text-slate-200"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lock Screen</span>
                </button>
                <button
                  onClick={() => {
                    setShowPowerMenu(false);
                    onRestart();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-left text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Refresh Desktop</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
