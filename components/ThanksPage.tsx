import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { translations } from '../translations'

const ThanksPage: React.FC = () => {
  const { lang } = useParams<{ lang: string }>()
  const t = translations[lang as keyof typeof translations]

  useEffect(() => {
    document.title = t.thanks_title

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, follow'
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [t])

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="mb-6 text-3xl font-bold">
        {t.thanks_heading}
      </h1>

      <p className="mb-4 text-lg">
        {t.thanks_confirm}
      </p>

      <p className="mb-4">
        {t.thanks_next_steps}
      </p>

      <p className="text-sm text-gray-500">
        {t.thanks_contact}
      </p>
    </div>
  )
}

export default ThanksPage