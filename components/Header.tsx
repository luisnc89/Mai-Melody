
import React from 'react';
import { Section, Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentSection: Section;
  setSection: (s: Section) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentSection, 
  setSection, 
  language, 
  setLanguage,
  isAuthenticated
}) => {
  const t = translations[language];

  return (
    <header className="fixed top-0 w-full z-50 bg-warm-white/80 backdrop-blur-md shadow-sm border-b border-violet-100/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="text-2xl font-serif italic font-bold text-gray-800 cursor-pointer tracking-tight flex items-center gap-2 group"
          onClick={() => setSection('inicio')}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span className="text-3xl text-violet-500 group-hover:rotate-12 transition-transform duration-500 relative z-10">🦋</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-pink-200 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-violet-700 via-pink-600 to-violet-700 bg-[length:200%_auto] hover:bg-[100%_center] transition-all duration-700 bg-clip-text text-transparent text-3xl leading-none">MaiMelody</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold -mt-0.5 ml-0.5">Songs for Special Moments</span>
          </div>
        </div>

        <nav className="hidden lg:flex space-x-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">
          <button 
            onClick={() => setSection('inicio')}
            className={`hover:text-violet-600 transition-colors relative pb-1 ${currentSection === 'inicio' ? 'text-violet-600' : ''}`}
          >
            {t.nav_home}
            {currentSection === 'inicio' && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow"></div>}
          </button>
          <button 
            onClick={() => setSection('crea')}
            className={`hover:text-violet-600 transition-colors relative pb-1 ${currentSection === 'crea' ? 'text-violet-600' : ''}`}
          >
            {t.nav_create}
            {currentSection === 'crea' && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow"></div>}
          </button>
          <button 
            onClick={() => setSection('funciona')}
            className={`hover:text-violet-600 transition-colors relative pb-1 ${currentSection === 'funciona' ? 'text-violet-600' : ''}`}
          >
            {t.nav_how}
            {currentSection === 'funciona' && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow"></div>}
          </button>
          <button 
            onClick={() => setSection('blog')}
            className={`hover:text-violet-600 transition-colors relative pb-1 ${currentSection === 'blog' || currentSection === 'blog-post' ? 'text-violet-600' : ''}`}
          >
            {t.nav_blog}
            {(currentSection === 'blog' || currentSection === 'blog-post') && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow"></div>}
          </button>
          {isAuthenticated ? (
            <button 
              onClick={() => setSection('admin')}
              className={`hover:text-violet-600 transition-colors relative pb-1 ${currentSection === 'admin' ? 'text-violet-600' : ''}`}
            >
              {t.nav_admin}
              {currentSection === 'admin' && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow"></div>}
            </button>
          ) : (
            <button 
              onClick={() => setSection('login')}
              className={`hover:text-violet-600 transition-colors relative pb-1 ${currentSection === 'login' ? 'text-violet-600' : ''}`}
            >
              Login
            </button>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs font-semibold border-none focus:ring-0 cursor-pointer text-violet-700 hover:text-violet-900 transition-colors"
          >
            <option value="es">ES</option>
            <option value="ca">CAT</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="it">IT</option>
          </select>
          <button 
            onClick={() => setSection('crea')}
            className="lg:hidden p-2 text-violet-600"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
