
import React from 'react';
import { Language, SongRequest } from '../types';
import { translations } from '../translations';

interface AdminProps {
  language: Language;
  onLogout: () => void;
}

// Mock data - In a real app, this would come from Supabase
const MOCK_ORDERS: SongRequest[] = [
  {
    id: 'ORD-001',
    songTitle: 'Aniversario Marta',
    senderName: 'Carlos',
    recipientName: 'Marta',
    memories: '10 años juntos, viaje a Roma...',
    occasion: 'Anniversary',
    language: 'Spanish',
    musicalStyle: 'Pop',
    voice: 'Femenina',
    deliveryEmail: 'carlos@example.com',
    status: 'pendiente'
  },
  {
    id: 'ORD-002',
    songTitle: 'Feliz 60 Joan',
    senderName: 'Família',
    recipientName: 'Joan',
    memories: 'Millor avi del món, amant de la mar...',
    occasion: 'Birthday',
    language: 'Catalan',
    musicalStyle: 'Balada',
    voice: 'Masculina',
    deliveryEmail: 'nuria@example.com',
    status: 'letra_enviada'
  }
];

const Admin: React.FC<AdminProps> = ({ language, onLogout }) => {
  const t = translations[language];

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">M</div>
            <div>
              <h1 className="text-2xl font-serif text-gray-900">{t.admin_dashboard}</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            {t.admin_logout}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Stats */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pedidos</p>
              <p className="text-4xl font-serif text-gray-900">128</p>
            </div>
            <div className="bg-violet-600 p-6 rounded-3xl shadow-lg space-y-2 text-white">
              <p className="text-xs font-bold text-violet-200 uppercase tracking-widest">Pendientes</p>
              <p className="text-4xl font-serif">12</p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-serif text-gray-900">{t.admin_orders}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Título</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{order.songTitle}</td>
                        <td className="px-6 py-4">{order.senderName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'pendiente' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {order.status === 'pendiente' ? t.admin_status_pending : 'Enviado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-violet-600 font-bold hover:underline">Ver detalles</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
