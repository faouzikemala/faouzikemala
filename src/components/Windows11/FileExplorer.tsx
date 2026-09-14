import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  RotateCw,
  Search,
  Folder,
  FileText,
  FileCode,
  FileBadge,
  Globe,
  Mail,
  Download,
  Eye,
  ExternalLink,
  Layers,
  Sparkles,
  Briefcase,
  GraduationCap,
  Star,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

interface FileExplorerProps {
  isArabic?: boolean;
  onOpenFileViewer?: (fileType: string, fileData?: any) => void;
  onOpenPdf?: () => void;
  onOpenNotepad?: (text?: string, title?: string) => void;
  onOpenMail?: () => void;
}

type ExplorerSection = 'all' | 'summary' | 'experience' | 'skills' | 'projects' | 'education' | 'contact';
type ViewMode = 'details' | 'tiles' | 'grid';

interface CVFileItem {
  id: string;
  name: string;
  type: string;
  extension: string;
  category: ExplorerSection;
  dateModified: string;
  size: string;
  summary: string;
  data: any;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  isArabic = false,
  onOpenPdf,
  onOpenNotepad,
  onOpenMail
}) => {
  const [currentSection, setCurrentSection] = useState<ExplorerSection>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('tiles');
  const [selectedFileId, setSelectedFileId] = useState<string>('summary_bio');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Define structured files inside the CV Folder
  const files: CVFileItem[] = [
    {
      id: 'summary_bio',
      name: '01_Executive_Profile_&_Bio.txt',
      type: 'Text Document',
      extension: '.txt',
      category: 'summary',
      dateModified: '2026-09-13 10:15 AM',
      size: '2.8 KB',
      summary: personalInfo.summary,
      data: {
        name: personalInfo.name,
        title: personalInfo.title,
        location: personalInfo.location,
        bio: personalInfo.bio,
        metrics: personalInfo.metrics
      }
    },
    {
      id: 'cv_official_pdf',
      name: '02_Faouzi_Kemala_Curriculum_Vitae.pdf',
      type: 'PDF Document',
      extension: '.pdf',
      category: 'summary',
      dateModified: '2026-09-12 04:30 PM',
      size: '428 KB',
      summary: 'Official compiled Curriculum Vitae with full career timeline, publications, and certifications.',
      data: personalInfo
    },
    ...personalInfo.experience.map((exp, idx) => ({
      id: `exp_${exp.id}`,
      name: `0${idx + 3}_Experience_${exp.company.replace(/\s+/g, '_')}.doc`,
      type: 'Work Experience Log',
      extension: '.doc',
      category: 'experience' as ExplorerSection,
      dateModified: '2026-08-20 09:00 AM',
      size: '4.2 KB',
      summary: `${exp.role} at ${exp.company} (${exp.period})`,
      data: exp
    })),
    {
      id: 'skills_matrix',
      name: '06_Skills_&_TechStack_Architecture.json',
      type: 'JSON Configuration',
      extension: '.json',
      category: 'skills',
      dateModified: '2026-09-01 11:20 AM',
      size: '6.1 KB',
      summary: 'Full inventory of languages, frameworks, 3D graphics, DevOps & database proficiencies.',
      data: personalInfo.skills
    },
    ...personalInfo.projects.map((proj, idx) => ({
      id: `proj_${proj.id}`,
      name: `0${idx + 7}_Project_${proj.title.replace(/\s+/g, '_')}.url`,
      type: 'Internet Shortcut',
      extension: '.url',
      category: 'projects' as ExplorerSection,
      dateModified: '2026-09-10 03:45 PM',
      size: '1.2 KB',
      summary: proj.description,
      data: proj
    })),
    ...personalInfo.education.map((edu, idx) => ({
      id: `edu_${edu.id}`,
      name: `10_Education_${edu.institution.replace(/\s+/g, '_')}.cert`,
      type: 'Academic Credential',
      extension: '.cert',
      category: 'education' as ExplorerSection,
      dateModified: '2026-01-15 02:10 PM',
      size: '3.4 KB',
      summary: `${edu.degree} - ${edu.institution}`,
      data: edu
    })),
    {
      id: 'contact_card',
      name: '12_Faouzi_Kemala_Contact_Channel.vcf',
      type: 'vCard Contact Record',
      extension: '.vcf',
      category: 'contact',
      dateModified: '2026-09-13 11:00 AM',
      size: '1.5 KB',
      summary: `Email: ${personalInfo.contact.email} | GitHub: ${personalInfo.contact.github}`,
      data: personalInfo.contact
    }
  ];

  // Filtering based on current folder & search query
  const filteredFiles = files.filter(f => {
    const matchesCategory = currentSection === 'all' || f.category === currentSection;
    const matchesSearch = !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedFile = files.find(f => f.id === selectedFileId) || filteredFiles[0] || files[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileDoubleClick = (file: CVFileItem) => {
    if (file.extension === '.pdf' && onOpenPdf) {
      onOpenPdf();
    } else if (file.extension === '.txt' && onOpenNotepad) {
      onOpenNotepad(
        `FAOUZI KEMALA — EXECUTIVE SUMMARY\n=================================\n\nTitle: ${personalInfo.title}\nLocation: ${personalInfo.location}\nEmail: ${personalInfo.contact.email}\nGitHub: ${personalInfo.contact.github}\n\nOVERVIEW:\n${personalInfo.bio}\n\nKEY CAREER ACHIEVEMENTS:\n${personalInfo.metrics.map(m => `- ${m.label}: ${m.value} (${m.description})`).join('\n')}`,
        file.name
      );
    } else if (file.extension === '.url') {
      window.open(file.data.githubUrl || personalInfo.contact.githubUrl, '_blank', 'noreferrer');
    } else if (file.extension === '.vcf' && onOpenMail) {
      onOpenMail();
    }
  };

  const getFileIcon = (file: CVFileItem) => {
    switch (file.extension) {
      case '.pdf':
        return (
          <div className="w-8 h-8 rounded bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-[10px] shadow-sm">
            PDF
          </div>
        );
      case '.txt':
        return (
          <div className="w-8 h-8 rounded bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
        );
      case '.doc':
        return (
          <div className="w-8 h-8 rounded bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-sm">
            <Briefcase className="w-4 h-4" />
          </div>
        );
      case '.json':
        return (
          <div className="w-8 h-8 rounded bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
            <FileCode className="w-4 h-4" />
          </div>
        );
      case '.url':
        return (
          <div className="w-8 h-8 rounded bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <Globe className="w-4 h-4" />
          </div>
        );
      case '.cert':
        return (
          <div className="w-8 h-8 rounded bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
        );
      case '.vcf':
        return (
          <div className="w-8 h-8 rounded bg-pink-950/70 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-sm">
            <Mail className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shadow-sm">
            <FileBadge className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/95 text-slate-200 select-none overflow-hidden font-sans">
      {/* 1. Explorer Navigation Bar */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-slate-950/60 border-b border-white/10 text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentSection('all')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-40"
            title="Back to Root Folder"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded hover:bg-white/10 text-slate-500 cursor-not-allowed"
            disabled
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSection('all')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Up to Parent Directory"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSearchQuery('');
              setCurrentSection('all');
            }}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Refresh Folder"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Breadcrumb Address Bar */}
        <div className="flex-1 flex items-center bg-slate-900/90 border border-white/10 rounded-md px-2.5 py-1 text-xs text-slate-300">
          <Folder className="w-3.5 h-3.5 text-amber-400 mr-1.5 flex-shrink-0" />
          <span className="text-slate-400">This PC</span>
          <ChevronRight className="w-3 h-3 text-slate-600 mx-1" />
          <span className="text-slate-400">Documents</span>
          <ChevronRight className="w-3 h-3 text-slate-600 mx-1" />
          <span className="font-semibold text-cyan-400">Faouzi_Kemala_CV</span>
          {currentSection !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-600 mx-1" />
              <span className="text-white capitalize">{currentSection}</span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="w-56 flex items-center bg-slate-900/90 border border-white/10 rounded-md px-2.5 py-1 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in CV files..."
            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-xs"
          />
        </div>
      </div>

      {/* 2. Explorer Command Action Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/30 border-b border-white/10 text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onOpenPdf && onOpenPdf()}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open PDF Viewer</span>
          </button>
          <button
            onClick={() => {
              const element = document.createElement('a');
              const fileContent = JSON.stringify(personalInfo, null, 2);
              const file = new Blob([fileContent], { type: 'application/json' });
              element.href = URL.createObjectURL(file);
              element.download = 'Faouzi_Kemala_CV_Data.json';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded hover:bg-white/10 text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CV JSON</span>
          </button>
          <a
            href={personalInfo.contact.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Visit GitHub Repo</span>
          </a>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-900/60 rounded border border-white/10 p-0.5">
          <button
            onClick={() => setViewMode('tiles')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'tiles' ? 'bg-cyan-500/30 text-cyan-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tiles
          </button>
          <button
            onClick={() => setViewMode('details')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'details' ? 'bg-cyan-500/30 text-cyan-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Sidebar + File List + Live Preview Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Directory */}
        <div className="w-52 bg-slate-950/40 border-r border-white/10 p-2 flex flex-col text-xs space-y-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
            CV Sections
          </div>

          <button
            onClick={() => setCurrentSection('all')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">All Files ({files.length})</span>
          </button>

          <button
            onClick={() => setCurrentSection('summary')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'summary'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="truncate">01 Executive Profile</span>
          </button>

          <button
            onClick={() => setCurrentSection('experience')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'experience'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span className="truncate">02 Work Experience</span>
          </button>

          <button
            onClick={() => setCurrentSection('skills')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'skills'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">03 Skills Matrix</span>
          </button>

          <button
            onClick={() => setCurrentSection('projects')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'projects'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">04 Featured Projects</span>
          </button>

          <button
            onClick={() => setCurrentSection('education')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'education'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="truncate">05 Education</span>
          </button>

          <button
            onClick={() => setCurrentSection('contact')}
            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-left transition-colors ${
              currentSection === 'contact'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span className="truncate">06 Contact Channels</span>
          </button>

          {/* Quick Metrics in sidebar */}
          <div className="mt-auto pt-4 border-t border-white/10 text-[11px] text-slate-400 px-2 space-y-1.5">
            <div className="font-semibold text-slate-300">Quick Stats</div>
            <div>⚡ 7+ Yrs Experience</div>
            <div>🚀 30+ WebGL / Cloud Projects</div>
            <div>⭐ 99.9% Production SLA</div>
          </div>
        </div>

        {/* Center: File Grid / List */}
        <div className="flex-1 overflow-y-auto p-3">
          {viewMode === 'tiles' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                    className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400/50 shadow-md ring-1 ring-cyan-400/30'
                        : 'bg-slate-900/60 border-white/5 hover:bg-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">{getFileIcon(file)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {file.summary}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                        <span>{file.type}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Details View
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Date modified</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium text-right">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFile?.id === file.id;
                  return (
                    <tr
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      onDoubleClick={() => handleFileDoubleClick(file)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-200 font-medium' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-2 flex items-center space-x-2 truncate max-w-[240px]">
                        <span className="scale-75 origin-left">{getFileIcon(file)}</span>
                        <span className="truncate">{file.name}</span>
                      </td>
                      <td className="py-2 text-slate-400 text-[11px]">{file.dateModified}</td>
                      <td className="py-2 text-slate-400 text-[11px]">{file.type}</td>
                      <td className="py-2 text-slate-400 text-[11px] text-right">{file.size}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right: Rich Interactive File Preview Pane */}
        {selectedFile && (
          <div className="w-80 bg-slate-950/60 border-l border-white/10 p-4 flex flex-col overflow-y-auto text-xs">
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              {getFileIcon(selectedFile)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 truncate text-sm">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-cyan-400">{selectedFile.type}</div>
              </div>
            </div>

            {/* Dynamic Content based on selected file type */}
            <div className="mt-3 flex-1 space-y-3">
              {/* Category: Summary / Profile */}
              {selectedFile.category === 'summary' && selectedFile.extension === '.txt' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Developer Bio
                    </div>
                    <p className="mt-1 text-slate-300 leading-relaxed text-xs">
                      {personalInfo.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Key Career Metrics
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {personalInfo.metrics.map((m, idx) => (
                        <div key={idx} className="bg-slate-900/80 border border-white/10 p-2 rounded">
                          <div className="text-cyan-400 font-bold text-sm">{m.value}</div>
                          <div className="text-[10px] text-slate-400">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleFileDoubleClick(selectedFile)}
                    className="w-full py-1.5 px-3 rounded bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 font-medium flex items-center justify-center space-x-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open in Notepad.exe</span>
                  </button>
                </div>
              )}

              {/* Category: PDF CV */}
              {selectedFile.extension === '.pdf' && (
                <div className="space-y-3">
                  <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-center">
                    <div className="text-red-400 font-bold text-base mb-1">
                      Official Curriculum Vitae
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Full printable document with verified experience, skills, and certifications.
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenPdf && onOpenPdf()}
                    className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Launch PDF Reader</span>
                  </button>
                </div>
              )}

              {/* Category: Experience */}
              {selectedFile.category === 'experience' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-bold text-cyan-300">
                      {selectedFile.data.role}
                    </div>
                    <div className="text-xs text-slate-200 font-medium">
                      {selectedFile.data.company} • {selectedFile.data.location}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {selectedFile.data.period}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedFile.data.description}
                  </p>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Key Highlights
                    </div>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {selectedFile.data.highlights?.map((h: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedFile.data.technologies?.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-900 border border-white/10 rounded text-[10px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category: Skills */}
              {selectedFile.category === 'skills' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Core Competencies
                  </div>
                  <div className="space-y-2">
                    {personalInfo.skills.map((skill, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-slate-200">{skill.name}</span>
                          <span className="text-cyan-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Projects */}
              {selectedFile.category === 'projects' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-bold text-emerald-300">
                      {selectedFile.data.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {selectedFile.data.period}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedFile.data.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {selectedFile.data.tags?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-500/30 rounded text-[10px] text-emerald-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={selectedFile.data.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-3 rounded bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 font-medium flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Repository on GitHub</span>
                  </a>
                </div>
              )}

              {/* Category: Contact */}
              {selectedFile.category === 'contact' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Direct Contact
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-slate-900/80 border border-white/10 rounded flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">Email</div>
                        <div className="text-xs font-mono text-cyan-300">{personalInfo.contact.email}</div>
                      </div>
                      <button
                        onClick={() => handleCopy(personalInfo.contact.email, 'email')}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        title="Copy Email"
                      >
                        {copiedId === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2 bg-slate-900/80 border border-white/10 rounded flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">GitHub Profile</div>
                        <div className="text-xs font-mono text-cyan-300">{personalInfo.contact.github}</div>
                      </div>
                      <a
                        href={personalInfo.contact.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        title="Open GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenMail && onOpenMail()}
                    className="w-full py-1.5 px-3 rounded bg-pink-600/30 hover:bg-pink-600/40 border border-pink-500/40 text-pink-200 font-medium flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Message via Windows Mail</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom File Metadata Details */}
            <div className="mt-auto pt-3 border-t border-white/10 text-[10px] text-slate-400 space-y-1">
              <div>Size: {selectedFile.size}</div>
              <div>Modified: {selectedFile.dateModified}</div>
              <div>Location: \Documents\Faouzi_Kemala_CV</div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Explorer Status Bar */}
      <div className="h-6 px-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div>
          {filteredFiles.length} item{filteredFiles.length !== 1 ? 's' : ''}
          {selectedFile && ` • 1 item selected (${selectedFile.size})`}
        </div>
        <div className="flex items-center space-x-2">
          <span>NTFS File System</span>
          <span>•</span>
          <span className="text-cyan-400">Windows 11 Experience</span>
        </div>
      </div>
    </div>
  );
};
