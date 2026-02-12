
import React, { useState } from 'react';
import { User, AuthMode, Language } from '../types';
import { UserPlus, LogIn, Lock, User as UserIcon, CheckCircle2, Globe } from 'lucide-react';
import { translations } from '../translations';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

interface StoredUser {
  nickname: string;
  password: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, lang, onLangChange }) => {
  const [mode, setMode] = useState<AuthMode>('register');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const t = translations[lang];

  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem('webcraft_accounts');
    return users ? JSON.parse(users) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname || !password) {
      setError(t.fillFields);
      return;
    }

    const users = getStoredUsers();

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError(t.passMismatch);
        return;
      }

      if (password.length < 4) {
        setError(t.passShort);
        return;
      }

      if (users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase())) {
        setError(t.userExists);
        return;
      }

      const newUser: StoredUser = { nickname, password };
      localStorage.setItem('webcraft_accounts', JSON.stringify([...users, newUser]));
      
      setSuccess(true);
      setTimeout(() => {
        onAuthSuccess({ nickname, isRegistered: true, language: lang });
      }, 1500);

    } else {
      const user = users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase() && u.password === password);
      if (user) {
        onAuthSuccess({ nickname: user.nickname, isRegistered: true, language: lang });
      } else {
        setError(t.invalidCreds);
      }
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md p-12 rounded-3xl glass text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.accountCreated}</h2>
        <p className="text-slate-400">{t.welcomeMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-3xl glass shadow-2xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Language Selector */}
      <div className="flex justify-end mb-6 gap-2">
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
          <Globe className="w-3 h-3 text-slate-500 ml-1" />
          {(['en', 'ru', 'uz'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => onLangChange(l)}
              className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition-colors ${
                lang === l ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
          {mode === 'register' ? <UserPlus className="text-white w-8 h-8" /> : <LogIn className="text-white w-8 h-8" />}
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          {mode === 'register' ? t.registration : t.login}
        </h2>
        <p className="text-slate-400 mt-2 text-center text-sm">
          {mode === 'register' ? t.createBizAccount : t.enterDetails}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{t.nickname}</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
              placeholder={t.nickname}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{t.password}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
              placeholder="••••••••"
            />
          </div>
        </div>

        {mode === 'register' && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{t.confirmPassword}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center animate-shake">
            {error}
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
        >
          {mode === 'register' ? (
            <><UserPlus className="w-5 h-5" /> {t.createAccount}</>
          ) : (
            <><LogIn className="w-5 h-5" /> {t.login}</>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
        <p className="text-slate-400 text-sm">
          {mode === 'register' ? t.alreadyHaveAccount : t.firstTime}
          <button 
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              setError('');
            }}
            className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            {mode === 'register' ? t.login : t.createAccount}
          </button>
        </p>
      </div>
    </div>
  );
};
