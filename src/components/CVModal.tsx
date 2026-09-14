import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Briefcase,
  Code2,
  FolderGit2,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Send,
  Download,
  Sparkles,
  Award,
  GraduationCap
} from 'lucide-react';
import { personalInfoData } from '../data/personalInfo';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'experience' | 'skills' | 'projects' | 'contact';
}

export const CVModal: React.FC<CVModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about'
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'skills' | 'projects' | 'contact'>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [messageForm, setMessageForm] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  // Sync tab if prop changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfoData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    // Prepare mailto link with entered subject and body
    const subject = encodeURIComponent(`Portfolio Inquiry from ${messageForm.name}`);
    const body = encodeURIComponent(
      `Hello Faouzi,\n\n${messageForm.message}\n\nBest regards,\n${messageForm.name} (${messageForm.email})`
    );
    window.open(`mailto:${personalInfoData.email}?subject=${subject}&body=${body}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      id="cv-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        id="cv-modal-container"
        className="relative w-full max-w-4xl bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-mono font-bold text-xl text-cyan-400">
                FK
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {personalInfoData.name}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                  Available
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-200/80 font-mono">
                {personalInfoData.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {personalInfoData.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-cv"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition"
              title="Print / Export CV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print CV</span>
            </button>
            <button
              id="btn-close-cv-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close CV Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 px-3 sm:px-6 overflow-x-auto no-scrollbar">
          <button
            id="tab-cv-about"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>About & Bio</span>
          </button>
          <button
            id="tab-cv-experience"
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Experience</span>
          </button>
          <button
            id="tab-cv-skills"
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Tech Skills</span>
          </button>
          <button
            id="tab-cv-projects"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects & Code</span>
          </button>
          <button
            id="tab-cv-contact"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>GitHub & Contact</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-200">
          {/* TAB 1: ABOUT & BIO */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Highlight Stats Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {personalInfoData.stats.map((stat, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                    <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{stat.value}</div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">{stat.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{stat.subtext}</div>
                  </div>
                ))}
              </div>

              {/* Biography */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Engineering Philosophy & Background
                </h3>
                {personalInfoData.bio.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  Education & Academic Foundation
                </h3>
                <div className="grid gap-3">
                  {personalInfoData.education.map((edu, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-semibold text-white">
                        <span>{edu.degree}</span>
                        <span className="font-mono text-cyan-400 text-xs">{edu.year}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{edu.institution}</div>
                      <p className="text-xs text-slate-300 mt-2">{edu.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-slate-800 space-y-8">
                {personalInfoData.experiences.map((exp) => (
                  <div key={exp.id} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {exp.role}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-slate-400 mb-2">
                      <span className="text-cyan-200">{exp.company}</span> • {exp.location}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1.5 text-xs text-slate-300 mb-3 list-disc list-inside">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {personalInfoData.skills.map((category) => (
                  <div key={category.category} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold border-b border-slate-800/80 pb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2.5">
                      {category.items.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className={skill.highlight ? 'text-white font-semibold flex items-center gap-1.5' : 'text-slate-300'}>
                              {skill.highlight && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                              {skill.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">{skill.level}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {personalInfoData.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                        <span>{proj.category}</span>
                        {proj.stars && (
                          <span className="flex items-center gap-1 text-slate-400">
                            ★ {proj.stars}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        {proj.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                        </a>
                        <a
                          href={personalInfoData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Open external demo or overview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GITHUB & CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* GitHub Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                    <Github className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">GitHub Official Profile</h4>
                    <p className="text-xs font-mono text-cyan-300">
                      github.com/{personalInfoData.githubUsername}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Explore open-source 3D tools, WebGL experiments, and TypeScript repositories.
                    </p>
                  </div>
                </div>

                <a
                  id="btn-modal-visit-github"
                  href={personalInfoData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                >
                  <Github className="w-4 h-4" />
                  <span>Visit GitHub Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Direct Email & Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Email Copy Card */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Direct Email</span>
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-mono text-sm sm:text-base font-semibold text-white break-all">
                    {personalInfoData.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-copy-email"
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 hover:text-white transition"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                    </button>
                    <a
                      id="btn-mailto-direct"
                      href={`mailto:${personalInfoData.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Open Mail Client</span>
                    </a>
                  </div>
                </div>

                {/* Location & Availability Card */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-400">Location & Availability</span>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{personalInfoData.location}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Available for senior engineering contracts, technical advisory, 3D interactive consulting, and full-time leadership opportunities.
                  </p>
                </div>
              </div>

              {/* Interactive Message Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  Send a Direct Note to Faouzi Kemala
                </h4>
                <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Your Name</label>
                      <input
                        id="contact-input-name"
                        type="text"
                        required
                        value={messageForm.name}
                        onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">Your Email</label>
                      <input
                        id="contact-input-email"
                        type="email"
                        required
                        value={messageForm.email}
                        onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Message / Inquiry</label>
                    <textarea
                      id="contact-input-message"
                      rows={3}
                      required
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      placeholder="Hi Faouzi, I would love to discuss a project..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isSent ? (
                      <span className="text-cyan-400 font-mono text-xs flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Message prepared in mail client!
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">
                        Opens your native mail composer addressed directly to Faouzi.
                      </span>
                    )}

                    <button
                      id="btn-submit-contact-form"
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Faouzi Kemala • Curriculum Vitae & Portfolio</span>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:underline"
          >
            Return to 3D Space View
          </button>
        </div>
      </motion.div>
    </div>
  );
};
