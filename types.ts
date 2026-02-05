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
   🎨 ESTILOS DE IMAGEN (PACK ARTÍSTICO)
   ⚠️ Valores internos estables (NO traducidos)
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

export type OrderStatus = 'pendiente' | 'en_proceso' | 'completado';


/* =========================
   🎵 ESTILO MUSICAL
   ✅ ALINEADO CON CreationForm.tsx
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
   ✅ ALINEADO CON CreationForm.tsx
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

  title: string;
  story: string;
  occasion: string;

  from: string;
  to: string;

  email: string;

  musicalStyle: MusicalStyle;
  voice: VoiceType;

  photos: string[];

  status: OrderStatus;
  createdAt: string;
}


/* =========================
   📊 GOOGLE ANALYTICS (GLOBAL)
   SOLO PARA TYPESCRIPT
========================= */

export {};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
