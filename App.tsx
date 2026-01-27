
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
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
import { Section, Language, PackType, BlogPost } from './types';
import { translations } from './translations';

const ButterflyDecoration = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
    <div className="absolute top-[10%] left-[5%] butterfly-float text-violet-500/30 text-4xl">🦋</div>
    <div className="absolute top-[30%] right-[8%] butterfly-float text-pink-400/20 text-3xl" style={{ animationDelay: '1s' }}>🦋</div>
    <div className="absolute bottom-[20%] left-[10%] butterfly-float text-blue-400/20 text-5xl" style={{ animationDelay: '2s' }}>🦋</div>
    <div className="absolute top-[60%] right-[15%] butterfly-float text-violet-400/30 text-2xl" style={{ animationDelay: '3.5s' }}>🦋</div>
    <div className="absolute bottom-[10%] right-[5%] butterfly-float text-pink-500/20 text-4xl" style={{ animationDelay: '5s' }}>🦋</div>
    <div className="absolute top-[45%] left-[12%] butterfly-float text-violet-300/25 text-3xl" style={{ animationDelay: '1.5s' }}>🦋</div>
    <div className="absolute bottom-[40%] right-[20%] butterfly-float text-blue-300/20 text-2xl" style={{ animationDelay: '4s' }}>🦋</div>
    <div className="absolute top-[75%] left-[30%] butterfly-float text-pink-300/20 text-3xl" style={{ animationDelay: '0.5s' }}>🦋</div>
  </div>
);

const NoteDecoration = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute note-drift text-violet-300 text-2xl" style={{ left: '15%', animationDelay: '0s', animationDuration: '15s' }}>♪</div>
    <div className="absolute note-drift text-pink-200 text-3xl" style={{ left: '45%', animationDelay: '4s', animationDuration: '18s' }}>♫</div>
    <div className="absolute note-drift text-blue-200 text-xl" style={{ left: '75%', animationDelay: '8s', animationDuration: '14s' }}>♬</div>
    <div className="absolute note-drift text-violet-200 text-2xl" style={{ left: '85%', animationDelay: '2s', animationDuration: '20s' }}>♩</div>
    <div className="absolute note-drift text-gold/30 text-3xl" style={{ left: '5%', animationDelay: '6s', animationDuration: '25s' }}>∮</div>
    <div className="absolute note-drift text-violet-300/40 text-2xl" style={{ left: '30%', animationDelay: '10s', animationDuration: '22s' }}>♬</div>
    <div className="absolute note-drift text-pink-300/30 text-4xl" style={{ left: '60%', animationDelay: '1s', animationDuration: '16s' }}>♫</div>
    <div className="absolute note-drift text-blue-300/30 text-xl" style={{ left: '95%', animationDelay: '12s', animationDuration: '19s' }}>♪</div>
  </div>
);

const App: React.FC = () => {
  const [currentSection, setSection] = useState<Section>('inicio');
  const [language, setLanguage] = useState<Language>('es');
  const [isPackSelected, setIsPackSelected] = useState(false);
  const [selectedPack, setSelectedPack] = useState<PackType>('basico');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const t = translations[language];

  // Logic to redirect to login if unauthorized for admin
  useEffect(() => {
    if (currentSection === 'admin' && !isAuthenticated) {
      setSection('login');
    }
  }, [currentSection, isAuthenticated]);

useEffect(() => {
  if (window.location.pathname === '/admin') {
    setSection('login');
  }
}, []);

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setIsPackSelected(false);
    setActivePost(null);
    if (s === 'video-ia') {
      const el = document.getElementById('video-ia');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePostClick = (post: BlogPost) => {
    setActivePost(post);
    setSection('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setSection('admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSection('inicio');
  };

  const handlePackSelected = (pack: PackType) => {
    setSelectedPack(pack);
    setIsPackSelected(true);
    setSection('crea');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCreating = () => {
    setSection('crea');
    setIsPackSelected(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative bg-warm-white">
      <ButterflyDecoration />
      <NoteDecoration />
      
      <Header 
        currentSection={currentSection} 
        setSection={handleSectionChange} 
        language={language} 
        setLanguage={setLanguage} 
        isAuthenticated={isAuthenticated}
      />

<main className="relative z-10">
  <Routes>

    {/* HOME */}
    <Route path="/" element={
      <>
        <Hero 
          language={language} 
          onCtaClick={handleStartCreating} 
          onSecondaryCtaClick={() => handleSectionChange('video-ia')}
        />
        <UseCases language={language} />

        <div className="relative py-16 text-center italic text-gray-500 font-serif text-2xl overflow-hidden">
          <div className="absolute inset-0 bg-violet-100/30"></div>
          <div className="relative z-10">{t.quote}</div>
          <div className="absolute top-2 left-1/4 text-violet-400/20 text-4xl butterfly-float">🦋</div>
          <div className="absolute bottom-2 right-1/4 text-pink-400/20 text-3xl butterfly-float" style={{ animationDelay: '2s' }}>🦋</div>
        </div>

        <ArtisticVideoCreator 
          language={language} 
          onContinueToOrder={() => handlePackSelected('artistico')}
        />

        <Examples language={language} onCtaClick={handleStartCreating} />
        <HowItWorks language={language} onCtaClick={handleStartCreating} />
        <Testimonials language={language} />
        <SEOBlock language={language} />
      </>
    } />

    {/* BLOG */}
    <Route path="/blog" element={
      <Blog language={language} onPostClick={handlePostClick} />
    } />

    {/* ADMIN (OCULTO) */}
    <Route path="/admin" element={
      isAuthenticated ? (
        <Admin language={language} onLogout={handleLogout} />
      ) : (
        <Login language={language} onLogin={handleLogin} />
      )
    } />

    {/* CUALQUIER OTRA RUTA */}
    <Route path="*" element={<Navigate to="/" />} />

  </Routes>
</main>

      <footer className="bg-gray-900 text-white py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col">
            <div className="text-3xl font-serif italic tracking-widest text-violet-300">MaiMelody</div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Songs for Special Moments</div>
          </div>
          <div className="flex space-x-8 text-sm text-gray-400">
            <button className="hover:text-violet-300 transition-colors">{t.footer_terms}</button>
            <button className="hover:text-violet-300 transition-colors">{t.footer_privacy}</button>
            <button className="hover:text-violet-300 transition-colors">{t.footer_contact}</button>
            <button className="hover:text-violet-300 transition-colors">{t.footer_faq}</button>
          </div>
          <div className="text-gray-500 text-xs text-center md:text-right">
            {t.footer_copyright}
          </div>
        </div>
      </footer>

      <ChatBot language={language} />
    </div>
  );
};

export default App;
