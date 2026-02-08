import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Language } from '../types'
import { translations } from '../translations'

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it']

interface BlogPostData {
  id: string
  created_at: string
  image?: string | null
  title: Record<Language, string>
  content: Record<Language, string>
}

const BlogPost: React.FC = () => {
  const { lang, slug } = useParams<{ lang: Language; slug: string }>()
  const navigate = useNavigate()

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es'

  const t = translations[language]

  const [post, setPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq(`slugs->>${language}`, slug)
        .single()

      setPost(data ?? null)
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

  const title = post.title[language] || post.title.es
  const content = post.content[language] || post.content.es

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
            {new Date(post.created_at).toLocaleDateString(language === 'en' ? 'en-GB' : 'es-ES')}
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

        {/* CONTENIDO — 🔥 AQUÍ ESTÁ LA CLAVE */}
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

            [&_strong]:text-gray-900
            [&_a]:text-violet-600
            [&_a]:font-semibold
            hover:[&_a]:underline
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  )
}

export default BlogPost
