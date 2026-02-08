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

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {uploading && (
          <p className="text-xs italic text-gray-500">
            Subiendo imagen…
          </p>
        )}
      </div>

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

      <RichTextEditor
        value={post.content[lang]}
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

      <button
        onClick={() => setPreview(p => !p)}
        className="text-sm underline"
      >
        {preview ? 'Ocultar preview' : 'Ver preview'}
      </button>

      {preview && (
        <div
          className="prose max-w-none border rounded-xl p-4"
          dangerouslySetInnerHTML={{ __html: post.content[lang] }}
        />
      )}

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
