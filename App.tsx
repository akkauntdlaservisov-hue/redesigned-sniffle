
import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { User, Language } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('ru'); // Default to Russian as requested
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Pointing to the main channel per user request
  const TELEGRAM_LINK = "https://t.me/bussinessWeb";

  useEffect(() => {
    const session = sessionStorage.getItem('webcraft_session');
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      if (parsedUser.language) {
        setLang(parsedUser.language);
      }
    }
    setIsAppReady(true);
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    const finalUser = { ...authenticatedUser, language: lang };
    setUser(finalUser);
    sessionStorage.setItem('webcraft_session', JSON.stringify(finalUser));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('webcraft_session');
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    if (user) {
      const updatedUser = { ...user, language: newLang };
      setUser(updatedUser);
      sessionStorage.setItem('webcraft_session', JSON.stringify(updatedUser));
    }
  };

  if (!isAppReady) return null;

  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden flex flex-col">
      {/* Decorative background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="flex-grow flex items-center justify-center relative z-10">
        {!user ? (
          <AuthForm 
            onAuthSuccess={handleAuthSuccess} 
            lang={lang} 
            onLangChange={handleLangChange} 
          />
        ) : (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            lang={lang} 
            onLangChange={handleLangChange} 
          />
        )}
      </main>

      {/* Floating Telegram Link (Mobile Persistent) */}
      {!user && (
        <a 
          href={TELEGRAM_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl shadow-blue-500/40 transition-all hover:scale-110 active:scale-95 z-50 md:hidden"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.88.03-.24.36-.49 1-.74 3.91-1.7 6.52-2.82 7.82-3.37 3.71-1.56 4.48-1.83 4.98-1.83.11 0 .35.03.5.16.13.11.17.26.18.37 0 .04.01.12 0 .19z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

export default App;
