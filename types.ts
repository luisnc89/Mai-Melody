/* =========================
   🌍 IDIOMAS
========================= */

export type Language = 'es' | 'en' | 'fr' | 'it' | 'ca';


/* =========================
   🧭 SECCIONES / RUTAS
========================= */

export type Section =
  | 'inicio'
  | 'crea'
  | 'funciona'
  | 'video-ia'
  | 'blog'
  | 'blog-post'
  | 'admin'
  | 'login';


/* =========================
   📦 PACKS
========================= */

export type PackType = 'basico' | 'emocion' | 'artistico';


/* =========================
   📦 CONFIGURACIÓN DE PACKS
   (Fuente única de verdad)
========================= */

export interface PackFeatures {
  songs: number;               // Nº de canciones incluidas
  pdfLyrics: boolean;          // Letra en PDF
  video: boolean;              // Incluye vídeo
  maxPhotos: number;           // Nº máximo de imágenes
  artisticStylesPerPhoto: boolean; // Elegir estilo por foto
}

export const PACK_FEATURES: Record<PackType, PackFeatures> = {
  basico: {
    songs: 2,
    pdfLyrics: true,
    video: false,
    maxPhotos: 0,
    artisticStylesPerPhoto: false,
  },
  emocion: {
    songs: 2,
    pdfLyrics: true,
    video: true,
    maxPhotos: 15,
    artisticStylesPerPhoto: false,
  },
  artistico: {
    songs: 2,
    pdfLyrics: true,
    video: true,
    maxPhotos: 15,
    artisticStylesPerPhoto: true,
  },
};


/* =========================
   🎨 ESTILOS DE IMAGEN
   (PACK ARTÍSTICO)
========================= */

export type ImageStyle =
  | 'original'
  | 'watercolor'
  | 'anime'
  | 'cartoon'
  | 'pencil'
  | 'comic'
  | 'bw'
  | 'animation_3d';


/* =========================
   📌 ESTADO DEL PEDIDO
========================= */

export type OrderStatus =
  | 'pendiente'
  | 'en_proceso'
  | 'completado';


/* =========================
   🎵 ESTILO MUSICAL
========================= */

export type MusicalStyle =
  | 'pop'
  | 'rock'
  | 'acoustic'
  | 'epic'
  | 'reggaeton'
  | 'rap'
  | 'electronic'
  | 'kids';


/* =========================
   🎤 VOZ
========================= */

export type VoiceType =
  | 'male'
  | 'female'
  | 'kids'
  | 'indifferent';


/* =========================
   📰 BLOG
========================= */

export interface BlogPost {
  id: string;
  slug: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>;
  date: string;
  image: string;
}


/* =========================
   🎼 PEDIDO (FRONT + ADMIN)
========================= */

export interface SongOrder {
  id: string;

  pack: PackType;
  language: Language;

  /* 🎵 Canción */
  title: string;
  story: string;
  occasion: string;

  from: string;
  to: string;
  email: string;

  musicalStyle: MusicalStyle;
  voice: VoiceType;

  /* 📸 Contenido multimedia */
  photos: string[];

  /**
   * Solo para PACK ARTÍSTICO
   * El índice coincide con photos[]
   */
  imageStyles?: ImageStyle[];

  /**
   * Metadatos derivados del pack
   * (se guardan para evitar ambigüedades futuras)
   */
  includesVideo: boolean;
  includesPdfLyrics: boolean;

  status: OrderStatus;
  createdAt: string;
}


/* =========================
   📊 GOOGLE ANALYTICS
========================= */

export {};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
