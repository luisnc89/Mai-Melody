import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { Language } from '../types'
import RichTextEditor from './RichTextEditor'

const LANGUAGES: Language[] = ['es', 'en', 'fr', 'it', 'ca']

interface BlogPost {
  id?: string
  slugs: Record<Language, string>
  image: string | null
  title: Record<Language, string>
  content: Record<Language, string>
}

const emptyPost: BlogPost = {
  slugs: { es: '', en: '', fr: '', it: '', ca: '' },
  image: null,
  title: { es: '', en: '', fr: '', it: '', ca: '' },
  content: { es: '', en: '', fr: '', it: '', ca: '' },
}

interface Props {
  initialPost?: BlogPost
  onCancel: () => void
  onSave: (post: BlogPost) => void
}

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')

const AdminBlogEditor: React.FC<Props> = ({
  initialPost,
  onCancel,
  onSave,
}) => {
  const [post, setPost] = useState<BlogPost>({
    ...emptyPost,
    ...initialPost,
    slugs: { ...emptyPost.slugs, ...(initialPost?.slugs || {}) },
    title: { ...emptyPost.title, ...(initialPost?.title || {}) },
    content: { ...emptyPost.content, ...(initialPost?.content || {}) },
  })

  const [lang, setLang] = useState<Language>('es')
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(false)

  /* =====================
     IMAGE UPLOAD
  ===================== */
  const uploadImage = async (file: File) => {
    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `blog/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('blog')
      .upload(fileName, file)

    if (error) {
      setUploading(false)
      throw error
    }

    const { data } = supabase.storage
      .from('blog')
      .getPublicUrl(fileName)

    setUploading(false)
    return data.publicUrl
  }

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setPost(p => ({ ...p, image: imageUrl }))
    } catch (err: any) {
      setError(err.message || 'Error subiendo imagen')
    }
  }

  /* =====================
     SAVE
  ===================== */
  const handleSave = () => {
    if (!post.title[lang] || !post.slugs[lang]) {
      setError('Título y URL son obligatorios')
      return
    }

    onSave(post)
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow space-y-6">
      <h2 className="text-2xl font-serif">
        {initialPost ? 'Editar post' : 'Nuevo post'}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* IDIOMAS */}
      <div className="flex gap-2">
        {LANGUAGES.map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-sm ${
              l === lang
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* IMAGE */}
      <div className="space-y-2">
        <label className="font-semibold text-sm">
          Imagen del post
        </label>

        {post.image && (
          <img
            src={post.image}
            className="w-full max-h-64 object-cover rounded-xl border"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {uploading && (
          <p className="text-xs italic text-gray-500">
            Subiendo imagen…
          </p>
        )}
      </div>

      {/* SLUG */}
      <input
        value={post.slugs[lang]}
        onChange={e =>
          setPost(p => ({
            ...p,
            slugs: {
              ...p.slugs,
              [lang]: normalizeSlug(e.target.value),
            },
          }))
        }
        className="w-full p-3 border rounded-xl"
        placeholder="URL"
      />

      {/* TITULO */}
      <input
        value={post.title[lang]}
        onChange={e =>
          setPost(p => ({
            ...p,
            title: {
              ...p.title,
              [lang]: e.target.value,
            },
          }))
        }
        className="w-full p-3 border rounded-xl"
        placeholder="Título"
      />

      {/* RICH TEXT EDITOR */}
      <RichTextEditor
        value={post.content[lang] || ''}
        onChange={html =>
          setPost(p => ({
            ...p,
            content: {
              ...p.content,
              [lang]: html,
            },
          }))
        }
      />

      {/* PREVIEW TOGGLE */}
      <button
        onClick={() => setPreview(p => !p)}
        className="text-sm underline"
      >
        {preview ? 'Ocultar vista previa' : 'Ver vista previa'}
      </button>

      {/* PREVIEW */}
      {preview && (
        <div className="border rounded-2xl p-6 space-y-6 bg-gray-50">
          {/* Título */}
          <h1 className="text-3xl font-serif">
            {post.title[lang] || post.title.es}
          </h1>

          {/* Imagen destacada */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title[lang]}
              className="w-full max-h-96 object-cover rounded-xl"
            />
          )}

          {/* Contenido */}
          <div
            className="
              text-base leading-relaxed text-gray-800

              [&_p]:my-5

              [&_h2]:text-3xl
              [&_h2]:font-serif
              [&_h2]:font-bold
              [&_h2]:mt-12
              [&_h2]:mb-4

              [&_h3]:text-2xl
              [&_h3]:font-serif
              [&_h3]:font-semibold
              [&_h3]:mt-8
              [&_h3]:mb-3

              [&_ul]:list-disc
              [&_ul]:pl-6
              [&_ul]:my-5

              [&_ol]:list-decimal
              [&_ol]:pl-6
              [&_ol]:my-5

              [&_li]:my-1

              [&_a]:text-violet-600
              [&_a]:font-semibold
              hover:[&_a]:underline
            "
            dangerouslySetInnerHTML={{
              __html: post.content[lang] || '',
            }}
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-gray-900 text-white px-6 py-3 rounded-full"
        >
          Guardar
        </button>

        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

export default AdminBlogEditor
