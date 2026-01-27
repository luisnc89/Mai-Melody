
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface LoginProps {
  language: Language;
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ language, onLogin }) => {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified auth for the demo
    if (email === 'admin@maimelody.com' && password === 'admin123') {
      onLogin(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-warm-white">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-violet-100 space-y-8 fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-xl">M</div>
          <h1 className="text-3xl font-serif text-gray-900">{t.login_title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 animate-bounce">
              {t.login_error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.login_email}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-violet-400 outline-none transition-all"
              placeholder="admin@maimelody.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.login_password}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-violet-400 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-5 rounded-full font-bold text-lg hover:bg-violet-600 transition-all shadow-xl"
          >
            {t.login_button}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
