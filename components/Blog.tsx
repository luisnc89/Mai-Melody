import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Language } from '../types';
import { translations } from '../translations';

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const Blog: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es';

  const t = translations[language];

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      setPosts(data || []);
      setLoading(false);
    };

    loadPosts();
  }, []);

  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif mb-4">
          {t?.blog_title || 'Blog'}
        </h1>

        <p className="text-gray-600">
          {t?.blog_desc || 'Artículos e inspiración'}
        </p>
      </div>

      {loading && (
        <p className="text-center text-gray-400 italic">
          Cargando artículos…
        </p>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-400 italic">
          No hay artículos todavía.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        {posts.map(post => (
          <Link
            key={post.id}
            to={`/${language}/blog/${post.slug}`}
            className="group block bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition"
          >
            {post.image && (
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title?.[language] || post.title?.es}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}

            <div className="p-6 space-y-3">
              <h2 className="text-xl font-serif text-gray-900">
                {post.title?.[language] || post.title?.es}
              </h2>

              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Blog;
