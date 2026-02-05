import React from 'react';
import { useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const UseCases: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es';

  const t = translations[language];

  const cases = [
    { icon: '🎂', label: t.case_birthday, bg: 'bg-pink-50' },
    { icon: '❤️', label: t.case_love, bg: 'bg-rose-50' },
    { icon: '👨‍👩‍👧‍👦', label: t.case_family, bg: 'bg-amber-50' },
    { icon: '🕊️', label: t.case_memorial, bg: 'bg-slate-50' },
    { icon: '🎁', label: t.case_unique, bg: 'bg-violet-50' },
    { icon: '💍', label: t.case_wedding, bg: 'bg-indigo-50' },
  ];

  return (
    <section className="py-24 px-4 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">
            {t.use_cases_title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.use_cases_desc}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="
                group
                bg-white
                rounded-2xl
                px-6 py-8
                text-center
                shadow-sm
                transition-all duration-300
                hover:shadow-xl
                hover:-translate-y-2
              "
            >
              {/* ICONO */}
              <div className="flex justify-center mb-5">
                <div
                  className={`
                    w-14 h-14
                    rounded-full
                    flex items-center justify-center
                    text-2xl
                    ${item.bg}
                    transition-transform duration-300
                    group-hover:scale-110
                  `}
                >
                  {item.icon}
                </div>
              </div>

              {/* TEXTO */}
              <p className="font-serif text-sm text-gray-900 leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UseCases;
