
import React from 'react';
import { Language, BlogPost } from '../types';
import { translations } from '../translations';

interface BlogProps {
  language: Language;
  onPostClick: (post: BlogPost) => void;
}

// Mock data - In a real app, this would come from Supabase
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'musica-y-emociones',
    title: {
      es: 'Cómo la música revive tus mejores recuerdos',
      en: 'How music revives your best memories',
      ca: 'Com la música reviu els teus millors records',
      fr: 'Comment la musique ravive vos meilleurs souvenirs',
      it: 'Come la musica ravviva i tuoi migliori ricordi'
    },
    excerpt: {
      es: 'La ciencia explica por qué una melodía puede hacernos viajar en el tiempo.',
      en: 'Science explains why a melody can make us travel through time.',
      ca: 'La ciència explica per què una melodia ens pot fer viatjar en el temps.',
      fr: 'La science explique pourquoi une mélodie peut nous faire voyager dans le temps.',
      it: 'La scienza spiega perché una melodia può farci viaggiare nel tempo.'
    },
    content: {
      es: 'Contenido detallado sobre la relación entre música y memoria...',
      en: 'Detailed content about the relationship between music and memory...',
      ca: 'Contingut detallat sobre la relació entre música i memòria...',
      fr: 'Contenu détaillé sur la relation entre la musique et la mémoire...',
      it: 'Contenuto dettagliato sulla relazione tra musica e memoria...'
    },
    date: '2024-10-24',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    slug: 'regalo-perfecto-aniversario',
    title: {
      es: 'El regalo de aniversario que nunca olvidarán',
      en: 'The anniversary gift they will never forget',
      ca: 'El regal d\'aniversari que mai oblidaran',
      fr: 'Le cadeau d\'anniversaire qu\'ils n\'oublieront jamais',
      it: 'Il regalo di anniversario che non dimenticheranno mai'
    },
    excerpt: {
      es: '¿Por qué una canción personalizada es el detalle más romántico del mundo?',
      en: 'Why a personalized song is the most romantic detail in the world?',
      ca: 'Per què una cançó personalitzada és el detall més romàntic del món?',
      fr: 'Pourquoi une chanson personnalisée est le détail le plus romantique au monde ?',
      it: 'Perché una canzone personalizzata è il dettaglio più romantico del mondo?'
    },
    content: {
      es: 'Exploramos el impacto emocional de las canciones de amor...',
      en: 'We explore the emotional impact of love songs...',
      ca: 'Explorem l\'impacte emocional de les cançons d\'amor...',
      fr: 'Nous explorons l\'impact émotionnel des chansons d\'amour...',
      it: 'Esploriamo l\'impatto emotivo delle canzoni d\'amore...'
    },
    date: '2024-10-20',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800'
  }
];

const Blog: React.FC<BlogProps> = ({ language, onPostClick }) => {
  const t = translations[language];

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-warm-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 fade-in">
          <span className="text-violet-500 font-bold uppercase tracking-widest text-xs">MAIMELODY STORIES</span>
          <h1 className="text-5xl lg:text-7xl font-serif text-gray-900">{t.blog_title}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t.blog_desc}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MOCK_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100"
              onClick={() => onPostClick(post)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title[language]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 space-y-4">
                <p className="text-violet-400 font-bold text-xs uppercase tracking-widest">{post.date}</p>
                <h2 className="text-2xl font-serif text-gray-900 leading-tight group-hover:text-violet-600 transition-colors">
                  {post.title[language]}
                </h2>
                <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt[language]}
                </p>
                <div className="pt-4 flex items-center text-gray-900 font-bold text-sm">
                  {t.blog_read_more}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
