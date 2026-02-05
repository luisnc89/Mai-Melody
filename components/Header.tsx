import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';
import { ROUTE_SLUGS } from '../routes/slugs';
import { getPackFromSlug, getPackSlug } from '../routes/packSlugs';

interface HeaderProps {
  isAuthenticated: boolean;
}

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const { lang } = useParams<{ lang: Language }>();
  const location = useLocation();
  const navigate = useNavigate();

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es';

  const t = translations[language];

  /* =========================
     📱 Estado menú móvil
  ========================= */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* =========================
     🔗 Helpers de rutas
  ========================= */
  const withLang = (slug: string) =>
    slug ? `/${language}/${slug}` : `/${language}`;

  const isActive = (slug: string) => {
    const path = withLang(slug);
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + '/')
    );
  };

  /* =========================
     🌍 Cambio de idioma (FIX)
  ========================= */
  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language) return;

    const segments = location.pathname.split('/').filter(Boolean);
    segments[0] = newLang;

    // /crear/:pack
    if (segments[1] === ROUTE_SLUGS.create[language] && segments[2]) {
      const pack = getPackFromSlug(segments[2], language);
      if (pack) {
        segments[1] = ROUTE_SLUGS.create[newLang];
        segments[2] = getPackSlug(pack, newLang);
      }
    }

    setMobileOpen(false);
    navigate('/' + segments.join('/'));
  };

  /* =========================
     📦 Links del menú
  ========================= */
  const navLinks = (
    <>
      <Link
        to={withLang('')}
        onClick={() => setMobileOpen(false)}
        className={isActive('') ? 'text-violet-600' : ''}
      >
        {t.nav_home}
      </Link>

      <Link
        to={withLang(ROUTE_SLUGS.packs[language])}
        onClick={() => setMobileOpen(false)}
        className={isActive(ROUTE_SLUGS.packs[language]) ? 'text-violet-600' : ''}
      >
        {t.nav_create}
      </Link>

      <Link
        to={withLang(ROUTE_SLUGS.how[language])}
        onClick={() => setMobileOpen(false)}
        className={isActive(ROUTE_SLUGS.how[language]) ? 'text-violet-600' : ''}
      >
        {t.nav_how}
      </Link>

      <Link
        to={withLang(ROUTE_SLUGS.blog[language])}
        onClick={() => setMobileOpen(false)}
        className={isActive(ROUTE_SLUGS.blog[language]) ? 'text-violet-600' : ''}
      >
        {t.nav_blog}
      </Link>

      {isAuthenticated && (
        <Link
          to={withLang(ROUTE_SLUGS.admin[language])}
          onClick={() => setMobileOpen(false)}
          className={isActive(ROUTE_SLUGS.admin[language]) ? 'text-violet-600' : ''}
        >
          {t.nav_admin}
        </Link>
      )}
    </>
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-warm-white/80 backdrop-blur-md shadow-sm border-b border-violet-100/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to={`/${language}`} className="flex items-center gap-3">
          <span className="text-3xl">🦋</span>
          <div>
            <div className="text-2xl font-serif italic font-bold text-violet-700">
              MaiMelody
            </div>
            <div className="text-[10px] tracking-widest text-gray-400 uppercase">
              Songs for special moments
            </div>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden lg:flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-600">
          {navLinks}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* LANGUAGE SELECT */}
          <select
            value={language}
            onChange={(e) =>
              handleLanguageChange(e.target.value as Language)
            }
            className="bg-transparent text-xs font-bold text-violet-700 cursor-pointer"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="ca">CA</option>
            <option value="fr">FR</option>
            <option value="it">IT</option>
          </select>

          {/* HAMBURGER */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-3xl text-violet-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MENU MÓVIL */}
      {mobileOpen && (
        <div className="lg:hidden bg-warm-white border-t border-violet-100 shadow-md">
          <nav className="flex flex-col gap-6 px-6 py-8 text-sm font-bold uppercase tracking-widest text-gray-700">
            {navLinks}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
