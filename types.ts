/* =========================
   IDIOMAS
========================= */

export type Language = 'es' | 'en' | 'fr' | 'it' | 'ca';


/* =========================
   SECCIONES / RUTAS
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
   PACKS
========================= */

export type PackType = 'basico' | 'emocion' | 'artistico';


/* =========================
   ESTILOS DE IMAGEN (PACK ARTÍSTICO)
========================= */

export type ImageStyle =
  | 'Foto Original'
  | 'Acuarela'
  | 'Anime 2D'
  | 'Cartoon Mágico'
  | 'Lápiz'
  | 'Cómic'
  | 'Blanco y Negro'
  | 'Animación 3D';


/* =========================
   ESTADO DEL PEDIDO
========================= */

export type OrderStatus = 'pendiente' | 'en_proceso' | 'completado';


/* =========================
   ESTILO MUSICAL
========================= */

export type MusicalStyle =
  | 'Pop'
  | 'Rock'
  | 'Balada'
  | 'Reggaeton'
  | 'Rap'
  | 'Electrónica'
  | 'Infantil';


/* =========================
   VOZ
========================= */

export type VoiceType =
  | 'Masculina'
  | 'Femenina'
  | 'Infantil'
  | 'Indiferente';


/* =========================
   IMÁGENES SUBIDAS
========================= */

export interface PhotoWithStyle {
  file: File;
  preview: string;
}


/* =========================
   BLOG
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
   PEDIDO (FRONT + ADMIN)
========================= */

export interface SongOrder {
  id: string;

  pack: PackType;
  language: Language;

  title: string;
  story: string;
  occasion: string;

  from: string;
  to: string;

  email: string;

  /* 🎵 NUEVO */
  musicalStyle: MusicalStyle;

  /* 🎤 NUEVO */
  voice: VoiceType;

  photos: string[];
  imageStyle?: ImageStyle;

  status: OrderStatus;

  createdAt: string;
}
