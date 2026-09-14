import React, { useState } from 'react';
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  Briefcase,
  GraduationCap,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Heart,
  Code2
} from 'lucide-react';
import { personalInfo, personalInfoData } from '../../data/personalInfo';

interface PdfViewerWindowProps {
  isArabic?: boolean;
}

export const PdfViewerWindow: React.FC<PdfViewerWindowProps> = ({ isArabic = false }) => {
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `FAOUZI KEMALA (فوزي كمالة)
${personalInfo.tagline}
Contact: ${personalInfo.contact.phone} | ${personalInfo.contact.email} | ${personalInfo.location}
LinkedIn: ${personalInfo.contact.linkedin} | GitHub: ${personalInfo.contact.githubUrl}

FORMATIONS ET DIPLÔMES:
${personalInfoData.education.map(e => `• ${e.year}: ${e.degree} (${e.institution})`).join('\n')}

EXPÉRIENCES PROFESSIONNELLES:
${personalInfoData.experiences.map(e => `• ${e.role} - ${e.company} (${e.period})\n  ${e.description}`).join('\n\n')}

PROJETS:
${personalInfoData.projects.map(p => `• ${p.title} (${p.tags.join(', ')})\n  ${p.description}`).join('\n')}

COMPÉTENCES:
• Développement web (PHP, Symfony, HTML5, CSS, SQL) & bases de données (MySQL, SQLite)
• Programmation C# & Unity 3D/VR, Meta Quest 3, Oculus SDK, Blender
• Android Studio, Kotlin/Java, Firebase, Python

LANGUES:
• Arabe: Maternelle | Français: Avancé | Anglais: Avancé
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full bg-[#181a20] text-slate-100 select-text overflow-hidden ${
        isArabic ? 'font-[\'Cairo\',\'Tajawal\',sans-serif]' : 'font-sans'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* PDF Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0e1015] border-b border-white/10 text-xs select-none">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white text-[9px] font-bold">
            PDF
          </div>
          <span className="font-semibold text-slate-200">
            {isArabic ? 'السيرة_الذاتية_فوزي_كمالة.pdf' : 'Faouzi_Kemala_Curriculum_Vitae.pdf'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono">1 / 1</span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Zoom */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-900 border border-white/10 rounded px-1.5 py-0.5">
            <button
              onClick={() => setZoom(z => Math.max(70, z - 10))}
              className="p-1 hover:text-white text-slate-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-xs font-mono">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(130, z + 10))}
              className="p-1 hover:text-white text-slate-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
            title="Copy CV Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ النص' : 'Copy Text')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded bg-slate-200 hover:bg-white text-slate-950 font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isArabic ? 'طباعة' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-[#1c1f26]">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-3xl bg-white text-slate-900 shadow-2xl rounded p-8 sm:p-10 transition-transform duration-150 relative font-sans leading-relaxed border border-slate-300"
        >
          {/* Header */}
          <div className="border-b border-slate-300 pb-5 mb-5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 uppercase">
              {isArabic ? `${personalInfo.nameArabic} (${personalInfo.name})` : personalInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1 leading-normal">
              {personalInfo.tagline}
            </p>

            {/* Coordinates */}
            <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-slate-700 font-medium">
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <Phone className="w-3.5 h-3.5 text-slate-900" />
                <span className="font-mono">{personalInfo.contact.phone}</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <MapPin className="w-3.5 h-3.5 text-slate-900" />
                <span>{personalInfo.location}</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <Mail className="w-3.5 h-3.5 text-slate-900" />
                <a href={`mailto:${personalInfo.contact.email}`} className="font-mono hover:underline">
                  {personalInfo.contact.email}
                </a>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                <a href={personalInfo.contact.linkedin} target="_blank" rel="noreferrer" className="hover:underline font-mono">
                  linkedin.com/in/faouzikemala
                </a>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <Github className="w-3.5 h-3.5 text-slate-900" />
                <a href={personalInfo.contact.githubUrl} target="_blank" rel="noreferrer" className="hover:underline font-mono">
                  github.com/faouzikemala
                </a>
              </span>
            </div>
          </div>

          {/* Formations et Diplômes */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center space-x-1.5 rtl:space-x-reverse">
              <GraduationCap className="w-3.5 h-3.5 text-slate-900" />
              <span>{isArabic ? 'التكوين والشهادات (Formations et Diplômes)' : 'Formations et Diplômes'}</span>
            </h2>
            <div className="space-y-2 text-xs">
              {personalInfoData.education.map((edu) => (
                <div key={edu.id} className="leading-snug">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>• {edu.degree}</span>
                    <span className="text-[11px] text-slate-600 font-mono font-normal">{edu.year}</span>
                  </div>
                  <div className="text-slate-700 text-[11px] pl-3 rtl:pr-3">
                    {edu.institution} {edu.honors ? `— ${edu.honors}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expériences Professionnelles */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center space-x-1.5 rtl:space-x-reverse">
              <Briefcase className="w-3.5 h-3.5 text-slate-900" />
              <span>{isArabic ? 'الخبرات المهنية (Expériences Professionnelles)' : 'Expériences Professionnelles'}</span>
            </h2>
            <div className="space-y-3.5 text-xs">
              {personalInfoData.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-950 text-[13px]">• {exp.role}</span>
                    <span className="text-[11px] text-slate-600 font-mono">{exp.period}</span>
                  </div>
                  <div className="text-slate-800 font-medium text-[11px] pl-3 rtl:pr-3 mb-1">
                    {exp.company} — {exp.location}
                  </div>
                  <p className="text-slate-700 text-[11px] pl-3 rtl:pr-3 leading-normal mb-1">
                    <strong className="font-semibold text-slate-900">Missions et objectif : </strong>
                    {exp.description}
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 pl-3 rtl:pr-3 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <div className="mt-1.5 pl-3 rtl:pr-3 flex flex-wrap gap-1">
                    {exp.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-[10px] text-slate-700 font-mono rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projets */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center space-x-1.5 rtl:space-x-reverse">
              <Code2 className="w-3.5 h-3.5 text-slate-900" />
              <span>{isArabic ? 'المشاريع (Projets)' : 'Projets'}</span>
            </h2>
            <div className="space-y-2.5 text-xs">
              {personalInfoData.projects.map((proj) => (
                <div key={proj.id} className="leading-snug">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>• {proj.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal">{proj.period}</span>
                  </div>
                  <div className="text-slate-700 text-[11px] pl-3 rtl:pr-3 mt-0.5">
                    <span className="font-semibold text-slate-900">Outils et technologies : </span>
                    {proj.tags.join(', ')}
                  </div>
                  <p className="text-slate-700 text-[11px] pl-3 rtl:pr-3 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compétences & Langues */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                {isArabic ? 'المهارات (Compétences)' : 'Compétences'}
              </h2>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
                <li>Développement web (PHP, HTML5, CSS, SQL) et gestion de bases de données</li>
                <li>Programmation C# et création d’applications immersives avec Unity 3D/VR</li>
                <li>Meta Quest 3, Oculus SDK, modélisation Blender</li>
                <li>Android Studio, Kotlin/Java, SQLite, Firebase</li>
                <li>Compétences en conception, résolution de problèmes et travail en équipe</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                {isArabic ? 'اللغات (Langues)' : 'Langues'}
              </h2>
              <div className="text-[11px] text-slate-700 space-y-1 mb-3">
                <div>• <strong className="text-slate-900">Arabe :</strong> Langue maternelle</div>
                <div>• <strong className="text-slate-900">Français :</strong> Avancé</div>
                <div>• <strong className="text-slate-900">Anglais :</strong> Avancé</div>
              </div>

              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 border-b border-slate-200 pb-1">
                {isArabic ? 'اهتمامات (Centres d’intérêt)' : 'Centres d’intérêt'}
              </h2>
              <div className="text-[11px] text-slate-700 leading-snug">
                Création et design de Logo, Flyer et Menu Digital. Programmation - Temps libre / Recherches innovations-tech/IA.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
