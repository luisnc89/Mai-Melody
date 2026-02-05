import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Language,
  PackType,
  SongOrder,
  MusicalStyle,
  VoiceType,
} from '../types';

import { translations } from '../translations';
import { saveOrder } from '../services/storage';
import PayPalButton from './PayPalButton';
import { ROUTE_SLUGS } from '../routes/slugs';
import { getPackFromSlug } from '../routes/packSlugs';

/* =========================
   🌍 Idiomas soportados
========================= */
const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'ca', 'fr', 'it'];

/* =========================
   🎵 Estilos musicales (valores técnicos)
========================= */
const MUSICAL_STYLES: { value: MusicalStyle; labelKey: string }[] = [
  { value: 'pop', labelKey: 'form_music_pop' },
  { value: 'rock', labelKey: 'form_music_rock' },
  { value: 'acoustic', labelKey: 'form_music_acoustic' },
  { value: 'epic', labelKey: 'form_music_epic' },
  { value: 'reggaeton', labelKey: 'form_music_reggaeton' },
  { value: 'rap', labelKey: 'form_music_rap' },
  { value: 'electronic', labelKey: 'form_music_electronic' },
  { value: 'kids', labelKey: 'form_music_kids' },
];

/* =========================
   🎤 Voces (valores técnicos)
========================= */
const VOICES: { value: VoiceType; labelKey: string }[] = [
  { value: 'male', labelKey: 'form_voice_male' },
  { value: 'female', labelKey: 'form_voice_female' },
  { value: 'kids', labelKey: 'form_voice_kids' },
  { value: 'indifferent', labelKey: 'form_voice_indifferent' },
];

const CreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { lang, pack } = useParams<{ lang: Language; pack: string }>();

  const language: Language =
    lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'es';

  const t = translations[language];

  const selectedPack: PackType | null = pack
    ? getPackFromSlug(pack, language)
    : null;

  if (!selectedPack) {
    navigate(`/${language}/${ROUTE_SLUGS.packs[language]}`, { replace: true });
    return null;
  }

  /* =========================
     🧾 Estado del formulario
  ========================= */
  const [formData, setFormData] = useState<{
    songTitle: string;
    sender: string;
    recipient: string;
    memories: string;
    occasion: string;
    musicalStyle: MusicalStyle;
    voice: VoiceType;
    deliveryEmail: string;
  }>({
    songTitle: '',
    sender: '',
    recipient: '',
    memories: '',
    occasion: 'birthday',
    musicalStyle: 'pop',
    voice: 'indifferent',
    deliveryEmail: '',
  });

  const [showPayment, setShowPayment] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  /* =========================
     💰 Precio por pack
  ========================= */
  const getPriceByPack = () => {
    switch (selectedPack) {
      case 'basico':
        return 25;
      case 'emocion':
        return 39;
      case 'artistico':
        return 49;
      default:
        return 25;
    }
  };

  /* =========================
     🔧 HANDLER CORRECTO (CLAVE)
  ========================= */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData(prev => {
      if (name === 'musicalStyle') {
        return { ...prev, musicalStyle: value as MusicalStyle };
      }

      if (name === 'voice') {
        return { ...prev, voice: value as VoiceType };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  /* =========================
     📦 Crear pedido
  ========================= */
  const createOrder = (status: SongOrder['status']) => {
    const order: SongOrder = {
      id: crypto.randomUUID(),

      pack: selectedPack,
      language,

      title: formData.songTitle,
      story: formData.memories,
      occasion: formData.occasion,

      from: formData.sender,
      to: formData.recipient,
      email: formData.deliveryEmail,

      musicalStyle: formData.musicalStyle,
      voice: formData.voice,

      photos: [],
      status,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="py-32 text-center space-y-6">
        <div className="text-6xl">🦋</div>
        <h2 className="text-4xl font-serif">{t.payment_success}</h2>
        <p className="text-gray-600">{t.approval_notice}</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 space-y-10">
        <button
          type="button"
          onClick={() =>
            navigate(`/${language}/${ROUTE_SLUGS.packs[language]}`)
          }
          className="text-sm font-bold text-violet-600 hover:underline"
        >
          ← {t.back_to_packs}
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            name="songTitle"
            placeholder={t.song_title_label}
            value={formData.songTitle}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="sender"
              placeholder={t.sender_label}
              value={formData.sender}
              onChange={handleInputChange}
              className="bg-gray-50 rounded-2xl p-4"
              required
            />
            <input
              name="recipient"
              placeholder={t.recipient_label}
              value={formData.recipient}
              onChange={handleInputChange}
              className="bg-gray-50 rounded-2xl p-4"
              required
            />
          </div>

          <textarea
            name="memories"
            placeholder={t.memories_placeholder}
            value={formData.memories}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4 min-h-[140px]"
            required
          />

          {/* 🎵 Estilo musical */}
          <select
            name="musicalStyle"
            value={formData.musicalStyle}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
          >
            {MUSICAL_STYLES.map(s => (
              <option key={s.value} value={s.value}>
                {t[s.labelKey]}
              </option>
            ))}
          </select>

          {/* 🎤 Voz */}
          <select
            name="voice"
            value={formData.voice}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
          >
            {VOICES.map(v => (
              <option key={v.value} value={v.value}>
                {t[v.labelKey]}
              </option>
            ))}
          </select>

          <input
            type="email"
            name="deliveryEmail"
            placeholder={t.email_label}
            value={formData.deliveryEmail}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
            required
          />

          {!showPayment && (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-6 rounded-full font-bold text-xl"
            >
              {t.proceed_to_payment}
            </button>
          )}
        </form>

        {showPayment && (
          <div className="pt-12 space-y-8 text-center">
            <p className="font-bold text-lg">
              Total: {getPriceByPack()} €
            </p>

            <PayPalButton
              amount={getPriceByPack()}
              onSuccess={() => createOrder('pendiente')}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CreationForm;
