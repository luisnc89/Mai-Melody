import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { Language } from '../types';

const Login: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError('Credenciales incorrectas');
      return;
    }

    navigate(`/${lang}/admin`);
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-warm-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl space-y-6"
      >
        <h1 className="text-3xl font-serif text-center">
          Gestión MaiMelody
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl border"
        />

        <input
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl border"
        />

        <button
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-full font-bold"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
