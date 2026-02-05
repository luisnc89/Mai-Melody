import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';
import { ROUTE_SLUGS } from '../routes/slugs';

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const PACK_SLUGS: Record<Language, { basico: string; artistico: string }> = {
  es: { basico: 'basico', artistico: 'artistico' },
  en: { basico: 'basic', artistico: 'artistic' },
  ca: { basico: 'basic', artistico: 'artistic' },
  fr: { basico: 'basique', artistico: 'artistique' },
  it: { basico: 'base', artistico: 'artistico' },
};

const Hero: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const navigate = useNavigate();

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es';

  const t = translations[language];

  return (
    <section className="relative pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* TEXTO */}
        <div className="space-y-8">

          {/* TITULAR */}
          <h1 className="text-5xl lg:text-7xl font-serif leading-tight text-gray-900">
            {t.hero_h1}
          </h1>

          {/* SUBTÍTULO */}
          <p className="text-xl text-violet-600 font-medium">
            ♪ {t.hero_sub}
          </p>

          {/* DESCRIPCIÓN */}
          <p className="text-lg text-gray-600 max-w-lg">
            {t.hero_desc}
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-5 pt-2">

            {/* CTA PRINCIPAL */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/${language}/${ROUTE_SLUGS.create[language]}/${PACK_SLUGS[language].basico}`
                )
              }
              className="
                relative group
                overflow-hidden
                bg-gray-900
                text-white
                px-10 py-5
                rounded-full
                text-lg font-semibold
                transition-all
                transform hover:scale-105
                shadow-xl
                flex items-center justify-center gap-2
              "
            >
              <div className="absolute inset-0 multi-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">
                🎵 Crea tu canción
              </span>
            </button>

            {/* CTA SECUNDARIO */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/${language}/${ROUTE_SLUGS.create[language]}/${PACK_SLUGS[language].artistico}`
                )
              }
              className="
                border-2 border-violet-300
                text-gray-900
                px-10 py-5
                rounded-full
                text-lg font-semibold
                hover:bg-violet-50 hover:scale-105
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              🎬 Crea tu vídeo
            </button>
          </div>

          {/* BENEFICIOS */}
          <ul className="grid grid-cols-2 gap-3 text-sm text-gray-600 pt-6">
            <li>✔ {t.benefit_1}</li>
            <li>✔ {t.benefit_2}</li>
            <li>✔ {t.benefit_3}</li>
            <li>✔ {t.benefit_4}</li>
          </ul>
        </div>

        {/* IMÁGENES */}
        <div className="grid grid-cols-2 gap-6 items-stretch">

          {/* Izquierda */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/assets/hero/pareja.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/assets/hero/television.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center">
            <div className="aspect-[3/5] w-full rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/assets/hero/fiesta.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
