import React, { useRef, useState } from 'react'
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
  value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

const AdminBlogEditor: React.FC<Props> = ({
  initialPost,
  onCancel,
  onSave,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)

  const [post, setPost] = useState<BlogPost>({
    ...emptyPost,
    ...initialPost,
    slugs: { ...emptyPost.slugs, ...(initialPost?.slugs || {}) },
    title: { ...emptyPost.title, ...(initialPost?.title || {}) },
    content: { ...emptyPost.content, ...(initialPost?.content || {}) },
  })

  const [lang, setLang] = useState<Language>('es')
  const [error, setError] = useState<string | null>(null)

  const insertHTML = (html: string) => {
    editorRef.current?.focus()
    document.execCommand('insertHTML', false, html)
  }

  const handleSave = () => {
    onSave({
      ...post,
      content: {
        ...post.content,
        [lang]: editorRef.current?.innerHTML || '',
      },
    })
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
            onClick={() => {
              setPost(p => ({
                ...p,
                content: {
                  ...p.content,
                  [lang]: editorRef.current?.innerHTML || '',
                },
              }))
              setLang(l)
              setTimeout(() => {
                if (editorRef.current) {
                  editorRef.current.innerHTML = post.content[l] || ''
                }
              })
            }}
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
            slugs: { ...p.slugs, [lang]: normalizeSlug(e.target.value) },
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
            title: { ...p.title, [lang]: e.target.value },
          }))
        }
        className="w-full p-3 border rounded-xl"
        placeholder="Título"
      />

      {/* TOOLBAR REAL */}
      <div className="flex gap-2 border rounded-xl p-2 bg-gray-50 text-sm">
        <button onClick={() => document.execCommand('bold')}>B</button>
        <button onClick={() => insertHTML('<h2>Título</h2>')}>H2</button>
        <button onClick={() => insertHTML('<h3>Subtítulo</h3>')}>H3</button>
        <button
          onClick={() =>
            insertHTML('<ul><li>Elemento de lista</li></ul>')
          }
        >
          • Lista
        </button>
        <button
          onClick={() =>
            insertHTML('<ol><li>Elemento numerado</li></ol>')
          }
        >
          1. Lista
        </button>
        <button
          onClick={() => {
            const url = prompt('URL del enlace')
            if (url) {
              insertHTML(`<a href="${url}" target="_blank">${url}</a>`)
            }
          }}
        >
          🔗
        </button>
      </div>

      {/* EDITOR */}
      <div
        ref={editorRef}
        contentEditable
        className="border p-4 rounded-xl min-h-[260px] focus:outline-none prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: post.content[lang] || '',
        }}
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
