import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Language } from '../types';
import AdminBlog from './AdminBlog';

type Tab = 'orders' | 'testimonials' | 'blog';

/* =====================
   TYPES
===================== */
interface Order {
  id: string;
  email: string;
  pack: string;
  price: number;
  title: string;
  from_name: string;
  to_name: string;
  story: string;
  musical_style: string;
  voice: string;
  occasion: string;
  status: 'pendiente' | 'procesado' | 'completado';
  created_at: string;
}

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

/* =====================
   COMPONENT
===================== */
const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  /* ORDERS */
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* TESTIMONIALS */
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
     LOAD ORDERS
  ===================== */
  const loadOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setOrdersLoading(false);
  };

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
    loadOrders();
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

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow p-6 overflow-x-auto">
            {ordersLoading ? (
              <p className="italic">Cargando pedidos…</p>
            ) : orders.length === 0 ? (
              <p className="italic">No hay pedidos.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th>Fecha</th>
                    <th>Email</th>
                    <th>Título</th>
                    <th>Para</th>
                    <th>Pack</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td>{new Date(o.created_at).toLocaleString()}</td>
                      <td>{o.email}</td>
                      <td>{o.title}</td>
                      <td>{o.to_name}</td>
                      <td>{o.pack}</td>
                      <td>{o.price} €</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          o.status === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : o.status === 'procesado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="bg-white p-8 rounded-3xl shadow space-y-6">
            <h2 className="text-2xl font-serif">Añadir testimonio</h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl">
                {error}
              </div>
            )}

            <input
              placeholder="Nombre de la persona"
              className="border rounded-xl px-4 py-3 w-full"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              placeholder="Mensaje del testimonio"
              className="border rounded-xl px-4 py-3 w-full min-h-[140px]"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="border rounded-xl px-3 py-2"
                value={form.language}
                onChange={e =>
                  setForm({ ...form, language: e.target.value as Language })
                }
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>
                    Idioma: {l.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-xl px-3 py-2"
                value={form.pack}
                onChange={e =>
                  setForm({ ...form, pack: e.target.value })
                }
              >
                <option value="">Pack (opcional)</option>
                {PACKS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <label className="text-sm font-semibold">Canción del cliente</label>
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
            {audioName && <p className="text-xs">🎵 {audioName}</p>}

            <label className="text-sm font-semibold">Foto de perfil</label>
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
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={e =>
                  setForm({ ...form, visible: e.target.checked })
                }
              />
              Visible en la web
            </label>

            <button
              onClick={handleSaveTestimonial}
              disabled={loading}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold"
            >
              {loading ? 'Guardando…' : 'Guardar testimonio'}
            </button>
          </div>
        )}

        {activeTab === 'blog' && <AdminBlog />}

      </div>
    </section>
  );
};

export default Admin;
