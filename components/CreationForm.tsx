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

interface PhotoWithStyle {
  image: string;
  style?: ImageStyle;
}

const artisticStyles: ImageStyle[] = [
  'Foto Original',
  'Acuarela',
  'Anime 2D',
  'Cartoon Mágico',
  'Lápiz',
  'Cómic',
  'Blanco y Negro',
  'Animación 3D',
];

const CreationForm: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const navigate = useNavigate();
  const { pack } = useParams<{ pack: PackType }>();

  const selectedPack: PackType =
    pack === 'basico' || pack === 'emocion' || pack === 'artistico'
      ? pack
      : 'basico';

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
  const [orderComplete, setOrderComplete] = useState(false);

  const getPriceByPack = () => {
    if (selectedPack === 'basico') return 25;
    if (selectedPack === 'emocion') return 39;
    return 49;
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
              resolve({
                image: reader.result as string,
                style:
                  selectedPack === 'artistico'
                    ? 'Foto Original'
                    : undefined,
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    setPhotos(prev => [...prev, ...images].slice(0, 15));
  };

  const updatePhotoStyle = (index: number, style: ImageStyle) => {
    setPhotos(prev =>
      prev.map((p, i) => (i === index ? { ...p, style } : p))
    );
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
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
      imageStyle:
        selectedPack === 'artistico' ? photos[0]?.style : undefined,

      status: 'pendiente',
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
          onClick={() => navigate('/packs')}
          className="text-sm font-semibold text-violet-600 hover:underline"
        >
          ← Volver a los packs
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">

          <input
            name="songTitle"
            placeholder={t.song_title_label}
            value={formData.songTitle}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
            required
            disabled={showPayment}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="sender"
              placeholder={t.sender_label}
              value={formData.sender}
              onChange={handleInputChange}
              className="bg-gray-50 rounded-2xl p-4"
              required
              disabled={showPayment}
            />
            <input
              name="recipient"
              placeholder={t.recipient_label}
              value={formData.recipient}
              onChange={handleInputChange}
              className="bg-gray-50 rounded-2xl p-4"
              required
              disabled={showPayment}
            />
          </div>

          <textarea
            name="memories"
            placeholder={t.memories_placeholder}
            value={formData.memories}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4 min-h-[140px]"
            required
            disabled={showPayment}
          />

          <select
            name="musicalStyle"
            value={formData.musicalStyle}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
            disabled={showPayment}
          >
            {['Pop','Rock','Balada','Reggaeton','Rap','Electrónica','Infantil'].map(s =>
              <option key={s}>{s}</option>
            )}
          </select>

          <select
            name="voice"
            value={formData.voice}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
            disabled={showPayment}
          >
            {['Masculina','Femenina','Infantil','Indiferente'].map(v =>
              <option key={v}>{v}</option>
            )}
          </select>

          {(selectedPack === 'emocion' || selectedPack === 'artistico') && (
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={showPayment}
            />
          )}

          {selectedPack === 'artistico' && photos.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6">
              {photos.map((photo, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <img
                    src={photo.image}
                    alt=""
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <select
                    value={photo.style}
                    onChange={(e) =>
                      updatePhotoStyle(i, e.target.value as ImageStyle)
                    }
                    className="w-full rounded-xl p-2"
                    disabled={showPayment}
                  >
                    {artisticStyles.map(style => (
                      <option key={style}>{style}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="text-xs text-red-500 underline"
                    disabled={showPayment}
                  >
                    Eliminar foto
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="email"
            name="deliveryEmail"
            placeholder={t.email_label}
            value={formData.deliveryEmail}
            onChange={handleInputChange}
            className="w-full bg-gray-50 rounded-2xl p-4"
            required
            disabled={showPayment}
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
          <div className="pt-12 space-y-6 animate-fade-in">
            <h3 className="text-2xl font-serif text-center">
              Confirmación de pago seguro
            </h3>

            <p className="text-center font-semibold">
              Total: {getPriceByPack()} €
            </p>

            <PayPalButton
              amount={getPriceByPack()}
              onSuccess={handlePaymentSuccess}
            />

            <p className="text-xs text-gray-500 text-center">
              🔒 Pago seguro gestionado por PayPal
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default CreationForm;
