import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import CreationForm from './components/CreationForm';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import Examples from './components/Examples';
import Testimonials from './components/Testimonials';
import SEOBlock from './components/SEOBlock';
import ChatBot from './components/ChatBot';
import ArtisticVideoCreator from './components/ArtisticVideoCreator';
import Blog from './components/Blog';
import BlogPostDetail from './components/BlogPost';
import Login from './components/Login';
import Admin from './components/Admin';
import { AdminRoute } from './components/AdminRoute';

import { Language } from './types';
import { ROUTE_SLUGS } from './routes/slugs';

/* =========================
   🌍 Idiomas soportados
========================= */
const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

/* =========================
   🎨 Decoraciones (SE MANTIENEN)
========================= */
const ButterflyDecoration = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
    <div className="absolute top-[10%] left-[5%] butterfly-float text-violet-500/30 text-4xl">🦋</div>
    <div className="absolute top-[30%] right-[8%] butterfly-float text-pink-400/20 text-3xl">🦋</div>
  </div>
);

const NoteDecoration = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute note-drift text-violet-300 text-2xl" style={{ left: '15%' }}>♪</div>
  </div>
);

/* =========================
   🧱 Layout con idioma
========================= */
const LanguageLayout: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es';

  // Si el idioma no es válido → redirigir
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
    return <Navigate to="/es" replace />;
  }

  return (
    <div className="min-h-screen relative bg-warm-white">
      {/* Decoraciones originales */}
      <ButterflyDecoration />
      <NoteDecoration />

      {/* Header (no se toca aún) */}
      <Header isAuthenticated={false} />

      <main className="relative z-10 pt-20">
        <Routes>

          {/* HOME (IDÉNTICA A LA TUYA) */}
          <Route
            index
            element={
              <>
                <Hero />
                <UseCases />
                <ArtisticVideoCreator />
                <Examples />
                <HowItWorks />
                <Testimonials />
                <SEOBlock />
              </>
            }
          />

          {/* PACKS */}
          <Route
            path={ROUTE_SLUGS.packs[language]}
            element={<Pricing />}
          />

          {/* CREAR */}
          <Route
            path={`${ROUTE_SLUGS.create[language]}/:pack`}
            element={<CreationForm />}
          />

          {/* CÓMO FUNCIONA */}
          <Route
            path={ROUTE_SLUGS.how[language]}
            element={<HowItWorks />}
          />

          {/* BLOG */}
          <Route
            path={ROUTE_SLUGS.blog[language]}
            element={<Blog />}
          />

          <Route
            path={`${ROUTE_SLUGS.blog[language]}/:slug`}
            element={<BlogPostDetail />}
          />

          {/* =========================
             🔐 ADMIN (CAMBIO CLAVE)
             Antes: /admin → Login
             Ahora:
             /admin/login → Login
             /admin → Admin protegido
          ========================= */}

          {/* LOGIN ADMIN */}
          <Route
            path={`${ROUTE_SLUGS.admin[language]}/login`}
            element={<Login />}
          />

          {/* PANEL ADMIN (PROTEGIDO) */}
          <Route
            path={ROUTE_SLUGS.admin[language]}
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to={`/${language}`} replace />}
          />

        </Routes>
      </main>

      <ChatBot />
    </div>
  );
};

/* =========================
   🚀 App principal
========================= */
const App: React.FC = () => {
  return (
    <Routes>
      {/* / → /es */}
      <Route path="/" element={<Navigate to="/es" replace />} />

      {/* Idiomas */}
      <Route path="/:lang/*" element={<LanguageLayout />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/es" replace />} />
    </Routes>
  );
};

export default App;
