import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const TerminalWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'Windows PowerShell [Version 10.0.22631.3007]'
    },
    {
      id: 'init-2',
      type: 'output',
      text: '(c) Microsoft Corporation. All rights reserved.'
    },
    {
      id: 'init-3',
      type: 'success',
      text: `\n✨ Welcome to Faouzi Kemala's Interactive Terminal Environment!\nType "help" to view available commands (cv, skills, projects, contact, github, clear, neofetch).\n`
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory: TerminalLine[] = [
      ...history,
      { id: `in-${Date.now()}`, type: 'input', text: `PS C:\\Users\\Faouzi> ${input}` }
    ];

    switch (cmd) {
      case 'help':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `AVAILABLE COMMANDS:
  help      - Display this list of commands
  cv        - View full curriculum vitae summary
  bio       - Read developer overview & background
  skills    - List programming languages & technical stack
  projects  - Show featured repositories & projects
  contact   - Display email, GitHub, and phone contact info
  github    - Open Faouzi Kemala's official GitHub page
  neofetch  - Display system & developer diagnostic specs
  cls/clear - Clear terminal screen`
        });
        break;

      case 'cv':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `=== FAOUZI KEMALA (فوزي كمالة) | CURRICULUM VITAE ===
Statut: ${personalInfo.tagline}
Contact: ${personalInfo.contact.phone} | ${personalInfo.contact.email}
Localisation: ${personalInfo.location}

FORMATIONS:
${personalInfo.education.map(ed => `* ${ed.degree} (${ed.institution}) - ${ed.year}`).join('\n')}

EXPÉRIENCES RÉCENTES:
${personalInfo.experience.map(e => `* ${e.role} @ ${e.company} (${e.period})\n  ${e.description}`).join('\n\n')}

Tapez "skills" ou "projects" pour plus de détails !`
        });
        break;

      case 'bio':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: personalInfo.bio
        });
        break;

      case 'skills':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `TECHNICAL SKILLS & PROFICIENCIES:
${personalInfo.skills.map(s => `• ${s.name.padEnd(20)} [${'#'.repeat(Math.round(s.level / 10))}${' '.repeat(10 - Math.round(s.level / 10))}] ${s.level}%`).join('\n')}`
        });
        break;

      case 'projects':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `FEATURED PROJECTS:
${personalInfo.projects.map(p => `• ${p.title} (${p.period})
  ${p.description}
  GitHub: ${p.githubUrl}`).join('\n\n')}`
        });
        break;

      case 'contact':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `CONTACT INFORMATION:
Email:  ${personalInfo.contact.email}
GitHub: ${personalInfo.contact.github} (${personalInfo.contact.githubUrl})
Phone:  ${personalInfo.contact.phone}
City:   ${personalInfo.location}`
        });
        break;

      case 'github':
        window.open(personalInfo.contact.githubUrl, '_blank', 'noreferrer');
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `Opening ${personalInfo.contact.githubUrl} in new tab...`
        });
        break;

      case 'neofetch':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `        #####          faouzi@windows11-station
       #######         ------------------------
       #######         OS: Windows 11 Pro x64 (Interactive CV Portfolio)
       #####           Kernel: React 19 + Three.js
      #       #        Status: Master 1 Recherche Informatique (ISIMG)
     ###     ###       Shell: Windows PowerShell 7.4
    #####   #####      Resolution: Interactive 3D Black & White Galaxy
   ####### #######     DE: Windows 11 Acrylic Desktop
                       Wallpaper: 3D Monochrome Milky Way Galaxy
                       Focus: Unity 3D/VR, Meta Quest 3, Symfony, Android
                       Availability: CDI dès Août 2025`
        });
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `'${cmd}' is not recognized as a cmdlet, function, script file, or operable program. Type 'help' for available commands.`
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex-1 flex flex-col h-full bg-[#0c0c0c] text-slate-100 p-4 font-mono text-xs overflow-y-auto select-text cursor-text"
    >
      <div className="space-y-1.5 leading-relaxed">
        {history.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap ${
              line.type === 'input'
                ? 'text-cyan-300 font-semibold'
                : line.type === 'error'
                ? 'text-red-400'
                : line.type === 'success'
                ? 'text-emerald-300'
                : 'text-slate-300'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="flex items-center space-x-2 mt-2">
        <span className="text-cyan-400 font-semibold flex-shrink-0">
          PS C:\Users\Faouzi&gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs selection:bg-cyan-500/40"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};
