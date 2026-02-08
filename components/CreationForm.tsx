import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Language,
  PackType,
  SongOrder,
  MusicalStyle,
  VoiceType,
  ImageStyle,
  PACK_FEATURES,
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
   🎵 Estilos musicales
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
   🎤 Voces
========================= */
const VOICES: { value: VoiceType; labelKey: string }[] = [
  { value: 'male', labelKey: 'form_voice_male' },
  { value: 'female', labelKey: 'form_voice_female' },
  { value: 'kids', labelKey: 'form_voice_kids' },
  { value: 'indifferent', labelKey: 'form_voice_indifferent' },
];

/* =========================
   🎨 Estilos de imagen
========================= */
const IMAGE_STYLES: ImageStyle[] = [
  'original',
  'watercolor',
  'anime',
  'cartoon',
  'pencil',
  'comic',
  'bw',
  'animation_3d',
];

/* =========================
   🎨 Traducciones de estilos
========================= */
const IMAGE_STYLE_LABEL_KEYS: Record<ImageStyle, string> = {
  original: 'artistic_original_label',
  watercolor: 'style_watercolor',
  anime: 'style_anime',
  cartoon: 'style_cartoon',
  pencil: 'style_pencil',
  comic: 'style_comic',
  bw: 'style_bw_art',
  animation_3d: 'style_animation_3d',
};

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

  const [photos, setPhotos] = useState<File[]>([]);
  const [imageStyles, setImageStyles] = useState<ImageStyle[]>([]);

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
     🔧 Handlers
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

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).slice(
      0,
      PACK_FEATURES[selectedPack].maxPhotos
    );

    setPhotos(files);

    if (PACK_FEATURES[selectedPack].artisticStylesPerPhoto) {
      setImageStyles(files.map(() => 'original'));
    }
  };

  const handleImageStyleChange = (index: number, style: ImageStyle) => {
    setImageStyles(prev =>
      prev.map((s, i) => (i === index ? style : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  /* =========================
     📦 Crear pedido
  ========================= */
  const createOrder = (status: SongOrder['status']) => {
    const packFeatures = PACK_FEATURES[selectedPack];

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

      photos: photos.map(p => p.name),
      imageStyles: packFeatures.artisticStylesPerPhoto
        ? imageStyles
        : undefined,

      includesVideo: packFeatures.video,
      includesPdfLyrics: packFeatures.pdfLyrics,

      status,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    setOrderComplete(true);
  };

const submitOrderToBackend = async () => {
  const data = new FormData();

  data.append('email', formData.deliveryEmail);
  data.append('pack', selectedPack);
  data.append('title', formData.songTitle);
  data.append('from_name', formData.sender);
  data.append('to_name', formData.recipient);
  data.append('story', formData.memories);
  data.append('occasion', formData.occasion);
  data.append('musicalStyle', formData.musicalStyle);
  data.append('voice', formData.voice);

  photos.forEach(photo => {
    data.append('photos', photo);
  });

  if (selectedPack === 'artistico') {
    data.append('imageStyles', JSON.stringify(imageStyles));
  }

  const res = await fetch('/api/create-order', {
    method: 'POST',
    body: data,
  });

  if (!res.ok) {
    throw new Error('Error creating order');
  }
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
          className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-violet-600"
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

          {(selectedPack === 'emocion' || selectedPack === 'artistico') && (
            <div className="space-y-4">
              <input
                id="photos-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="sr-only"
              />

              <label
                htmlFor="photos-input"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm cursor-pointer
                bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400
                text-white shadow-lg transition-all duration-300
                hover:scale-[1.03] hover:shadow-xl"
              >
                📷 {t.form_upload_photos}
              </label>

              {photos.length > 0 && (
                <p className="text-sm text-gray-600">
                  {t.form_photos_selected.replace(
                    '{{count}}',
                    String(photos.length)
                  )}
                </p>
              )}

              {selectedPack === 'artistico' && photos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-2xl p-4 space-y-3"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt=""
                        className="w-full h-40 object-cover rounded-xl"
                      />

                      <select
                        value={imageStyles[index]}
                        onChange={e =>
                          handleImageStyleChange(
                            index,
                            e.target.value as ImageStyle
                          )
                        }
                        className="w-full bg-white rounded-xl p-2"
                      >
                        {IMAGE_STYLES.map(style => (
                          <option key={style} value={style}>
                            {t[IMAGE_STYLE_LABEL_KEYS[style]]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {t.form_music_style_label}
              </label>
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {t.form_voice_label}
              </label>
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
            </div>
          </div>

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
  onSuccess={async () => {
    try {
      await submitOrderToBackend();
      setOrderComplete(true);
    } catch (e) {
      alert('Error al crear el pedido');
      console.error(e);
    }
  }}
/>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreationForm;
