import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';
import { ROUTE_SLUGS } from '../routes/slugs';

/* =========================
   🌍 Idiomas soportados
========================= */
const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const HowItWorks: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const navigate = useNavigate();

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es';

  const t = translations[language];

  const steps = [
    { title: t.how_step1_title, desc: t.how_step1_desc, icon: '📝' },
    { title: t.how_step2_title, desc: t.how_step2_desc, icon: '💳' },
    { title: t.how_step3_title, desc: t.how_step3_desc, icon: '♪' },
    { title: t.how_step4_title, desc: t.how_step4_desc, icon: '🎬' },
    { title: t.how_step5_title, desc: t.how_step5_desc, icon: '🎁' },
  ];

  /* 👉 CTA SIEMPRE A /[lang]/packs */
  const goToPacks = () => {
    navigate(`/${language}/${ROUTE_SLUGS.packs[language]}`);
  };

  return (
    <section
      id="how-it-works"
      className="py-24 px-4 bg-warm-white relative overflow-hidden scroll-mt-24"
    >
      {/* Decoraciones */}
      <div className="absolute top-1/4 right-10 text-[12rem] text-violet-100/40 select-none font-serif -z-10">
        ♬
      </div>
      <div className="absolute bottom-10 left-10 text-4xl butterfly-float text-violet-300/30">
        🦋
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Título */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl lg:text-7xl font-serif text-gray-900">
            {t.how_title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {t.how_subtitle}
          </p>
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 relative">
          <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-px border-t border-dashed border-violet-200 -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="relative mb-6">
                <div className="w-28 h-28 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(139,92,246,0.06)] flex items-center justify-center text-4xl transition-transform group-hover:scale-110 border border-violet-50">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-violet-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </div>
              </div>

              <div className="text-center space-y-3 px-2">
                <h3 className="text-lg font-serif font-bold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <button
            onClick={goToPacks}
            className="relative group overflow-hidden bg-gray-900 text-white px-12 py-5 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-2xl"
          >
            <div className="absolute inset-0 multi-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">
              {t.hero_cta}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
