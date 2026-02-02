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
    { icon: '🎂', label: t.case_birthday },
    { icon: '❤️', label: t.case_love },
    { icon: '👨‍👩‍👧‍👦', label: t.case_family },
    { icon: '🕊️', label: t.case_memorial },
    { icon: '🎁', label: t.case_unique },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">
            {t.use_cases_title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.use_cases_desc}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="
                group
                bg-warm-white
                rounded-2xl
                p-8
                text-center
                shadow-sm
                transition-all duration-300
                hover:shadow-xl
                hover:-translate-y-2
              "
            >
              <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              <p className="font-serif text-sm text-gray-900">
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
