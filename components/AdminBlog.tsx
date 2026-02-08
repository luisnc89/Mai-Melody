import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import AdminBlogEditor from './AdminBlogEditor'
import { Language } from '../types'

interface BlogPost {
  id: string
  created_at: string
  image: string | null
  title: Record<Language, string>
  slugs: Record<Language, string>
  content: Record<Language, string>
}

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [creating, setCreating] = useState(false)

  const loadPosts = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading blog posts:', error)
      setPosts([])
    } else {
      setPosts(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleSave = async (post: BlogPost) => {
    if (post.id) {
      // UPDATE
      await supabase
        .from('blog_posts')
        .update({
          title: post.title,
          slugs: post.slugs,
          content: post.content,
          image: post.image,
        })
        .eq('id', post.id)
    } else {
      // INSERT
      await supabase.from('blog_posts').insert({
        title: post.title,
        slugs: post.slugs,
        content: post.content,
        image: post.image,
      })
    }

    setEditingPost(null)
    setCreating(false)
    loadPosts()
  }

  if (editingPost || creating) {
    return (
      <AdminBlogEditor
        initialPost={editingPost || undefined}
        onCancel={() => {
          setEditingPost(null)
          setCreating(false)
        }}
        onSave={handleSave}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif">Blog</h2>

        <button
          onClick={() => setCreating(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-full"
        >
          + Nuevo post
        </button>
      </div>

      {loading && (
        <p className="italic text-gray-400">Cargando posts…</p>
      )}

      {!loading && posts.length === 0 && (
        <p className="italic text-gray-400">
          No hay posts todavía.
        </p>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="p-4 border rounded-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-semibold">
                  {post.title?.es || 'Sin título'}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setEditingPost(post)}
                className="text-sm font-semibold text-violet-600"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBlog
