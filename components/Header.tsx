
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (l: Language) => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  isAuthenticated
}) => {
  const t = translations[language];
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === '/blog' && location.pathname.startsWith('/blog'));

  return (
    <header className="fixed top-0 w-full z-50 bg-warm-white/80 backdrop-blur-md shadow-sm border-b border-violet-100/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-serif italic font-bold text-gray-800 cursor-pointer tracking-tight flex items-center gap-2 group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span className="text-3xl text-violet-500 group-hover:rotate-12 transition-transform duration-500 relative z-10">🦋</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-pink-200 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-violet-700 via-pink-600 to-violet-700 bg-[length:200%_auto] hover:bg-[100%_center] transition-all duration-700 bg-clip-text text-transparent text-3xl leading-none">
              MaiMelody
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold -mt-0.5 ml-0.5">
              Songs for Special Moments
            </span>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden lg:flex space-x-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">

          <Link
            to="/"
            className={`hover:text-violet-600 transition-colors relative pb-1 ${isActive('/') ? 'text-violet-600' : ''}`}
          >
            {t.nav_home}
            {isActive('/') && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow" />}
          </Link>

          <Link
            to="/crea"
            className={`hover:text-violet-600 transition-colors relative pb-1 ${isActive('/crea') ? 'text-violet-600' : ''}`}
          >
            {t.nav_create}
            {isActive('/crea') && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow" />}
          </Link>

          <Link
            to="/como-funciona"
            className={`hover:text-violet-600 transition-colors relative pb-1 ${isActive('/como-funciona') ? 'text-violet-600' : ''}`}
          >
            {t.nav_how}
            {isActive('/como-funciona') && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow" />}
          </Link>

          <Link
            to="/blog"
            className={`hover:text-violet-600 transition-colors relative pb-1 ${isActive('/blog') ? 'text-violet-600' : ''}`}
          >
            {t.nav_blog}
            {isActive('/blog') && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow" />}
          </Link>

          {isAuthenticated && (
            <Link
              to="/admin"
              className={`hover:text-violet-600 transition-colors relative pb-1 ${isActive('/admin') ? 'text-violet-600' : ''}`}
            >
              {t.nav_admin}
              {isActive('/admin') && <div className="absolute bottom-0 left-0 w-full h-0.5 multi-glow" />}
            </Link>
          )}
        </nav>

        {/* LANGUAGE */}
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
        </div>

      </div>
    </header>
  );
};

export default Header;

