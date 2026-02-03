import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Language,
  PackType,
  SongOrder,
  ImageStyle,
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

interface PhotoWithStyle {
  image: string;
  style?: ImageStyle;
}

/* =========================
   🎵 Estilos musicales
========================= */
const getMusicalStyles = (language: Language): string[] => {
  switch (language) {
    case 'en':
      return ['Pop', 'Rock', 'Ballad', 'Acoustic', 'Reggaeton', 'Rap', 'Electronic', 'Children'];
    case 'ca':
      return ['Pop', 'Rock', 'Balada', 'Acústic', 'Reggaeton', 'Rap', 'Electrònica', 'Infantil'];
    case 'fr':
      return ['Pop', 'Rock', 'Ballade', 'Acoustique', 'Reggaeton', 'Rap', 'Électronique', 'Enfant'];
    case 'it':
      return ['Pop', 'Rock', 'Ballata', 'Acustico', 'Reggaeton', 'Rap', 'Elettronica', 'Infantile'];
    default:
      return ['Pop', 'Rock', 'Balada', 'Acústico', 'Reggaeton', 'Rap', 'Electrónica', 'Infantil'];
  }
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

  const [formData, setFormData] = useState({
    songTitle: '',
    sender: '',
    recipient: '',
    memories: '',
    occasion: 'Birthday',
    musicalStyle: 'Pop' as MusicalStyle,
    voice: 'Indiferente' as VoiceType,
    deliveryEmail: '',
  });

  const [photos, setPhotos] = useState<PhotoWithStyle[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).slice(0, 15);

    const images = await Promise.all(
      files.map(
        file =>
          new Promise<PhotoWithStyle>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ image: reader.result as string });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    setPhotos(prev => [...prev, ...images].slice(0, 15));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

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
      photos: photos.map(p => p.image),
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
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-12 space-y-10">

        <button
          type="button"
          onClick={() => navigate(`/${language}/${ROUTE_SLUGS.packs[language]}`)}
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

          <select
            name="musicalStyle"
            value={formData.musicalStyle}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
          >
            {getMusicalStyles(language).map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>

          <select
            name="voice"
            value={formData.voice}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
          >
            {['Masculina', 'Femenina', 'Infantil', 'Indiferente'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {(selectedPack === 'emocion' || selectedPack === 'artistico') && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          )}

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
            <p className="font-bold text-lg">Total: {getPriceByPack()} €</p>

            <PayPalButton
              amount={getPriceByPack()}
              onSuccess={() => createOrder('pendiente')}
            />

            <div className="max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => setShowBankTransfer(prev => !prev)}
                className="w-full flex justify-between px-6 py-4 rounded-full border font-semibold"
              >
                🏦 Pagar por transferencia bancaria
                <span>{showBankTransfer ? '−' : '+'}</span>
              </button>

              {showBankTransfer && (
                <div className="mt-6 p-6 rounded-3xl bg-gray-50 border space-y-4 text-sm">
                  <p><strong>Titular:</strong> MaiMelody</p>
                  <p><strong>IBAN:</strong> ES95 0182 1828 0702 0151 9096</p>
                  <p><strong>Concepto:</strong> Pedido + tu email</p>

                  <button
                    type="button"
                    onClick={() => createOrder('pendiente_transferencia')}
                    className="w-full mt-6 bg-gray-900 text-white py-4 rounded-full font-bold"
                  >
                    He realizado la transferencia
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default CreationForm;
