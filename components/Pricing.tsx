import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, PackType } from '../types';
import { translations } from '../translations';

interface PricingProps {
  language: Language;
}

const Pricing: React.FC<PricingProps> = ({ language }) => {
  const t = translations[language];
  const navigate = useNavigate();

  const packs = [
    {
      id: 'basico' as PackType,
      name: t.pack_basico,
      price: 25,
      features: [t.feature_2songs, t.delivery_24, t.feature_audio],
      color: 'bg-white border border-gray-100'
    },
    {
      id: 'emocion' as PackType,
      name: t.pack_emocion,
      price: 39,
      features: [t.feature_2songs, t.feature_video, t.delivery_72],
      color: 'bg-white border-2 border-violet-400 shadow-violet-100',
      popular: true
    },
    {
      id: 'artistico' as PackType,
      name: t.pack_artistico,
      price: 49,
      features: [t.feature_2songs, t.feature_artistic, t.delivery_72],
      color: 'bg-white border-2 border-gold shadow-gold/10'
    }
  ];

  const goToPack = (pack: PackType) => {
    navigate(`/crear/${pack}`);
  };

  return (
    <section className="py-20 px-4 bg-transparent relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">
            {t.pricing_title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium">
            {t.pricing_desc}
          </p>
          <div className="text-3xl text-violet-400 opacity-30 mt-4">♫</div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packs.map(pack => (
            <div
              key={pack.id}
              className={`${pack.color} p-10 rounded-[3rem] shadow-xl flex flex-col justify-between transform transition-all hover:-translate-y-2 relative group overflow-hidden`}
            >
              {pack.popular && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 multi-glow text-white px-6 py-1.5 rounded-b-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  {t.pricing_popular}
                </span>
              )}

              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-gray-800">
                  {pack.name}
                </h3>

                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold bg-gradient-to-br from-gray-900 to-violet-800 bg-clip-text text-transparent">
                    {pack.price}€
                  </span>
                  <span className="text-gray-500 text-sm italic">
                    {t.iva_included}
                  </span>
                </div>

                <ul className="space-y-4">
                  {pack.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-3 text-gray-700"
                    >
                      <div className="w-5 h-5 bg-violet-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-violet-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => goToPack(pack.id)}
                className="mt-10 w-full py-4 rounded-full font-bold transition-all border-2 border-gray-900 group-hover:bg-gray-900 group-hover:text-white relative overflow-hidden"
              >
                <span className="relative z-10">
                  {t.select_pack}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
