import { BLOG_POSTS } from './blog.data';
import { Language } from '../types';

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  image?: string;
  date?: string;
}

export function getBlogPosts(lang: Language = 'es'): AdminBlogPost[] {
  return BLOG_POSTS.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title[lang] || post.title.es,
    image: post.image,
    date: post.date,
  }));
}
