
export type Language = 'es' | 'en' | 'fr' | 'it' | 'ca';

export type Section = 
  | 'inicio' 
  | 'crea' 
  | 'funciona' 
  | 'video-ia' 
  | 'blog' 
  | 'blog-post' 
  | 'admin' 
  | 'login';

export type PackType = 'basico' | 'emocion' | 'artistico';

export interface PhotoWithStyle {
  file: File;
  preview: string;
  style?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>;
  date: string;
  image: string;
}

export interface SongRequest {
  id: string;
  songTitle: string;
  senderName: string;
  recipientName: string;
  memories: string;
  occasion: string;
  language: string;
  musicalStyle: string;
  voice: 'Masculina' | 'Femenina' | 'Indiferente';
  deliveryEmail: string;
  status: 'pendiente' | 'letra_enviada' | 'completada';
}
