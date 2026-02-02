import React from 'react';
import { useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

/* =========================
   🌍 Idiomas soportados
========================= */
const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const SEOBlock: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es';

  const t = translations[language];

  return (
    <div className="bg-warm-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
          {t.seo_block}
        </p>
      </div>
    </div>
  );
};

export default SEOBlock;
