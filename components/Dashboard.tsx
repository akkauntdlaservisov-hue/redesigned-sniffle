
import React, { useState } from 'react';
import { User, ProjectIdea, Language } from '../types';
import { Send, Layout, Sparkles, MessageSquare, ExternalLink, Rocket, Globe, ShieldCheck, Activity, Info, X, Users, Heart } from 'lucide-react';
import { generateSiteIdeas } from '../services/geminiService';
import { translations } from '../translations';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, lang, onLangChange }) => {
  const [businessType, setBusinessType] = useState('');
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  // Private PM links updated per user request
  const PERSONAL_TG = "https://t.me/toirov1234";
  const PARTNER_TG = "https://t.me/irgashev1234";
  // Group Link updated per latest request
  const GROUP_LINK = "https://t.me/bussinessWeb";
  
  const t = translations[lang];

  // Request functionality disabled as per user request
  const handleSendRequest = () => {
    return; // Currently disabled
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Custom Info Overlay */}
      {infoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg p-8 rounded-3xl border-slate-700/50 shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setInfoModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">{infoModal.title}</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {infoModal.content}
            </p>
            <button 
              onClick={() => setInfoModal(null)}
              className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl glass">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">{t.welcome}, {user.nickname}!</h1>
          <div className="flex items-center gap-1 bg-slate-950/50 w-fit p-1 rounded-lg border border-slate-800">
            <Globe className="w-3 h-3 text-slate-500 ml-1" />
            {(['en', 'ru', 'uz'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase transition-colors ${
                  lang === l ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {t.logout}
          </button>
          <a 
            href={GROUP_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
          >
            <title>Join our TG Group</title>
            <Users className="w-4 h-4" />
            {t.tgGroup}
          </a>
          <div className="flex flex-col sm:flex-row gap-2">
            <a 
              href={PERSONAL_TG} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              {t.contactMe}
            </a>
            <a 
              href={PARTNER_TG} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              {t.contactPartner}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-8 items-center py-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            WebCreateStudio
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            {t.needWebsite} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {t.bringIdeas}
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg">
            {t.description}
          </p>
          
          <div className="relative group max-w-md opacity-60">
            <textarea 
              disabled
              rows={3}
              placeholder={t.placeholder}
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 px-6 focus:outline-none transition-all text-slate-500 pr-6 min-h-[120px] cursor-not-allowed"
            />
            <button 
              disabled
              className="mt-4 w-full bg-slate-800 text-slate-500 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {t.brainstorm}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-3xl rounded-full"></div>
          <div className="relative glass p-8 rounded-3xl border-slate-700/50 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Layout className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">{t.services}</h3>
                <p className="text-slate-400 text-sm">{t.modernStack}</p>
              </div>
            </div>
            
            <ul className="space-y-4">
              {/* VIP Card */}
              <li 
                className="p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-xl border border-blue-500/30 hover:border-blue-500 transition-all group cursor-pointer" 
                onClick={() => setInfoModal({ title: t.vipTitle, content: t.vipWorking })}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-3 text-blue-200 font-bold">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    {t.vipTitle}
                  </span>
                  <ExternalLink className="w-4 h-4 text-blue-400 opacity-50" />
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{t.vipDesc}</p>
              </li>

              {/* Activity Card */}
              <li 
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                onClick={() => setInfoModal({ title: t.activityTitle, content: t.activityInfo })}
              >
                <div className="flex items-center gap-3 text-slate-200 font-semibold mb-1">
                  <Activity className="w-5 h-5 text-green-400" />
                  {t.activityTitle}
                </div>
                <p className="text-slate-400 text-xs">{t.activityDesc}</p>
              </li>

              {/* About Card */}
              <li 
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-500 transition-all cursor-pointer" 
                onClick={() => setInfoModal({ title: t.aboutTitle, content: t.aboutDetails })}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-3 text-slate-200 font-semibold">
                    <Info className="w-5 h-5 text-indigo-400" />
                    {t.aboutTitle}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-slate-400 text-xs">{t.aboutDesc}</p>
              </li>

              {/* Why Choose Us Card */}
              <li 
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer" 
                onClick={() => setInfoModal({ title: t.whyChooseUsTitle, content: t.whyChooseUsDetails })}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-3 text-slate-200 font-semibold">
                    <Heart className="w-5 h-5 text-pink-500" />
                    {t.whyChooseUsTitle}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-slate-400 text-xs">{t.whyChooseUsDesc}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Suggestions Grid - Only shown if ideas exist (currently hidden as brainstorming is disabled) */}
      {ideas.length > 0 && (
        <section className="space-y-6 pt-12 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <Rocket className="text-blue-400 w-6 h-6" />
            <h3 className="text-2xl font-bold text-white">{t.aiIdeas}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ideas.map((idea, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl border-slate-700/50 hover:border-blue-500/50 transition-all group flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{idea.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{idea.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {idea.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => window.open(`${PERSONAL_TG}?text=I'm interested in the ${idea.title} project concept for my site.`, '_blank')}
                  className="w-full py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {t.discuss}
                  <Send className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer / CTA */}
      <footer className="mt-20 py-12 border-t border-slate-800/50 text-center space-y-4">
        <h4 className="text-slate-300 font-bold tracking-widest uppercase text-xs">WebCreateStudio</h4>
        <p className="text-slate-500 text-sm">© 2024 Developing the Digital Future. Group: WebCreateStudio</p>
      </footer>
    </div>
  );
};
