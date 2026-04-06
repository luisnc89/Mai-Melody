import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Language } from '../types'
import { translations } from '../translations'
import { ROUTE_SLUGS } from '../routes/slugs'

const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it']

const AboutUs: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>()

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es'

  const t = translations[language]

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 xl:gap-16 items-center">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
            {t.about_badge}
          </span>

          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
            {t.about_title}
          </h1>

          <p className="text-lg md:text-xl text-violet-600 mb-8 leading-8">
            {t.about_intro}
          </p>

          <div className="space-y-5 text-slate-600 leading-8 text-base md:text-lg">
            <p>{t.about_p1}</p>
            <p>{t.about_p2}</p>
            <p>{t.about_p3}</p>
            <p>{t.about_p4}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to={`/${language}/${ROUTE_SLUGS.packs[language]}`}
              className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-slate-900 text-white font-semibold shadow-md hover:opacity-95 transition"
            >
              {t.about_cta}
            </Link>

            <Link
              to={`/${language}/${ROUTE_SLUGS.how[language]}`}
              className="inline-flex items-center justify-center rounded-full px-8 py-4 border-2 border-violet-300 text-slate-700 font-semibold hover:bg-violet-50 transition"
            >
              {t.about_secondary_cta}
            </Link>
          </div>

          <p className="mt-8 text-violet-600 italic text-lg md:text-xl font-medium">
            {t.quote}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="rounded-[2.2rem] overflow-hidden shadow-[0_20px_60px_rgba(80,60,120,0.18)] bg-white border border-violet-100 max-w-[560px]">
            <img
              src="/assets/about-us-family-lowpoly.png"
              alt="Ilustración artística inspirada en una familia y en los recuerdos emocionales de MaiMelody"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs