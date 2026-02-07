import React, { useRef, useState, useEffect } from 'react'
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
  const editorRef = useRef<HTMLDivElement>(null)

  const [post, setPost] = useState<BlogPost>(() => ({
    ...emptyPost,
    ...initialPost,
    slugs: { ...emptyPost.slugs, ...(initialPost?.slugs || {}) },
    title: { ...emptyPost.title, ...(initialPost?.title || {}) },
    content: { ...emptyPost.content, ...(initialPost?.content || {}) },
  }))

  const [lang, setLang] = useState<Language>('es')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ======================
     CARGAR CONTENIDO
  ====================== */
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = post.content[lang] || ''
    }
  }, [lang])

  /* ======================
     IMAGE UPLOAD
  ====================== */
  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop()
    const path = `covers/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('blog')
      .upload(path, file)

    if (error) throw error

    return supabase.storage.from('blog').getPublicUrl(path).data.publicUrl
  }

  /* ======================
     FORMAT COMMANDS
  ====================== */
  const exec = (cmd: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd)
  }

  /* ======================
     CAMBIAR IDIOMA (CRÍTICO)
  ====================== */
  const changeLanguage = (newLang: Language) => {
    // Guardar el contenido actual ANTES de cambiar
    setPost(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: editorRef.current?.innerHTML || '',
      },
    }))

    setLang(newLang)
  }

  /* ======================
     GUARDAR POST
  ====================== */
  const handleSave = () => {
    const updatedPost: BlogPost = {
      ...post,
      content: {
        ...post.content,
        [lang]: editorRef.current?.innerHTML || '',
      },
    }

    if (!updatedPost.slugs.es || !updatedPost.title.es) {
      setError('El slug y el título en español son obligatorios')
      return
    }

    onSave(updatedPost)
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
      <input
        type="file"
        onChange={async e => {
          const file = e.target.files?.[0]
          if (!file) return
          setUploading(true)
          const url = await uploadImage(file)
          setPost(p => ({ ...p, image: url }))
          setUploading(false)
        }}
      />

      {post.image && (
        <img src={post.image} className="h-40 rounded-xl" />
      )}

      {/* LANG SELECT */}
      <div className="flex gap-2">
        {LANGUAGES.map(l => (
          <button
            key={l}
            onClick={() => changeLanguage(l)}
            className={`px-3 py-1 rounded-full ${
              l === lang ? 'bg-black text-white' : 'bg-gray-200'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
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
        placeholder={`URL (${lang.toUpperCase()})`}
      />

      {/* TITLE */}
      <input
        value={post.title[lang]}
        onChange={e =>
          setPost(p => ({
            ...p,
            title: { ...p.title, [lang]: e.target.value },
          }))
        }
        className="w-full p-3 border rounded-xl"
        placeholder={`Título (${lang.toUpperCase()})`}
      />

      {/* TOOLBAR */}
      <div className="flex gap-2">
        <button onClick={() => exec('bold')}>B</button>
        <button onClick={() => exec('italic')}>I</button>
        <button onClick={() => exec('insertUnorderedList')}>•</button>
        <button onClick={() => exec('insertOrderedList')}>1.</button>
        <button
          onClick={() => {
            const url = prompt('URL')
            if (url) document.execCommand('createLink', false, url)
          }}
        >
          🔗
        </button>
      </div>

      {/* EDITOR */}
      <div
        ref={editorRef}
        contentEditable
        className="border p-4 rounded-xl min-h-[250px] prose max-w-none"
        suppressContentEditableWarning
      />

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-3 rounded-full"
        >
          Guardar
        </button>

        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

export default AdminBlogEditor
