import React, { useState } from 'react';
import { Send, CheckCircle2, User, Mail as MailIcon } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

export const MailWindow: React.FC = () => {
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('Career Opportunity / Portfolio Inquiry');
  const [message, setMessage] = useState(
    `Hi Faouzi,\n\nI reviewed your Windows 11 Interactive CV and portfolio. We would love to discuss an engineering opportunity with you.\n\nBest regards,\n`
  );
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !message) return;

    // Direct mailto fallback as well
    const mailtoUrl = `mailto:${personalInfo.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`From: ${senderEmail}\n\n${message}`)}`;

    window.open(mailtoUrl, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-200 select-none overflow-hidden font-sans text-xs">
      {/* Mail Top Header */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MailIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-100">Windows Mail — New Message</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Recipient: <span className="text-cyan-400 font-mono">{personalInfo.contact.email}</span>
        </div>
      </div>

      {sent ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <div className="text-lg font-bold text-white">Message Prepared & Launched!</div>
          <p className="text-slate-400 text-xs max-w-sm">
            Your default email client or web mail opened to send your message to{' '}
            <span className="text-cyan-300 font-mono">{personalInfo.contact.email}</span>.
          </p>
          <button
            onClick={() => setSent(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            Compose Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
          {/* To Field */}
          <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
            <span className="w-16 text-slate-400 font-medium">To:</span>
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-800 border border-white/10 text-cyan-300 font-mono text-xs">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Faouzi Kemala &lt;{personalInfo.contact.email}&gt;</span>
            </div>
          </div>

          {/* From Field */}
          <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
            <span className="w-16 text-slate-400 font-medium">Your Email:</span>
            <input
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="e.g. recruiter@company.com"
              className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-xs font-mono"
            />
          </div>

          {/* Subject Field */}
          <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
            <span className="w-16 text-slate-400 font-medium">Subject:</span>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-100 text-xs font-medium"
            />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col pt-1">
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="flex-1 w-full bg-slate-950/40 border border-white/10 rounded-lg p-3 text-slate-200 resize-none outline-none focus:border-cyan-500/50 text-xs leading-relaxed"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-500">
              Direct inquiries dispatched to {personalInfo.contact.email}
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-cyan-600/30 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
