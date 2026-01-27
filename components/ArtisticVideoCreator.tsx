
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface ArtisticVideoCreatorProps {
  language: Language;
  onContinueToOrder?: (style: string) => void;
}

const ArtisticVideoCreator: React.FC<ArtisticVideoCreatorProps> = ({ language, onContinueToOrder }) => {
  const t = translations[language];
  const [activeStyle, setActiveStyle] = useState<string>('original');

  const styleImages: Record<string, string> = {
    original: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800&h=1000",
    watercolor: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=800&h=1000",
    anime: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800&h=1000",
    cartoon: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800&h=1000",
    cartoon2: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800&h=1000",
    pencil: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800&h=1000",
    comic: "https://images.unsplash.com/photo-1560932734-78065a7f920f?auto=format&fit=crop&q=80&w=800&h=1000",
    bw: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800&h=1000"
  };

  const styles = [
    { id: 'watercolor', name: t.style_watercolor, icon: '🎨' },
    { id: 'anime', name: t.style_anime, icon: '🌸' },
    { id: 'cartoon', name: t.style_cartoon, icon: '🏰' },
    { id: 'pencil', name: t.style_pencil, icon: '✏️' },
    { id: 'cartoon2', name: t.style_cartoon, icon: '✨' },
    { id: 'comic', name: t.style_comic, icon: '💥' },
    { id: 'bw', name: t.style_bw_art, icon: '🖤' }
  ];

  return (
    <section id="video-ia" className="py-24 px-4 bg-white overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1 bg-gold text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-gold/20">
            <span>{t.artistic_badge}</span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span className="text-white/90">Ejemplos</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight">
            {t.artistic_title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {t.artistic_desc}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-warm-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-2xl font-serif font-bold text-gray-800">{t.artistic_compare_title}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveStyle('original')}
                  className={`p-5 rounded-2xl border-2 transition-all flex items-center space-x-4 text-left group ${
                    activeStyle === 'original' 
                      ? 'border-gray-900 bg-gray-900 text-white shadow-xl' 
                      : 'border-gray-100 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">📸</span>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">Base</span>
                    <span className="text-sm font-bold">{t.artistic_original_label}</span>
                  </div>
                </button>

                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setActiveStyle(style.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex items-center space-x-4 text-left group ${
                      activeStyle === style.id 
                        ? 'border-gold bg-gold/5 shadow-md shadow-gold/10' 
                        : 'border-gray-100 bg-white hover:border-gold/30'
                    }`}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{style.icon}</span>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gold opacity-80">{t.artistic_style_label}</span>
                      <span className="text-sm font-bold text-gray-800">{style.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic leading-relaxed">
                  {t.artistic_quote}
                </p>
              </div>

              <button 
                onClick={() => onContinueToOrder?.(activeStyle)}
                className="w-full bg-gray-900 text-white py-5 rounded-full font-bold text-lg hover:bg-gold transition-all shadow-xl shadow-gray-900/10"
              >
                {t.artistic_cta}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative bg-gray-50 rounded-[4rem] p-4 lg:p-8 flex items-center justify-center overflow-hidden shadow-inner border border-gray-100 min-h-[600px]">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30 -z-10"></div>
              
              <div className="w-full max-w-[500px] space-y-6 relative group">
                <div className="flex justify-between items-center px-6">
                  <div className="flex items-center space-x-3">
                    <span className={`w-2 h-2 rounded-full ${activeStyle === 'original' ? 'bg-blue-400' : 'bg-gold animate-pulse'}`}></span>
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">
                      {activeStyle === 'original' ? t.artistic_preview_original : `${t.artistic_preview_style}: ${styles.find(s => s.id === activeStyle)?.name}`}
                    </p>
                  </div>
                  {activeStyle !== 'original' && (
                    <span className="text-[10px] font-bold text-gold bg-gold/10 px-3 py-1 rounded-full uppercase">{t.artistic_digital_art}</span>
                  )}
                </div>

                <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.12)] border-[12px] border-white bg-white group">
                  <img 
                    key={activeStyle}
                    src={styleImages[activeStyle]} 
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" 
                    alt={activeStyle} 
                  />
                  
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-2xl border border-white/50">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                      {activeStyle === 'original' ? 'Original' : styles.find(s => s.id === activeStyle)?.name}
                    </span>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold rounded-full flex items-center justify-center text-white text-3xl shadow-2xl animate-bounce duration-[4000ms] border-4 border-white">
                  ✨
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lavender/10 rounded-xl flex items-center justify-center text-lavender text-xl">🎵</div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{t.artistic_accompanies_label}</p>
                      <p className="text-xs font-bold text-gray-800">{t.artistic_accompanies}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisticVideoCreator;
