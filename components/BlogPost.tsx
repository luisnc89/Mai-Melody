
import React from 'react';
import { Language, BlogPost } from '../types';
import { translations } from '../translations';

interface BlogPostProps {
  language: Language;
  post: BlogPost;
  onBack: () => void;
}

const BlogPostDetail: React.FC<BlogPostProps> = ({ language, post, onBack }) => {
  const t = translations[language];

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-warm-white">
      <div className="max-w-3xl mx-auto space-y-12 fade-in">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-violet-600 font-bold text-sm transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.blog_back}
        </button>

        <div className="space-y-6 text-center">
          <p className="text-violet-500 font-bold uppercase tracking-widest text-xs">{post.date}</p>
          <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 leading-tight">
            {post.title[language]}
          </h1>
        </div>

        <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[16/9]">
          <img 
            src={post.image} 
            alt={post.title[language]} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium space-y-8">
          <p className="text-xl text-gray-900 font-serif italic border-l-4 border-violet-200 pl-6">
            {post.excerpt[language]}
          </p>
          <div className="whitespace-pre-wrap">
            {post.content[language]}
          </div>
          
          <div className="pt-12 border-t border-gray-100 text-center">
            <p className="text-violet-400 text-3xl butterfly-float">🦋</p>
            <p className="text-sm text-gray-400 mt-4 italic">MaiMelody Editorial Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
