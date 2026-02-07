import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Language } from '../types';
import AdminBlog from './AdminBlog';
import { getOrders } from '../services/storage';

type Tab = 'orders' | 'testimonials' | 'blog';

interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  language: Language;
  song_url: string;
  photo: string | null;
  pack: string | null;
  visible: boolean;
  created_at: string;
}

const LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

const PACKS = [
  'Básico',
  'Premium',
  'Pareja',
  'Cumpleaños',
  'Memorial',
];

interface AdminProps {
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    message: '',
    rating: 5,
    language: 'es' as Language,
    pack: '',
    visible: true,
    songFile: null as File | null,
    photoFile: null as File | null,
  });

  /* =====================
     LOAD TESTIMONIALS
  ===================== */
  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    setTestimonials(data || []);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  /* =====================
     UPLOAD IMAGE
  ===================== */
  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const fileName = `photos/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('testimonials')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('testimonials')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* =====================
     UPLOAD AUDIO
  ===================== */
  const uploadAudio = async (file: File) => {
    const ext = file.name.split('.').pop();
    const fileName = `audio/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('testimonials')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('testimonials')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* =====================
     SAVE TESTIMONIAL
  ===================== */
  const handleSaveTestimonial = async () => {
    setError(null);

    if (!form.name || !form.message || !form.songFile) {
      setError('Nombre, mensaje y canción son obligatorios');
      return;
    }

    try {
      setLoading(true);

      const songUrl = await uploadAudio(form.songFile);
      const photoUrl = form.photoFile
        ? await uploadImage(form.photoFile)
        : null;

      const { error } = await supabase.from('testimonials').insert({
        name: form.name,
        message: form.message,
        rating: form.rating,
        language: form.language,
        pack: form.pack || null,
        song_url: songUrl,
        photo: photoUrl,
        visible: form.visible,
      });

      if (error) throw error;

      setForm({
        name: '',
        message: '',
        rating: 5,
        language: 'es',
        pack: '',
        visible: true,
        songFile: null,
        photoFile: null,
      });

      setImagePreview(null);
      setAudioName(null);

      loadTestimonials();
    } catch (err: any) {
      setError(err.message || 'Error guardando testimonio');
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-serif">Admin MaiMelody</h1>
          <button
            onClick={onLogout}
            className="bg-gray-900 text-white px-6 py-3 rounded-full"
          >
            Salir
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-white p-2 rounded-full shadow w-fit">
          {[
            ['orders', 'Pedidos'],
            ['testimonials', 'Testimonios'],
            ['blog', 'Blog'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`px-6 py-2 rounded-full font-bold text-sm ${
                activeTab === key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TESTIMONIOS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8">

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl">
                {error}
              </div>
            )}

            {/* FORM */}
            <div className="bg-white p-8 rounded-3xl shadow space-y-6">
              <h2 className="text-2xl font-serif">Añadir testimonio</h2>

              <input
                className="border rounded-xl px-4 py-3 w-full"
                placeholder="Nombre"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />

              <textarea
                className="border rounded-xl px-4 py-3 w-full min-h-[140px]"
                placeholder="Mensaje"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />

              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={form.rating}
                  onChange={e =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  className="border rounded-xl px-3 py-2"
                >
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} ⭐</option>
                  ))}
                </select>

                <select
                  value={form.language}
                  onChange={e =>
                    setForm({ ...form, language: e.target.value as Language })
                  }
                  className="border rounded-xl px-3 py-2"
                >
                  {LANGUAGES.map(l => (
                    <option key={l} value={l}>{l.toUpperCase()}</option>
                  ))}
                </select>

                <select
                  value={form.pack}
                  onChange={e =>
                    setForm({ ...form, pack: e.target.value })
                  }
                  className="border rounded-xl px-3 py-2"
                >
                  <option value="">Pack</option>
                  {PACKS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={e =>
                      setForm({ ...form, visible: e.target.checked })
                    }
                  />
                  Visible
                </label>
              </div>

              {/* IMAGE */}
              <div>
                <label className="font-semibold text-sm">Foto de perfil</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="w-16 h-16 rounded-full object-cover mt-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setForm({ ...form, photoFile: file });
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              {/* AUDIO */}
              <div>
                <label className="font-semibold text-sm">Canción</label>
                {audioName && (
                  <p className="text-xs text-gray-500">🎵 {audioName}</p>
                )}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setForm({ ...form, songFile: file });
                    setAudioName(file.name);
                  }}
                />
              </div>

              <button
                onClick={handleSaveTestimonial}
                disabled={loading}
                className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold"
              >
                {loading ? 'Guardando…' : 'Guardar testimonio'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'blog' && <AdminBlog />}
        {activeTab === 'orders' && <p className="italic">Pedidos sin cambios.</p>}
      </div>
    </section>
  );
};

export default Admin;
