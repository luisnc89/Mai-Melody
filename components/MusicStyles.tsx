import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { ROUTE_SLUGS, PACK_SLUGS } from '../routes/slugs';
import { translations } from '../translations';

/* =========================
   🌍 Idiomas
========================= */
const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'fr', 'it', 'ca'];

const LANGUAGE_FILE: Record<Language, string> = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  it: 'it',
  ca: 'ca',
};

/* =========================
   🎵 Estilos musicales
========================= */
const MUSIC_STYLES = [
  { id: 'pop', image: 'Pop.png', color: '#ec4899', key: 'form_music_pop' },
  { id: 'rock', image: 'Rock.png', color: '#f97316', key: 'form_music_rock' },
  { id: 'acustico', image: 'Acústico.png', color: '#a78bfa', key: 'form_music_acoustic' },
  { id: 'epico', image: 'Épico.png', color: '#f59e0b', key: 'form_music_epic' },
  { id: 'reggaeton', image: 'Reggaeton.png', color: '#ef4444', key: 'form_music_reggaeton' },
  { id: 'rap', image: 'Rap.png', color: '#22c55e', key: 'form_music_rap' },
  { id: 'electronica', image: 'Electrónica.png', color: '#38bdf8', key: 'form_music_electronic' },
  { id: 'infantil', image: 'Infantil.png', color: '#facc15', key: 'form_music_kids' },
];

/* =========================
   🧩 Utils
========================= */
const formatTime = (t: number) => {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

/* =========================
   🎧 Player (FIXED)
========================= */
const CardPlayer = ({
  audio,
  isActive,
  onToggle,
  color,
}: {
  audio: HTMLAudioElement | null;
  isActive: boolean;
  onToggle: () => void;
  color: string;
}) => {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audio) return;

    const onTime = () => setCurrent(audio.currentTime);

    const onDuration = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('play', onDuration);

    // Fallback inmediato
    if (audio.readyState >= 1 && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('play', onDuration);
    };
  }, [audio]);

  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/70 backdrop-blur-md rounded-full px-3 py-2 flex items-center gap-2">
        <button
          onClick={onToggle}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all"
          style={{ boxShadow: isActive ? `0 0 16px ${color}` : undefined }}
        >
          {isActive ? '❚❚' : '▶'}
        </button>

        <span className="text-[11px] text-white/80 w-9 text-right font-mono">
          {formatTime(current)}
        </span>

        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 1}
          step="0.01"
          value={current}
          onChange={e => {
            if (!audio) return;
            const v = Number(e.target.value);
            audio.currentTime = v;
            setCurrent(v);
          }}
          className="h-1 rounded-full cursor-pointer"
          style={{ width: '90px', accentColor: color }}
        />

        <span className="text-[11px] text-white/80 w-9 text-left font-mono">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

/* =========================
   🎼 MusicStyles
========================= */
const MusicStyles: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const navigate = useNavigate();

  const language: Language = SUPPORTED_LANGUAGES.includes(lang as Language)
    ? (lang as Language)
    : 'es';

  const t = translations[language];

  const [active, setActive] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const toggle = async (id: string) => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio instanceof HTMLAudioElement) {
        audio.pause();
      }
    });

    const current = audioRefs.current[id];
    if (!current) return;

    if (active === id) {
      current.pause();
      setActive(null);
    } else {
      await current.play();
      setActive(id);
    }
  };

  const goToBasicPack = () => {
    navigate(
      `/${language}/${ROUTE_SLUGS.create[language]}/${PACK_SLUGS.basico[language]}`
    );
  };

  return (
    <section className="relative py-24 px-4 bg-[#0B0E17]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {MUSIC_STYLES.map(style => {
          const src = `/assets/audio/${style.id}-${LANGUAGE_FILE[language]}.mp3`;

          return (
            <div key={style.id} className="relative rounded-[36px] overflow-hidden">
              <img
                src={`/assets/styles/${style.image}`}
                alt={t[style.key as keyof typeof t]}
                className="w-full h-[360px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute top-4 left-4 bg-black/60 px-4 py-1 rounded-full text-xs text-white">
                {t[style.key as keyof typeof t]}
              </div>

              <CardPlayer
                audio={audioRefs.current[style.id]}
                isActive={active === style.id}
                onToggle={() => toggle(style.id)}
                color={style.color}
              />

              <audio
                ref={el => (audioRefs.current[style.id] = el)}
                src={src}
                preload="metadata"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-20 text-center">
        <button
          onClick={goToBasicPack}
          className="bg-pink-600 text-white px-10 py-5 rounded-full text-lg font-semibold hover:scale-105 transition"
        >
          {t.hero_cta}
        </button>
      </div>
    </section>
  );
};

export default MusicStyles;
