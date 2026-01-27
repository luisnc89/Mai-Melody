
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import Admin from './components/Admin';
import Login from './components/Login';

import { Language, PackType, BlogPost } from './types';
import { translations } from './translations';

/* DECORACIONES (NO LAS TOCO) */
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

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPackSelected, setIsPackSelected] = useState(false);
  const [selectedPack, setSelectedPack] = useState<PackType>('basico');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const t = translations[language];

  const handleLogin = (success: boolean) => {
    if (success) setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen relative bg-warm-white">
      <ButterflyDecoration />
      <NoteDecoration />

      <Header
        language={language}
        setLanguage={setLanguage}
        isAuthenticated={isAuthenticated}
      />

      <main className="relative z-10 pt-20">
        <Routes>

          {/* HOME */}
          <Route path="/" element={
            <>
              <Hero language={language} onCtaClick={() => {}} onSecondaryCtaClick={() => {}} />
              <UseCases language={language} />
              <ArtisticVideoCreator
                language={language}
                onContinueToOrder={() => setIsPackSelected(true)}
              />
              <Examples language={language} onCtaClick={() => {}} />
              <HowItWorks language={language} onCtaClick={() => {}} />
              <Testimonials language={language} />
              <SEOBlock language={language} />
            </>
          } />

          {/* CREAR */}
          <Route path="/crear" element={
            !isPackSelected
              ? <Pricing language={language} onPackSelected={setSelectedPack} />
              : <CreationForm language={language} selectedPack={selectedPack} />
          } />

          {/* BLOG */}
          <Route path="/blog" element={
            <Blog language={language} onPostClick={setActivePost} />
          } />

          <Route path="/blog/:slug" element={
            activePost
              ? <BlogPostDetail language={language} post={activePost} onBack={() => {}} />
              : <Navigate to="/blog" />
          } />

          {/* ADMIN OCULTO */}
          <Route
            path="/admin"
            element={
              isAuthenticated
                ? <Admin language={language} onLogout={handleLogout} />
                : <Login language={language} onLogin={handleLogin} />
            }
          />

          {/* CUALQUIER OTRA */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-400">
          {t.footer_copyright}
        </div>
      </footer>

      <ChatBot language={language} />
    </div>
  );
};

export default App;
