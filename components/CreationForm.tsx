
import React, { useState } from 'react';
import { Language, PackType, PhotoWithStyle } from '../types';
import { translations } from '../translations';

interface CreationFormProps {
  language: Language;
  selectedPack: PackType;
}

const CreationForm: React.FC<CreationFormProps> = ({ language, selectedPack }) => {
  const t = translations[language];
  
  const occasions = [
    { value: 'Birthday', label: t.form_occasion_birthday },
    { value: 'Love', label: t.form_occasion_love },
    { value: 'Anniversary', label: t.form_occasion_anniversary },
    { value: 'Friendship', label: t.form_occasion_friendship },
    { value: 'Tribute', label: t.form_occasion_tribute },
    { value: 'Other', label: t.form_occasion_other }
  ];

  const voices = [
    { value: 'Male', label: t.form_voice_male },
    { value: 'Female', label: t.form_voice_female },
    { value: 'Indifferent', label: t.form_voice_indifferent }
  ];

  const [formData, setFormData] = useState({
    songTitle: '',
    sender: '',
    recipient: '',
    memories: '',
    occasion: occasions[0].value,
    language: 'Español',
    musicalStyle: 'Pop',
    voice: voices[2].value,
    deliveryEmail: ''
  });
  const [photos, setPhotos] = useState<PhotoWithStyle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).slice(0, 15) as File[];
      const newPhotos: PhotoWithStyle[] = filesArr.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        style: selectedPack === 'artistico' ? 'watercolor' : undefined
      }));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 15));
    }
  };

  const updatePhotoStyle = (index: number, style: string) => {
    const newPhotos = [...photos];
    newPhotos[index].style = style;
    setPhotos(newPhotos);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handleFinalPayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
    }, 2000);
  };

  const artisticStyles = [
    { id: 'watercolor', name: t.style_watercolor },
    { id: 'anime', name: t.style_anime },
    { id: 'cartoon', name: t.style_cartoon },
    { id: 'pencil', name: t.style_pencil },
    { id: 'comic', name: t.style_comic },
    { id: 'bw', name: t.style_bw_art }
  ];

  if (orderComplete) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto">✓</div>
        <h2 className="text-4xl font-serif text-gray-900">{t.payment_success}</h2>
        <p className="text-gray-600">{t.approval_notice}</p>
        <div className="text-violet-400 text-6xl butterfly-float">🦋</div>
      </div>
    );
  }

  const getPackName = () => {
    if (selectedPack === 'basico') return t.pack_basico;
    if (selectedPack === 'emocion') return t.pack_emocion;
    return t.pack_artistico;
  };

  if (showPayment) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-violet-100 text-center space-y-8">
          <div className="inline-block px-4 py-1 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
            {t.step_final}
          </div>
          <h2 className="text-3xl font-serif">{t.secure_payment_title}</h2>
          <div className="p-6 bg-gray-50 rounded-2xl flex justify-between items-center text-left">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{getPackName()}</p>
              <p className="text-lg font-bold text-gray-800">{formData.songTitle || '...'}</p>
            </div>
            <p className="text-3xl font-bold text-violet-600">{selectedPack === 'basico' ? '29' : selectedPack === 'emocion' ? '39' : '49'}€</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="border-2 border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 hover:border-violet-300 cursor-pointer transition-colors">
                <span className="text-2xl">💳</span>
             </div>
             <div className="border-2 border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 hover:border-blue-400 cursor-pointer transition-colors">
                <span className="text-2xl">🅿️</span>
             </div>
          </div>

          <button 
            onClick={handleFinalPayment}
            disabled={isSubmitting}
            className="w-full multi-glow text-white py-5 rounded-full font-bold text-xl shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {isSubmitting ? '...' : `${t.pay_and_send} (${selectedPack === 'basico' ? '29' : selectedPack === 'emocion' ? '39' : '49'}€)`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-transparent fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-violet-100 relative overflow-hidden">
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-serif text-gray-900">{t.form_title}</h2>
            <p className="text-violet-500 font-medium italic">{getPackName()}</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.song_title_label}</label>
                <input 
                  type="text" name="songTitle" required value={formData.songTitle} onChange={handleInputChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.sender_label}</label>
                  <input type="text" name="sender" required value={formData.sender} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.recipient_label}</label>
                  <input type="text" name="recipient" required value={formData.recipient} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.memories_label}</label>
                <textarea 
                  name="memories" required value={formData.memories} onChange={handleInputChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 min-h-[150px] outline-none"
                  placeholder={t.memories_placeholder}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.occasion_label}</label>
                <select 
                  name="occasion" value={formData.occasion} onChange={handleInputChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none"
                >
                  {occasions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {(selectedPack === 'emocion' || selectedPack === 'artistico') && (
              <div className="space-y-8 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.upload_photos_label}</label>
                  <label className="cursor-pointer bg-violet-600 text-white px-6 py-2 rounded-full font-bold text-xs">
                    +
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                {photos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {photos.map((photo, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-4">
                        <img src={photo.preview} className="w-full h-32 object-contain" alt="Preview" />
                        {selectedPack === 'artistico' && (
                          <select 
                            value={photo.style} 
                            onChange={(e) => updatePhotoStyle(i, e.target.value)}
                            className="w-full bg-white p-2 text-xs font-bold outline-none"
                          >
                            {artisticStyles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6 pt-8 border-t border-gray-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.voice_label}</label>
                  <select name="voice" value={formData.voice} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 outline-none">
                    {voices.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.email_label}</label>
                  <input type="email" name="deliveryEmail" required value={formData.deliveryEmail} onChange={handleInputChange} className="w-full bg-white border border-gray-100 rounded-xl p-3 outline-none" />
                </div>
              </div>
            </div>

            <button className="w-full multi-glow text-white py-6 rounded-full font-bold text-xl transition-transform shadow-2xl" type="submit">
              {t.proceed_to_payment}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreationForm;
