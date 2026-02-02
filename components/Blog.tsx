import React from 'react';
import { useParams } from 'react-router-dom';
import { Language } from '../types';
import { translations } from '../translations';

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const Blog: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es';

  const t = translations[language] ?? {};

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-4">
        {t.blog_title ?? 'Blog'}
      </h1>

      <p className="text-gray-600 mb-10">
        {t.blog_description ?? 'Articles and inspiration'}
      </p>

      <p className="text-gray-500 italic">
        Blog content coming soon…
      </p>
    </section>
  );
};

export default Blog;
