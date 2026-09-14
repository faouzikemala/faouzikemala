import React, { useState } from 'react';
import { Save, Copy, Check, FileText } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

interface NotepadWindowProps {
  initialText?: string;
  initialFileName?: string;
}

export const NotepadWindow: React.FC<NotepadWindowProps> = ({
  initialText,
  initialFileName = 'About_Faouzi_Kemala.txt'
}) => {
  const defaultContent = initialText || `ABOUT FAOUZI KEMALA (فوزي كمالة)
=====================================
Statut: ${personalInfo.tagline}
Contact: ${personalInfo.contact.phone} | ${personalInfo.contact.email}
Localisation: ${personalInfo.location}
LinkedIn: ${personalInfo.contact.linkedin}
GitHub: ${personalInfo.contact.githubUrl}

FORMATIONS:
${personalInfo.education.map(e => `* ${e.year}: ${e.degree} (${e.institution})`).join('\n')}

EXPÉRIENCES PROFESSIONNELLES:
${personalInfo.experience.map(e => `* ${e.role} - ${e.company} (${e.period})
  ${e.description}
  Technologies: ${e.technologies.join(', ')}`).join('\n\n')}

PROJETS RÉALISÉS:
${personalInfo.projects.map(p => `* ${p.title} (${p.period})
  ${p.description}
  Outils: ${p.tags.join(', ')}`).join('\n\n')}

LANGUES:
* Arabe: Langue maternelle
* Français: Avancé
* Anglais: Avancé

NOTES:
- N'hésitez pas à explorer le dossier de la CV sur le bureau Windows 11 !
- La galaxie 3D en noir et blanc réagit aux mouvements de votre souris et au zoom de la molette.
`;

  const [content, setContent] = useState(defaultContent);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = initialFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-200 select-text overflow-hidden font-mono text-xs">
      {/* Notepad Menu Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/70 border-b border-white/10 select-none">
        <div className="flex items-center space-x-4 text-xs text-slate-300">
          <span className="cursor-pointer hover:text-white">File</span>
          <span className="cursor-pointer hover:text-white">Edit</span>
          <span className="cursor-pointer hover:text-white">View</span>
          <span className="cursor-pointer hover:text-white">Help</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-white/10"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-[11px] border border-cyan-500/30"
          >
            <Save className="w-3 h-3" />
            <span>{saved ? 'Saved!' : 'Save / Download'}</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4 overflow-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="w-full h-full bg-transparent resize-none outline-none border-none text-slate-100 font-mono text-xs leading-relaxed selection:bg-cyan-500/30 selection:text-cyan-200"
        />
      </div>

      {/* Notepad Status Bar */}
      <div className="h-6 px-3 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center space-x-3">
          <span>{initialFileName}</span>
          <span>•</span>
          <span>Ln {lineCount}, Col {charCount}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
