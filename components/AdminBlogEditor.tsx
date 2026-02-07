import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Language } from '../types';

const LANGUAGES: Language[] = ['es', 'en', 'fr', 'it', 'ca'];

interface BlogPost {
  id?: string;
  slug: string;
  image: string | null;
  title: Record<Language, string>;
  content: Record<Language, string>;
}

const emptyPost: BlogPost = {
  slug: '',
  image: null,
  title: { es: '', en: '', fr: '', it: '', ca: '' },
  content: { es: '', en: '', fr: '', it: '', ca: '' },
};

interface Props {
  initialPost?: BlogPost;
  onCancel: () => void;
  onSave: (post: BlogPost) => void;
}

const AdminBlogEditor: React.FC<Props> = ({
  initialPost,
  onCancel,
  onSave,
}) => {
  const [post, setPost] = useState<BlogPost>(initialPost ?? emptyPost);
  const [lang, setLang] = useState<Language>('es');
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialPost?.image ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `covers/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('blog')
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from('blog')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow space-y-6">
      <h2 className="text-2xl font-serif">
        {initialPost ? 'Editar post' : 'Nuevo post'}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* SLUG */}
      <div>
        <label className="block text-sm font-semibold mb-1">Slug (URL)</label>
        <input
          value={post.slug}
          onChange={e => setPost({ ...post, slug: e.target.value })}
          placeholder="mi-primer-post"
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* IMAGE */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">
          Imagen de portada
        </label>

        {imagePreview && (
          <img
            src={imagePreview}
            className="h-40 rounded-xl object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              setUploading(true);
              const url = await uploadImage(file);
              setPost(prev => ({ ...prev, image: url }));
              setImagePreview(url);
            } catch (err: any) {
              setError(err.message || 'Error subiendo la imagen');
            } finally {
              setUploading(false);
            }
          }}
        />
      </div>

      {/* LANGUAGE */}
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
        <label className="block text-sm font-semibold mb-1">
          Título ({lang.toUpperCase()})
        </label>
        <input
          value={post.title[lang]}
          onChange={e =>
            setPost({
              ...post,
              title: { ...post.title, [lang]: e.target.value },
            })
          }
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* CONTENT */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Contenido ({lang.toUpperCase()})
        </label>
        <textarea
          rows={8}
          value={post.content[lang]}
          onChange={e =>
            setPost({
              ...post,
              content: { ...post.content, [lang]: e.target.value },
            })
          }
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => onSave(post)}
          disabled={uploading}
          className="bg-gray-900 text-white px-6 py-3 rounded-full"
        >
          {uploading ? 'Subiendo…' : 'Guardar'}
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
