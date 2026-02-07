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
  const content = post.content?.[language] || post.content?.es

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-warm-white">
      <article className="max-w-3xl mx-auto space-y-12">

        {/* Volver */}
        <button
          onClick={() => navigate(`/${language}/blog`)}
          className="text-sm text-gray-500 hover:text-violet-600 font-semibold"
        >
          ← {t.blog_back}
        </button>

        {/* Cabecera */}
        <header className="text-center space-y-4">
          <p className="text-violet-500 font-bold text-xs uppercase tracking-wide">
            {new Date(post.created_at).toLocaleDateString('es-ES')}
          </p>

          <h1 className="text-4xl md:text-5xl font-serif leading-tight">
            {title}
          </h1>
        </header>

        {/* Imagen */}
        {post.image && (
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src={post.image}
              alt={title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Contenido */}
        <div
          className="
            prose prose-lg max-w-none
            prose-p:leading-relaxed
            prose-p:my-4
            prose-h3:mt-8 prose-h3:mb-3
            prose-ul:my-4 prose-li:my-1
            prose-strong:text-gray-900
            prose-a:text-violet-600 prose-a:font-semibold hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  )
}

export default BlogPost
