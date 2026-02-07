import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { Language } from '../types'

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
  const [post, setPost] = useState<BlogPost>(initialPost ?? emptyPost)
  const [lang, setLang] = useState<Language>('es')
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialPost?.image ?? null
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =====================
     UPLOAD IMAGE
  ===================== */
  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `covers/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('blog')
      .upload(path, file, { contentType: file.type })

    if (error) throw error

    return supabase.storage.from('blog').getPublicUrl(path).data.publicUrl
  }

  /* =====================
     SAVE
  ===================== */
  const handleSave = () => {
    setError(null)

    if (!post.slugs.es) {
      setError('La URL (slug) en español es obligatoria')
      return
    }

    if (!post.title.es) {
      setError('El título en español es obligatorio')
      return
    }

    if (!post.content.es) {
      setError('El contenido en español es obligatorio')
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
        <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* IMAGE */}
      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async e => {
            const file = e.target.files?.[0]
            if (!file) return

            try {
              setUploading(true)
              const url = await uploadImage(file)
              setPost(prev => ({ ...prev, image: url }))
              setImagePreview(url)
            } catch (err: any) {
              setError(err.message || 'Error subiendo la imagen')
            } finally {
              setUploading(false)
            }
          }}
        />

        {imagePreview && (
          <img
            src={imagePreview}
            className="h-40 rounded-xl object-cover"
          />
        )}
      </div>

      {/* LANGUAGE SELECTOR */}
      <div className="flex gap-2 flex-wrap">
        {LANGUAGES.map(l => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`px-4 py-1 rounded-full text-sm font-bold ${
              lang === l
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SLUG PER LANGUAGE */}
      <input
        value={post.slugs[lang]}
        onChange={e =>
          setPost({
            ...post,
            slugs: {
              ...post.slugs,
              [lang]: normalizeSlug(e.target.value),
            },
          })
        }
        placeholder={`URL del post (${lang.toUpperCase()})`}
        className="w-full p-3 border rounded-xl"
      />

      {/* TITLE */}
      <input
        value={post.title[lang]}
        onChange={e =>
          setPost({
            ...post,
            title: { ...post.title, [lang]: e.target.value },
          })
        }
        placeholder={`Título (${lang.toUpperCase()})`}
        className="w-full p-3 border rounded-xl"
      />

      {/* CONTENT */}
      <textarea
        rows={6}
        value={post.content[lang]}
        onChange={e =>
          setPost({
            ...post,
            content: { ...post.content, [lang]: e.target.value },
          })
        }
        placeholder={`Contenido (${lang.toUpperCase()})`}
        className="w-full p-3 border rounded-xl"
      />

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={uploading}
          className="bg-gray-900 text-white px-6 py-3 rounded-full"
        >
          {uploading ? 'Subiendo…' : 'Guardar'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="underline text-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default AdminBlogEditor
