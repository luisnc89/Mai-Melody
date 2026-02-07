import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Language } from '../types'
import { translations } from '../translations'

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it']

const BlogPost: React.FC = () => {
  const { lang, slug } = useParams<{ lang: Language; slug: string }>()
  const navigate = useNavigate()

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es'

  const t = translations[language]

  const [post, setPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true)

      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq(`slugs->>${language}`, slug)
        .single()

      setPost(data)
      setLoading(false)
    }

    loadPost()
  }, [slug, language])

  if (loading) {
    return (
      <p className="text-center py-32 text-gray-400 italic">
        Cargando artículo…
      </p>
    )
  }

  if (!post) {
    return (
      <p className="text-center py-32 text-gray-400 italic">
        Artículo no encontrado
      </p>
    )
  }

  const title = post.title?.[language] || post.title?.es
  const content = post.content?.[language] || post.content?.es || ''

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-warm-white">
      <div className="max-w-3xl mx-auto space-y-12">

        <button
          onClick={() => navigate(`/${language}/blog`)}
          className="text-sm text-gray-500 hover:text-violet-600 font-bold"
        >
          ← {t.blog_back}
        </button>

        <div className="text-center space-y-4">
          <p className="text-violet-500 font-bold text-xs uppercase">
            {new Date(post.created_at).toLocaleDateString('es-ES')}
          </p>

          <h1 className="text-5xl font-serif">
            {title}
          </h1>
        </div>

        {post.image && (
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src={post.image}
              alt={title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* CONTENIDO HTML (React Quill) */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export default BlogPost
