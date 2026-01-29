import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroProps {
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ language }) => {
  const t = translations[language];
  const navigate = useNavigate();

  const benefits = [
    t.benefit_1,
    t.benefit_2,
    t.benefit_3,
    t.benefit_4,
  ];

  const goToBasicPack = () => {
    navigate('/crear/basico');
  };

  const goToEmotionPack = () => {
    navigate('/crear/emocion');
  };

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">

        {/* TEXTO IZQUIERDA */}
        <div className="lg:w-1/2 space-y-8 fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            <span>🦋 MaiMelody Magic</span>
          </div>

          <h1 className="text-5xl lg:text-7xl leading-tight font-serif text-gray-900">
            {t.hero_h1}
          </h1>

          <p className="text-xl text-violet-600 font-medium flex items-center gap-2">
            <span className="text-2xl">♪</span> {t.hero_sub}
          </p>

          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            {t.hero_desc}
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={goToBasicPack}
              className="relative group overflow-hidden bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              <div className="absolute inset-0 multi-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">
                🎵 Crea tu canción
              </span>
            </button>

            <button
              onClick={goToEmotionPack}
              className="bg-transparent text-gray-900 border-2 border-violet-200 px-10 py-5 rounded-full text-lg font-semibold hover:border-violet-400 hover:bg-violet-50 transition-all transform hover:scale-105"
            >
              🎬 Crear tu Vídeo
            </button>
          </div>

          {/* BENEFICIOS */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-4">
            {benefits.map((benefit, i) => (
              <li
                key={i}
                className="flex items-center space-x-2 text-sm text-gray-600 font-medium"
              >
                <svg
                  className="w-5 h-5 text-violet-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* IMÁGENES DERECHA */}
        <div className="lg:w-1/2 relative">
          <div className="absolute -top-10 -left-10 text-violet-400/40 text-6xl butterfly-float">🦋</div>
          <div className="absolute -bottom-10 -right-10 text-pink-400/40 text-6xl butterfly-float">🦋</div>

          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <img
                src="/assets/hero/pareja.png"
                alt="Pareja escuchando su canción"
                className="rounded-3xl shadow-lg object-cover w-full h-[420px] hover:scale-[1.02] transition-transform duration-500"
              />

              <img
                src="/assets/hero/television.png"
                alt="Familia reviviendo recuerdos"
                className="rounded-3xl shadow-lg object-cover w-full h-[420px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            <div className="flex items-center">
              <img
                src="/assets/hero/fiesta.png"
                alt="Concierto y emoción musical"
                className="rounded-3xl shadow-lg object-cover w-full h-[600px] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -z-10 -bottom-20 -left-20 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
