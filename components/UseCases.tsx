
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface UseCasesProps {
  language: Language;
}

const UseCases: React.FC<UseCasesProps> = ({ language }) => {
  const t = translations[language];

  const cases = [
    { title: t.case_birthday, icon: '🎂' },
    { title: t.case_love, icon: '❤️' },
    { title: t.case_family, icon: '👨‍👩‍👧‍👦' },
    { title: t.case_memorial, icon: '🕊' },
    { title: t.case_unique, icon: '🎁' }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">{t.use_cases_title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.use_cases_desc}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {cases.map((item, idx) => (
            <div key={idx} className="bg-warm-white p-8 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center group">
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300 block">{item.icon}</div>
              <h4 className="font-serif text-lg leading-tight text-gray-800">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
