import { Language, PackType } from '../types';
import { PACK_SLUGS } from './slugs';

/*
  =====================================================
  🎁 Conversión Pack interno ⇄ Slug URL
  =====================================================

  - Fuente única de verdad: PACK_SLUGS
  - Nunca se hardcodean strings en componentes
*/

/**
 * Devuelve el slug de un pack para un idioma
 * Ej: getPackSlug('basico', 'es') → "basico"
 */
export const getPackSlug = (
  pack: PackType,
  lang: Language
): string => {
  return PACK_SLUGS[pack][lang];
};

/**
 * Convierte un slug de URL en PackType interno
 * Ej: "pack-emocion" → "emocion"
 *
 * Devuelve null si no hay coincidencia válida
 */
export const getPackFromSlug = (
  slug: string,
  lang: Language
): PackType | null => {
  for (const [pack, values] of Object.entries(PACK_SLUGS)) {
    if (values[lang] === slug) {
      return pack as PackType;
    }
  }

  return null;
};
