
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface TestimonialsProps {
  language: Language;
}

const Testimonials: React.FC<TestimonialsProps> = ({ language }) => {
  const t = translations[language];

  const feedback = [
    { stars: 5, text: t.testimonial_1, author: 'Marta, Barcelona' },
    { stars: 5, text: t.testimonial_2, author: 'Jordi, Madrid' },
    { stars: 5, text: t.testimonial_3, author: 'Elena, Valencia' }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">{t.testimonials_title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {feedback.map((item, i) => (
            <div key={i} className="bg-warm-white p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between border border-gray-50">
              <div className="space-y-4">
                <div className="flex space-x-1 text-gold">
                  {[...Array(item.stars)].map((_, s) => (
                    <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic text-gray-700 leading-relaxed">"{item.text}"</p>
              </div>
              <div className="mt-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <span className="font-bold text-gray-900 text-sm">— {item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
