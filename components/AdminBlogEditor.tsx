import React, { useState } from 'react';
import { Language } from '../types';

const LANGUAGES: Language[] = ['es', 'en', 'fr', 'it', 'ca'];

interface BlogPostDraft {
  title: Record<Language, string>;
  content: Record<Language, string>;
  slug: string;
  image?: string;
  date: string;
}

interface Props {
  initialPost?: BlogPostDraft;
  onCancel: () => void;
  onSave: (post: BlogPostDraft) => void;
}

const emptyPost: BlogPostDraft = {
  slug: '',
  image: '',
  date: new Date().toISOString(),
  title: { es: '', en: '', fr: '', it: '', ca: '' },
  content: { es: '', en: '', fr: '', it: '', ca: '' },
};

const AdminBlogEditor: React.FC<Props> = ({
  initialPost,
  onCancel,
  onSave,
}) => {
  const [post, setPost] = useState<BlogPostDraft>(
    initialPost ?? emptyPost
  );
  const [lang, setLang] = useState<Language>('es');

  const updateField = (
    field: 'title' | 'content',
    value: string
  ) => {
    setPost({
      ...post,
      [field]: {
        ...post[field],
        [lang]: value,
      },
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow space-y-6">
      <h2 className="text-2xl font-serif">
        {initialPost ? 'Editar post' : 'Nuevo post'}
      </h2>

      {/* SLUG */}
      <div>
        <label className="text-sm font-bold text-gray-600">Slug (URL)</label>
        <input
          value={post.slug}
          onChange={(e) => setPost({ ...post, slug: e.target.value })}
          placeholder="mi-primer-post"
          className="w-full mt-1 p-3 rounded-xl border"
        />
      </div>

      {/* IMAGE */}
      <div>
        <label className="text-sm font-bold text-gray-600">Imagen (URL)</label>
        <input
          value={post.image}
          onChange={(e) => setPost({ ...post, image: e.target.value })}
          placeholder="https://..."
          className="w-full mt-1 p-3 rounded-xl border"
        />
      </div>

      {/* LANGUAGE SWITCH */}
      <div className="flex gap-2 flex-wrap">
        {LANGUAGES.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-1 rounded-full text-sm font-bold ${
              lang === l
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TITLE */}
      <div>
        <label className="text-sm font-bold text-gray-600">
          Título ({lang.toUpperCase()})
        </label>
        <input
          value={post.title[lang]}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full mt-1 p-3 rounded-xl border"
        />
      </div>

      {/* CONTENT */}
      <div>
        <label className="text-sm font-bold text-gray-600">
          Contenido ({lang.toUpperCase()})
        </label>
        <textarea
          rows={8}
          value={post.content[lang]}
          onChange={(e) => updateField('content', e.target.value)}
          className="w-full mt-1 p-3 rounded-xl border"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => onSave(post)}
          className="bg-gray-900 text-white px-6 py-3 rounded-full"
        >
          Guardar
        </button>

        <button
          onClick={onCancel}
          className="text-gray-500 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
