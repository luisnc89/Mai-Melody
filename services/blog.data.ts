import { Language } from '../types';

export interface BlogPostData {
  id: string;
  slug: string;
  image?: string;
  date?: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
}

export const BLOG_POSTS: BlogPostData[] = [
  {
    id: 'music-memories',
    slug: 'como-la-musica-revive-recuerdos',
    image: '/blog/music.jpg',
    date: '2024-01-15',
    title: {
      es: 'Cómo la música revive tus recuerdos',
      en: 'How music brings memories back',
      fr: 'Comment la musique ravive les souvenirs',
      it: 'Come la musica riporta i ricordi',
      ca: 'Com la música fa reviure records',
    },
    content: {
      es: 'Texto en español...',
      en: 'English text...',
      fr: 'Texte français...',
      it: 'Testo italiano...',
      ca: 'Text català...',
    },
  },
];
