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
  const seo = t.seo_block;

  return (
    <section className="bg-warm-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">

        {/* TÍTULO (solo si existe como objeto) */}
        {typeof seo === 'object' && seo.title && (
          <h2 className="text-3xl font-serif text-gray-900">
            {seo.title}
          </h2>
        )}

        {/* DESCRIPCIÓN (objeto o string) */}
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
          {typeof seo === 'string' ? seo : seo.description}
        </p>

      </div>
    </section>
  );
};

export default SEOBlock;
