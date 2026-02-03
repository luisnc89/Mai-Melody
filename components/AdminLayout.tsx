import React from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Language } from '../types';

const AdminLayout: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(`/${lang}/admin/login`);
  };

  const base = `/${lang}/admin`;

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif">Gestión MaiMelody</h1>
            <p className="text-sm text-gray-500 mt-1">
              Panel privado para administrar pedidos y blog
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white px-6 py-3 rounded-full w-fit"
          >
            Salir
          </button>
        </div>

        {/* NAV */}
        <div className="bg-white rounded-full border border-gray-100 p-2 inline-flex gap-2 shadow-sm">
          <NavLink
            to={base}
            end
            className={({ isActive }) =>
              `px-6 py-2 rounded-full text-sm font-bold transition ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            Pedidos
          </NavLink>

          <NavLink
            to={`${base}/blog`}
            className={({ isActive }) =>
              `px-6 py-2 rounded-full text-sm font-bold transition ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            Blog
          </NavLink>
        </div>

        {/* CONTENT */}
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
