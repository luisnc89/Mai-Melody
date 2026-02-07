import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Language } from '../types'

interface Props {
  children: React.ReactNode
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const { lang } = useParams<{ lang: Language }>()
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuth(!!data.session)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return null
  }

  if (!isAuth) {
    return <Navigate to={`/${lang ?? 'es'}/admin/login`} replace />
  }

  return <>{children}</>
}

export default AdminRoute
