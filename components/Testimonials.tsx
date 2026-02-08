import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { Language } from '../types'

interface Testimonial {
  id: string
  name: string
  message: string
  rating: number
  language: Language
  song_url: string
  photo: string | null
  pack: string | null
  created_at: string
}

const ITEMS_DESKTOP = 6
const ITEMS_MOBILE = 4

/**
 * 🎁 Packs reales (valor en BD → texto visible)
 */
const PACK_LABELS: Record<string, string> = {
  basic: 'Pack Básico',
  emotion: 'Pack Emoción',
  artistic: 'Pack Artístico',
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const Testimonials: React.FC<{ lang: Language }> = ({ lang }) => {
  const [items, setItems] = useState<Testimonial[]>([])
  const [index, setIndex] = useState(0)
  const [perPage, setPerPage] = useState(ITEMS_DESKTOP)

  /* =====================
     LOAD TESTIMONIALS
  ===================== */
  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('visible', true)
      .eq('language', lang)
      .order('created_at', { ascending: false })
      .then(({ data }) => setItems(data || []))
  }, [lang])

  /* =====================
     RESPONSIVE PAGINATION
  ===================== */
  useEffect(() => {
    const update = () => {
      setPerPage(
        window.innerWidth < 768
          ? ITEMS_MOBILE
          : ITEMS_DESKTOP
      )
    }

    update()
    window.addEventListener('resize', update)
    return () =>
      window.removeEventListener('resize', update)
  }, [])

  if (!items.length) return null

  const maxIndex = Math.max(0, items.length - perPage)
  const visible = items.slice(index, index + perPage)

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <h2 className="text-4xl font-serif text-center">
          Lo que dicen nuestros clientes
        </h2>

        {/* CONTROLS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() =>
              setIndex(i => Math.max(0, i - perPage))
            }
            disabled={index === 0}
            className="px-3 py-2 rounded-full border disabled:opacity-30"
          >
            ←
          </button>

          <button
            onClick={() =>
              setIndex(i =>
                Math.min(maxIndex, i + perPage)
              )
            }
            disabled={index >= maxIndex}
            className="px-3 py-2 rounded-full border disabled:opacity-30"
          >
            →
          </button>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visible.map(t => (
            <div
              key={t.id}
              className="bg-gray-50 p-6 rounded-3xl space-y-4"
            >
              <p className="italic text-sm leading-relaxed">
                “{t.message}”
              </p>

              {/* USER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                      {t.name.charAt(0)}
                    </div>
                  )}

                  <div className="leading-tight">
                    <strong className="block text-sm">
                      {t.name}
                    </strong>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {t.pack && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-200">
                          {PACK_LABELS[t.pack] || t.pack}
                        </span>
                      )}

                      <span>
                        {formatDate(t.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-sm">
                  ⭐ {t.rating}
                </span>
              </div>

              <audio
                controls
                src={t.song_url}
                className="w-full h-8"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
