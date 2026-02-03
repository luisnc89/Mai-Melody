import React, { useEffect, useState } from 'react';
import { getBlogPosts } from '../services/blog';
import AdminBlogEditor from './AdminBlogEditor';

type Mode = 'list' | 'edit';

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [mode, setMode] = useState<Mode>('list');
  const [editingPost, setEditingPost] = useState<any | null>(null);

  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);

  const handleNew = () => {
    setEditingPost(null);
    setMode('edit');
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setMode('edit');
  };

  const handleSave = (post: any) => {
    console.log('POST GUARDADO (temporal):', post);
    alert('Post guardado (temporal). Paso siguiente: persistencia.');
    setMode('list');
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
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow space-y-6">
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

      {posts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div
              key={post.id}
              className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4 space-y-2">
                <h3 className="font-bold">{post.title}</h3>

                {post.date && (
                  <p className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('es-ES')}
                  </p>
                )}

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Editar
                  </button>
                  <button className="text-red-500 font-semibold hover:underline">
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
