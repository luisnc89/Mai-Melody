import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Language } from '../types';

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { lang } = useParams<{ lang: Language }>();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuth(!!data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (!isAuth) {
    return <Navigate to={`/${lang}/admin/login`} replace />;
  }

  return children;
};
