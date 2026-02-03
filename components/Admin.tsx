import React, { useEffect, useState } from 'react';
import { SongOrder, OrderStatus } from '../types';
import { getOrders, clearOrders } from '../services/storage';
import AdminBlog from './AdminBlog';

type Tab = 'orders' | 'blog';

const packLabels: Record<SongOrder['pack'], string> = {
  basico: 'Básico',
  emocion: 'Emoción',
  artistico: 'Artístico',
};

const packColors: Record<SongOrder['pack'], string> = {
  basico: 'bg-gray-200 text-gray-800',
  emocion: 'bg-pink-200 text-pink-900',
  artistico: 'bg-violet-200 text-violet-900',
};

const statusLabels: Record<OrderStatus, string> = {
  pendiente: '🕓 Pendiente',
  en_proceso: '✍️ En proceso',
  completado: '✅ Completado',
};

const statusColors: Record<OrderStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-blue-100 text-blue-800',
  completado: 'bg-green-100 text-green-800',
};

const STORAGE_KEY = 'maimelody_orders';

interface AdminProps {
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<SongOrder[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  useEffect(() => {
    const stored = getOrders().map((o: any, index: number) => ({
      id: o.id ?? `legacy-${index}`,
      ...o,
      status: o.status ?? 'pendiente',
    }));
    setOrders(stored);
  }, []);

  const updateStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status } : order
    );
    setOrders(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteOrder = (id: string) => {
    if (!confirm('¿Seguro que quieres borrar este pedido?')) return;
    const updated = orders.filter(order => order.id !== id);
    setOrders(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (!confirm('¿Seguro que quieres borrar TODOS los pedidos?')) return;
    clearOrders();
    setOrders([]);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-serif">Gestión MaiMelody</h1>
            <p className="text-sm text-gray-500 mt-1">
              Panel privado de administración
            </p>
          </div>

          <button
            onClick={onLogout}
            className="bg-gray-900 text-white px-6 py-3 rounded-full w-fit"
          >
            Salir
          </button>
        </div>

        {/* TABS */}
        <div className="bg-white p-2 rounded-full border border-gray-100 inline-flex gap-2 shadow-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition ${
              activeTab === 'orders'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pedidos
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition ${
              activeTab === 'blog'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Blog
          </button>
        </div>

        {/* =======================
            TAB: PEDIDOS
        ======================= */}
        {activeTab === 'orders' && (
          <>
            {orders.length === 0 && (
              <p className="text-gray-500 italic">
                No hay pedidos todavía.
              </p>
            )}

            {orders.length > 0 && (
              <div className="grid gap-6">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-3xl shadow border border-gray-100 space-y-4 relative"
                  >
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="absolute top-4 right-4 text-red-500 text-xs font-bold hover:underline"
                    >
                      🗑️ Eliminar
                    </button>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <h2 className="text-xl font-bold">{order.title}</h2>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${packColors[order.pack]}`}>
                          {packLabels[order.pack]}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold w-fit"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="completado">Completado</option>
                    </select>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <p><strong>Dedica:</strong> {order.from}</p>
                      <p><strong>Recibe:</strong> {order.to}</p>
                      <p><strong>Ocasión:</strong> {order.occasion}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>🎵 Estilo musical:</strong> {order.musicalStyle}</p>
                      <p><strong>🎤 Voz:</strong> {order.voice}</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 text-sm">
                      <strong>Historia:</strong>
                      <p className="mt-1 whitespace-pre-line">{order.story}</p>
                    </div>

                    <p className="text-xs text-gray-400 text-right">
                      {new Date(order.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {orders.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-500 underline"
              >
                Borrar todo el historial
              </button>
            )}
          </>
        )}

        {/* =======================
            TAB: BLOG
        ======================= */}
        {activeTab === 'blog' && <AdminBlog />}

      </div>
    </section>
  );
};

export default Admin;
