import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import AdminBlogEditor from './AdminBlogEditor'

type Mode = 'list' | 'edit'

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [mode, setMode] = useState<Mode>('list')
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /* =====================
     LOAD POSTS
  ===================== */
  const loadPosts = async () => {
    setError(null)
    setLoading(true)

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('LOAD POSTS ERROR:', error)
      setError(error.message)
      setLoading(false)
      return
    }

    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  /* =====================
     ACTIONS
  ===================== */
  const handleNew = () => {
    setEditingPost(null)
    setMode('edit')
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setMode('edit')
  }

  /* =====================
     SAVE POST
  ===================== */
  const handleSave = async (post: any) => {
    setError(null)
    setLoading(true)

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) throw sessionError
      if (!sessionData.session) {
        throw new Error('No hay sesión activa en Supabase')
      }

      const payload = {
        slugs: post.slugs,
        image: post.image,
        title: post.title,
        content: post.content,
      }

      if (post.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', post.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert(payload)

        if (error) throw error
      }

      setMode('list')
      loadPosts()
    } catch (err: any) {
      console.error('SAVE BLOG ERROR:', err)
      setError(err.message || 'Error guardando el post')
    } finally {
      setLoading(false)
    }
  }

  /* =====================
     EDIT MODE
  ===================== */
  if (mode === 'edit') {
    return (
      <AdminBlogEditor
        initialPost={editingPost ?? undefined}
        onCancel={() => setMode('list')}
        onSave={handleSave}
      />
    )
  }

  /* =====================
     LIST MODE
  ===================== */
  return (
    <div className="bg-white p-8 rounded-3xl shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Gestión de Blog</h2>

        <button
          onClick={handleNew}
          className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm"
        >
          + Nuevo post
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-gray-500 italic">Cargando posts…</p>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-gray-500 italic">No hay posts todavía.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(post => {
          const title = post.title?.es || 'Sin título'

          return (
            <div key={post.id} className="rounded-2xl overflow-hidden shadow">
              {post.image && (
                <img
                  src={post.image}
                  className="h-40 w-full object-cover"
                  alt={title}
                />
              )}

              <div className="p-4">
                <h3 className="font-bold">{title}</h3>

                <p className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString('es-ES')}
                </p>

                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 font-semibold mt-2"
                >
                  Editar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminBlog
