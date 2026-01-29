import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

interface HowItWorksProps {
  language: Language;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ language }) => {
  const t = translations[language];
  const navigate = useNavigate();

  const steps = [
    { title: t.how_step1_title, desc: t.how_step1_desc, icon: '📝' },
    { title: t.how_step2_title, desc: t.how_step2_desc, icon: '💳' },
    { title: t.how_step3_title, desc: t.how_step3_desc, icon: '♪' },
    { title: t.how_step4_title, desc: t.how_step4_desc, icon: '🎬' },
    { title: t.how_step5_title, desc: t.how_step5_desc, icon: '🎁' }
  ];

  return (
    <section
      id="funciona"
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
                <div className="w-28 h-28 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(139,92,246,0.06)] flex items-center justify-center text-4xl transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-violet-200/50 border border-violet-50">
                  <span className="group-hover:rotate-12 transition-transform duration-300">
                    {step.icon}
                  </span>
                </div>

                <div className="absolute -top-2 -right-2 w-8 h-8 bg-violet-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">
                  {idx + 1}
                </div>
              </div>

              <div className="text-center space-y-3 px-2">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                  PASO {idx + 1}
                </span>
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
            onClick={() => navigate('/crear')}
            className="group relative inline-flex items-center gap-3 bg-gray-900 text-white px-12 py-5 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 multi-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">{t.hero_cta}</span>
            <svg
              className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
