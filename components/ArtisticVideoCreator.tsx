import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';
import { ROUTE_SLUGS, PACK_SLUGS } from '../routes/slugs';

const ArtisticVideoCreator: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: Language }>();

  const language: Language =
    lang === 'es' || lang === 'en' || lang === 'ca' || lang === 'fr' || lang === 'it'
      ? lang
      : 'es';

  const t = translations[language];

  const [activeStyle, setActiveStyle] = useState<string>('original');

  const styleImages: Record<string, string> = {
    original: '/assets/styles/foto-original.jpg',
    watercolor: '/assets/styles/acuarela.png',
    anime: '/assets/styles/anime-2d.png',
    cartoon: '/assets/styles/cartoon-magico.png',
    pencil: '/assets/styles/lapiz.png',
    comic: '/assets/styles/comic.png',
    bw: '/assets/styles/blanco-y-negro.png',
    animation3d: '/assets/styles/animacion-3d.png',
  };

  const styles = [
    { id: 'watercolor', name: t.style_watercolor, icon: '🎨' },
    { id: 'anime', name: t.style_anime, icon: '🌸' },
    { id: 'cartoon', name: t.style_cartoon, icon: '🏰' },
    { id: 'pencil', name: t.style_pencil, icon: '✏️' },
    { id: 'comic', name: t.style_comic, icon: '💥' },
    { id: 'bw', name: t.style_bw_art, icon: '🖤' },
    { id: 'animation3d', name: t.style_animation_3d, icon: '🧊' },
  ];

  const goToArtisticPack = () => {
    navigate(
      `/${language}/${ROUTE_SLUGS.create[language]}/${PACK_SLUGS.artistico[language]}?style=${activeStyle}`
    );
  };

  return (
    <section id="video-ia" className="py-24 px-4 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-6xl font-serif text-gray-900">
            {t.artistic_title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.artistic_desc}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* SELECTOR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-warm-white p-8 rounded-[3rem] border space-y-6">

              <h3 className="text-2xl font-serif font-bold">
                {t.artistic_compare_title}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveStyle('original')}
                  className={`p-5 rounded-2xl border-2 text-left ${
                    activeStyle === 'original'
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <span className="block text-xs uppercase opacity-60">
                    BASE
                  </span>
                  <span className="font-bold">
                    {t.artistic_original_label}
                  </span>
                </button>

                {styles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setActiveStyle(style.id)}
                    className={`p-5 rounded-2xl border-2 text-left ${
                      activeStyle === style.id
                        ? 'border-gold bg-gold/10'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-xl">{style.icon}</span>
                    <div className="text-sm font-bold">
                      {style.name}
                    </div>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={goToArtisticPack}
                className="relative group w-full overflow-hidden bg-gray-900 text-white py-5 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
              >
                <div className="absolute inset-0 multi-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">
                  {t.artistic_cta}
                </span>
              </button>

            </div>
          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-7">
            <div className="bg-gray-50 rounded-[4rem] p-8 flex justify-center">
              <div className="relative max-w-[500px] w-full">
                <img
                  key={activeStyle}
                  src={styleImages[activeStyle]}
                  alt={activeStyle}
                  className="w-full h-auto rounded-[3rem] shadow-2xl"
                />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {activeStyle === 'original'
                      ? t.artistic_original_label
                      : styles.find(s => s.id === activeStyle)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ArtisticVideoCreator;
