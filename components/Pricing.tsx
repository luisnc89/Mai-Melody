import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';
import { ROUTE_SLUGS, PACK_SLUGS } from '../routes/slugs';

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: Language }>();

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es';

  const t = translations[language];

  const goToPack = (pack: 'basico' | 'emocion' | 'artistico') => {
    navigate(`/${language}/${ROUTE_SLUGS.create[language]}/${PACK_SLUGS[pack][language]}`);
  };

  return (
    <section className="py-28 px-4 bg-warm-white">
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">
            {t.pricing_title}
          </h2>
          <p className="text-gray-600">
            {t.pricing_desc}
          </p>
        </div>

        {/* PACKS */}
        <div className="grid lg:grid-cols-3 gap-10 items-stretch">

          {/* PACK BÁSICO */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl flex flex-col">
            <h3 className="text-2xl font-serif mb-4">
              {t.pack_basico}
            </h3>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">25€</span>
              <span className="text-sm text-gray-500 ml-2">
                {t.iva_included}
              </span>
            </div>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✓ {t.feature_2songs}</li>
              <li>✓ {t.delivery_24}</li>
              <li>✓ {t.feature_audio}</li>
            </ul>

            <button
              onClick={() => goToPack('basico')}
              className="mt-auto border-2 border-gray-900 rounded-full py-4 font-semibold hover:bg-gray-900 hover:text-white transition"
            >
              {t.select_pack}
            </button>
          </div>

          {/* PACK EMOCIÓN (DESTACADO) */}
          <div className="relative bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-violet-400 flex flex-col scale-[1.03]">

            {/* BADGE */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <span className="bg-violet-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow">
                {t.pricing_popular}
              </span>
            </div>

            <h3 className="text-2xl font-serif mb-4">
              {t.pack_emocion}
            </h3>

            <div className="mb-6">
              <span className="text-4xl font-bold text-violet-700">39€</span>
              <span className="text-sm text-gray-500 ml-2">
                {t.iva_included}
              </span>
            </div>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✓ {t.feature_2songs}</li>
              <li>✓ {t.feature_video}</li>
              <li>✓ {t.delivery_72}</li>
            </ul>

            <button
              onClick={() => goToPack('emocion')}
              className="mt-auto bg-gray-900 text-white rounded-full py-4 font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              {t.select_pack}
            </button>
          </div>

          {/* PACK ARTÍSTICO */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gold flex flex-col">
            <h3 className="text-2xl font-serif mb-4">
              {t.pack_artistico}
            </h3>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">49€</span>
              <span className="text-sm text-gray-500 ml-2">
                {t.iva_included}
              </span>
            </div>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✓ {t.feature_2songs}</li>
              <li>✓ {t.feature_artistic}</li>
              <li>✓ {t.delivery_72}</li>
            </ul>

            <button
              onClick={() => goToPack('artistico')}
              className="mt-auto border-2 border-gray-900 rounded-full py-4 font-semibold hover:bg-gray-900 hover:text-white transition"
            >
              {t.select_pack}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;
