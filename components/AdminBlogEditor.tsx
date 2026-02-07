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

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')

const emptyPost: BlogPost = {
  slugs: { es: '', en: '', fr: '', it: '', ca: '' },
  image: null,
  title: { es: '', en: '', fr: '', it: '', ca: '' },
  content: { es: '', en: '', fr: '', it: '', ca: '' },
}

interface Props {
  initialPost?: any
  onCancel: () => void
  onSave: (post: BlogPost) => void
}

const AdminBlogEditor: React.FC<Props> = ({
  initialPost,
  onCancel,
  onSave,
}) => {
  const [post, setPost] = useState<BlogPost>({
    ...emptyPost,
    ...initialPost,
    slugs: {
      ...emptyPost.slugs,
      ...(initialPost?.slugs || {}),
    },
  })

  const [lang, setLang] = useState<Language>('es')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `covers/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('blog')
      .upload(path, file)

    if (error) throw error

    return supabase.storage.from('blog').getPublicUrl(path).data.publicUrl
  }

  const handleSave = () => {
    setError(null)

    if (!post.slugs.es) {
      setError('La URL en español es obligatoria')
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

      <div className="flex gap-2">
        {LANGUAGES.map(l => (
          <button
            key={l}
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
        placeholder={`URL (${lang.toUpperCase()})`}
        className="w-full p-3 border rounded-xl"
      />

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

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={uploading}
          className="bg-gray-900 text-white px-6 py-3 rounded-full"
        >
          Guardar
        </button>

        <button
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
