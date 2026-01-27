
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface ExamplesProps {
  language: Language;
  onCtaClick: () => void;
}

const Examples: React.FC<ExamplesProps> = ({ language, onCtaClick }) => {
  const t = translations[language];

  const examples = [
    { title: t.example_romantic, desc: t.example_romantic_desc, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: t.example_birthday, desc: t.example_birthday_desc, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: t.example_memorial, desc: t.example_memorial_desc, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
  ];

  return (
    <section className="py-20 px-4 bg-warm-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">{t.examples_title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {examples.map((ex, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between border border-gray-50 hover:border-gold/30 transition-colors">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto">
                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 3v9.13a4.499 4.499 0 00-2 3.87c0 2.485 2.015 4.5 4.5 4.5S13 20.485 13 18V7.167l5-1v1.616a4.499 4.499 0 00-2 3.87c0 2.485 2.015 4.5 4.5 4.5s4.5-2.015 4.5-4.5V4a1 1 0 00-1-1z" />
                   </svg>
                </div>
                <h3 className="text-xl font-serif">{ex.title}</h3>
                <p className="text-sm text-gray-500 italic">{ex.desc}</p>
                <div className="pt-4">
                  <audio controls className="w-full h-10 filter sepia brightness-90 contrast-75">
                    <source src={ex.audio} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <button 
            onClick={onCtaClick}
            className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-gold transition-all transform hover:scale-105 shadow-xl"
          >
            {t.hero_cta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Examples;
