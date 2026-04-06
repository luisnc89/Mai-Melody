import { Language, PackType } from '../types'

/*
  =====================================================
  🌍 SLUGS DE RUTAS PRINCIPALES (SEO + Idiomas)
  =====================================================
  👉 Aquí se controla TODA la estructura de URLs
  👉 Cambiar algo aquí afecta a toda la app
*/

export const ROUTE_SLUGS = {
  home: {
    es: '',
    en: '',
    ca: '',
    fr: '',
    it: '',
  },

  about: {
    es: 'sobre-nosotros',
    en: 'about-us',
    ca: 'sobre-nosaltres',
    fr: 'a-propos',
    it: 'chi-siamo',
  },

  packs: {
    es: 'packs',
    en: 'packs',
    ca: 'packs',
    fr: 'packs',
    it: 'packs',
  },

  create: {
    es: 'crear',
    en: 'create',
    ca: 'crear',
    fr: 'creer',
    it: 'creare',
  },

  how: {
    es: 'como-funciona',
    en: 'how-it-works',
    ca: 'com-funciona',
    fr: 'comment-ca-marche',
    it: 'come-funziona',
  },

  blog: {
    es: 'blog',
    en: 'blog',
    ca: 'blog',
    fr: 'blog',
    it: 'blog',
  },

  admin: {
    es: 'admin',
    en: 'admin',
    ca: 'admin',
    fr: 'admin',
    it: 'admin',
  },
} satisfies Record<string, Record<Language, string>>

/*
  =====================================================
  🎁 SLUGS DE PACKS (URL visible)
  =====================================================
  👉 El ID interno del pack NO cambia
  👉 El slug SÍ cambia según idioma
*/

export const PACK_SLUGS: Record<
  PackType,
  Record<Language, string>
> = {
  basico: {
    es: 'basico',
    en: 'basic',
    ca: 'basic',
    fr: 'basique',
    it: 'base',
  },

  emocion: {
    es: 'emocion',
    en: 'emotion',
    ca: 'emocion',
    fr: 'emotion',
    it: 'emozione',
  },

  artistico: {
    es: 'artistico',
    en: 'artistic',
    ca: 'artistic',
    fr: 'artistique',
    it: 'artistico',
  },
}