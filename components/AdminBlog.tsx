import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import AdminBlogEditor from './AdminBlogEditor';

type Mode = 'list' | 'edit';

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [mode, setMode] = useState<Mode>('list');
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleNew = () => {
    setEditingPost(null);
    setMode('edit');
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setMode('edit');
  };

  const handleSave = async (post: any) => {
    if (post.id) {
      await supabase.from('blog_posts').update(post).eq('id', post.id);
    } else {
      await supabase.from('blog_posts').insert(post);
    }

    setMode('list');
    loadPosts();
  };

  if (mode === 'edit') {
    return (
      <AdminBlogEditor
        initialPost={editingPost ?? undefined}
        onCancel={() => setMode('list')}
        onSave={handleSave}
      />
    );
  }

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

      {posts.length === 0 && (
        <p className="text-gray-500 italic">No hay posts todavía.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="rounded-2xl overflow-hidden shadow">
            {post.image && (
              <img src={post.image} className="h-40 w-full object-cover" />
            )}

            <div className="p-4">
              <h3 className="font-bold">{post.title?.es}</h3>

              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString('es-ES')}
              </p>

              <div className="flex gap-4 mt-2 text-sm">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 font-semibold"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
