import { Language, PackType } from '../types';
import { PACK_SLUGS } from './slugs';

/*
  =====================================================
  🎁 Conversión Pack interno ⇄ Slug URL
  =====================================================
*/

export const getPackSlug = (
  pack: PackType,
  lang: Language
): string => {
  return PACK_SLUGS[pack][lang];
};

export const getPackFromSlug = (
  slug: string,
  lang: Language
): PackType | null => {
  const entry = Object.entries(PACK_SLUGS).find(
    ([, values]) => values[lang] === slug
  );
  return entry ? (entry[0] as PackType) : null;
};
