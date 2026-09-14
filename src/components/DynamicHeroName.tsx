import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Github,
  Mail,
  FileText,
  Sliders,
  ExternalLink,
  ChevronDown,
  Eye,
  EyeOff,
  Terminal,
  Type
} from 'lucide-react';
import { DynamicFontChoice } from '../types';
import { personalInfoData } from '../data/personalInfo';

interface DynamicHeroNameProps {
  currentFont: DynamicFontChoice;
  onFontChange: (font: DynamicFontChoice) => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  onToggleControls: () => void;
  isControlsOpen: boolean;
}

const fontOptions: { id: DynamicFontChoice; name: string; fontClass: string; desc: string }[] = [
  { id: 'orbitron', name: 'Orbitron', fontClass: "font-['Orbitron',sans-serif]", desc: 'Sci-Fi Cybernetic' },
  { id: 'syne', name: 'Syne Bold', fontClass: "font-['Syne',sans-serif]", desc: 'Avant-Garde Display' },
  { id: 'cinzel', name: 'Cinzel Celestial', fontClass: "font-['Cinzel',serif]", desc: 'Monumental Serif' },
  { id: 'space', name: 'Space Grotesk', fontClass: "font-['Space_Grotesk',sans-serif]", desc: 'Modern Tech' },
  { id: 'glitch', name: 'Holo Glitch', fontClass: "font-['Orbitron',sans-serif] tracking-widest", desc: 'Cybernetic Pulse' }
];

export const DynamicHeroName: React.FC<DynamicHeroNameProps> = ({
  currentFont,
  onFontChange,
  onOpenCV,
  onOpenContact,
  onToggleControls,
  isControlsOpen
}) => {
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const [isHeroHidden, setIsHeroHidden] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);

  const selectedFont = fontOptions.find(f => f.id === currentFont) || fontOptions[0];

  const nameLetters = personalInfoData.name.split('');

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-8 z-10 select-none">
      {/* Top Bar Header */}
      <header className="pointer-events-auto flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 px-3.5 py-2 rounded-full shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
            Planetary Portfolio Engine
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
          <span className="hidden sm:inline-block text-xs text-slate-300 font-mono">
            {personalInfoData.status}
          </span>
        </div>

        {/* Action Controls in Top Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle Hero Visibility for Pure 3D View */}
          <button
            id="btn-toggle-hero-visibility"
            onClick={() => setIsHeroHidden(!isHeroHidden)}
            title={isHeroHidden ? "Show presentation text" : "Hide text for full 3D view"}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition shadow-md"
          >
            {isHeroHidden ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isHeroHidden ? "Show Overlay" : "Clean View"}</span>
          </button>

          {/* Quick GitHub Direct Link */}
          <a
            id="link-header-github"
            href={personalInfoData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-full bg-slate-900/70 hover:bg-slate-800 backdrop-blur-md border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white transition shadow-md group"
          >
            <Github className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Planet & Light Controls Toggle */}
          <button
            id="btn-toggle-studio-controls"
            onClick={onToggleControls}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-full backdrop-blur-md border transition shadow-md ${
              isControlsOpen
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-cyan-500/20'
                : 'bg-slate-900/70 text-slate-200 hover:text-white border-slate-700 hover:border-cyan-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Studio Controls</span>
          </button>
        </div>
      </header>

      {/* Middle Hero Presentation (Interactive Dynamic Typography & Presentation) */}
      <AnimatePresence>
        {!isHeroHidden && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto my-auto flex flex-col items-center text-center px-4 max-w-4xl mx-auto"
          >
            {/* Font Style Pill Dropdown */}
            <div className="relative mb-3 sm:mb-4">
              <button
                id="btn-font-picker"
                onClick={() => setIsFontPickerOpen(!isFontPickerOpen)}
                className="flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition shadow"
              >
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                <span>Font Style: <strong className="text-white">{selectedFont.name}</strong></span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isFontPickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFontPickerOpen && (
                <div
                  id="font-picker-menu"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-xl p-1.5 shadow-2xl z-30 flex flex-col gap-1"
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                    Select Dynamic Font
                  </div>
                  {fontOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onFontChange(option.id);
                        setIsFontPickerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left rounded-lg text-xs transition ${
                        currentFont === option.id
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <span className={option.fontClass}>{option.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{option.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Name in Middle */}
            <div className="relative group">
              {/* Subtle cosmic glow aura behind name */}
              <div className="absolute -inset-6 bg-radial from-cyan-500/15 via-violet-600/10 to-transparent blur-2xl rounded-full pointer-events-none" />

              <h1
                id="hero-name-display"
                className={`relative text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] ${selectedFont.fontClass} ${
                  currentFont === 'glitch'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 animate-pulse'
                    : 'text-white'
                }`}
              >
                {nameLetters.map((char, index) => (
                  <span
                    key={index}
                    onMouseEnter={() => setHoveredLetter(index)}
                    onMouseLeave={() => setHoveredLetter(null)}
                    className={`inline-block transition-all duration-200 cursor-default ${
                      hoveredLetter === index
                        ? 'text-cyan-400 scale-110 -translate-y-1.5'
                        : ''
                    }`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Role / Subtitle */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-cyan-400/80" />
              <p
                id="hero-tagline"
                className="text-xs sm:text-sm md:text-base font-mono text-cyan-200 tracking-wide font-medium drop-shadow"
              >
                {personalInfoData.title}
              </p>
              <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-cyan-400/80" />
            </div>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl font-sans drop-shadow leading-relaxed">
              {personalInfoData.tagline}
            </p>

            {/* Main Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                id="btn-open-cv-modal"
                onClick={onOpenCV}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span>View Full CV & Projects</span>
              </button>

              <button
                id="btn-open-contact-modal"
                onClick={onOpenContact}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700 hover:border-cyan-400/60 text-slate-200 hover:text-white text-xs sm:text-sm transition-all shadow-md"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Get In Touch</span>
              </button>

              <a
                id="btn-hero-github-link"
                href={personalInfoData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-xs sm:text-sm transition-all shadow-md"
              >
                <Github className="w-4 h-4" />
                <span>GitHub @{personalInfoData.githubUsername}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Helper Bar */}
      <footer className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-7xl mx-auto pt-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/80">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 3D Canvas: Drag to Rotate • Scroll to Zoom & Accelerate Stream</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-bottom-quick-cv"
            onClick={onOpenCV}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition underline underline-offset-4"
          >
            Curriculum Vitae
          </button>
          <span className="text-slate-600">•</span>
          <a
            id="btn-bottom-email-direct"
            href={`mailto:${personalInfoData.email}`}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition"
          >
            {personalInfoData.email}
          </a>
        </div>
      </footer>
    </div>
  );
};
