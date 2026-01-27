
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface SEOBlockProps {
  language: Language;
}

const SEOBlock: React.FC<SEOBlockProps> = ({ language }) => {
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
