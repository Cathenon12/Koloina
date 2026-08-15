import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Sun,
  Shield,
  HeartHandshake,
  Flower2,
  Flame,
  Volume2,
  VolumeX,
  BookOpen,
  Layers,
  Pause,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { POEM_STANZAS } from '../data/poemData';
import { audioEngine } from '../utils/audioSynth';
import { ReasonsCardSlider } from './ReasonsCardSlider';

interface PoemCarouselProps {
  onHeartSent: () => void;
  loveCount: number;
}

export const PoemCarousel: React.FC<PoemCarouselProps> = ({ onHeartSent, loveCount }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);
  const [heartClicked, setHeartClicked] = useState(false);

  const currentStanza = POEM_STANZAS[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % POEM_STANZAS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + POEM_STANZAS.length) % POEM_STANZAS.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, currentIndex]);

  const toggleMusic = async () => {
    const playing = await audioEngine.togglePlay();
    setIsAudioPlaying(playing);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    setHeartClicked(true);
    setTimeout(() => setHeartClicked(false), 800);
    audioEngine.playHeartSound();
    onHeartSent();

    let x = 0.5;
    let y = 0.5;
    try {
      const target = e.currentTarget as HTMLElement | null;
      if (target && typeof target.getBoundingClientRect === 'function') {
        const rect = target.getBoundingClientRect();
        x = (rect.left + rect.width / 2) / (window.innerWidth || 1);
        y = (rect.top + rect.height / 2) / (window.innerHeight || 1);
      } else if (e.clientX && e.clientY) {
        x = e.clientX / (window.innerWidth || 1);
        y = e.clientY / (window.innerHeight || 1);
      }
    } catch {
      // Fallback to center
    }

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#ffffff'],
      ticks: 160,
      scalar: 1.1
    });
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-rose-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-pink-400" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      default:
        return <Heart className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center z-10 px-4">
      {/* Audio & Autoplay Control Header bar */}
      <div className="w-full flex items-center justify-between py-2 mb-4 px-2">
        <button
          id="btn-toggle-music"
          onClick={toggleMusic}
          className={`px-3.5 py-1.5 rounded-full text-xs font-sans-clean flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
            isAudioPlaying
              ? 'bg-rose-500/20 border-rose-400/50 text-rose-200 shadow-md shadow-rose-500/20'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
          title={isAudioPlaying ? "Couper la musique" : "Jouer la mélodie romantique"}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Mélodie Romantique Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Activer la Musique Douce</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-autoplay"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${
              isAutoPlay
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={isAutoPlay ? "Pause défilement automatique" : "Lecture automatique"}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="text-xs text-slate-400 font-sans-clean px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50">
            {currentIndex + 1} / {POEM_STANZAS.length}
          </span>
        </div>
      </div>

      {/* Main Header with Pulsing Heart */}
      <div className="flex flex-col items-center text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-3 cursor-pointer group"
          onClick={handleHeartClick}
        >
          <div className="absolute inset-0 bg-rose-500/40 blur-xl rounded-full" />
          <Heart className="w-10 h-10 md:w-12 md:h-12 text-rose-500 fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)] relative z-10 group-hover:scale-110 transition-transform" />
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-serif-romantic font-semibold tracking-tight text-slate-100 drop-shadow-md">
          Pour Koloina
        </h1>
        <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-rose-300/80 font-sans-clean mt-2 font-medium">
          Mon Amour, Mon Horizon
        </p>
      </div>

      {/* Main Poem Carousel Card */}
      <div className="w-full relative min-h-[380px] md:min-h-[420px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStanza.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            id={`poem-card-${currentStanza.id}`}
            className="w-full rounded-3xl bg-[#111827]/85 backdrop-blur-xl border border-rose-500/20 p-6 md:p-10 rose-card-glow text-center relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top decorative element */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs md:text-sm font-serif-romantic">
                {renderIcon(currentStanza.iconName)}
                <span className="font-semibold text-rose-200">{currentStanza.tag}</span>
              </div>
              <Sparkles className="w-4 h-4 text-slate-500/50" />
            </div>

            {/* Poem Lines */}
            <div className="my-auto py-2">
              <div className="space-y-2.5 md:space-y-3 font-cormorant text-lg md:text-2xl text-slate-200 leading-relaxed font-normal">
                {currentStanza.lines.map((line, idx) =>
                  line === '' ? (
                    <div key={idx} className="h-2" />
                  ) : (
                    <p
                      key={idx}
                      className={
                        line.startsWith('Koloina') || line.includes('Toujours') || line.includes('❤️')
                          ? 'font-semibold text-rose-300'
                          : ''
                      }
                    >
                      {line}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Bottom Subtle Note in Card */}
            {currentStanza.footerNote && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-sans-clean italic flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>{currentStanza.footerNote}</span>
                <Sparkles className="w-3 h-3 text-rose-400" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between w-full max-w-sm my-6 px-4">
        <button
          id="btn-prev-stanza"
          onClick={handlePrev}
          aria-label="Strophe précédente"
          className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-rose-950/60 border border-rose-500/20 hover:border-rose-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-black/40 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {POEM_STANZAS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-rose-500 shadow-sm shadow-rose-500'
                  : 'w-2.5 bg-slate-700/80 hover:bg-slate-600'
              }`}
              aria-label={`Aller à la strophe ${idx + 1}`}
            />
          ))}
        </div>

        <button
          id="btn-next-stanza"
          onClick={handleNext}
          aria-label="Strophe suivante"
          className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-rose-950/60 border border-rose-500/20 hover:border-rose-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-black/40 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Grand Finale Reveal: 4 Photos & 4 Reasons Card Slider on the Last Page of the Poem */}
      {currentIndex === POEM_STANZAS.length - 1 && (
        <div className="w-full animate-fade-in">
          <ReasonsCardSlider />
        </div>
      )}

      {/* Bottom Highlight Card (Je t'aime, Koloina) as seen in video */}
      <div
        id="card-love-declaration"
        className="w-full rounded-3xl bg-[#111827]/90 backdrop-blur-xl border border-rose-500/30 p-6 md:p-8 rose-card-glow text-center mt-2 mb-8 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <h3 className="font-script text-3xl md:text-4xl text-rose-400 mb-3 drop-shadow-sm font-normal">
          Je t'aime, Koloina
        </h3>

        <p className="font-sans-clean text-slate-300 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-normal">
          Je suis là pour toujours, pour te supporter quel que soit la tempête.
          <br />
          Même quand le ciel gronde, ma main ne lâchera jamais la tienne.
        </p>

        {/* Beating Heart Interactive Button */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <button
            id="btn-send-heart-bottom"
            onClick={handleHeartClick}
            className={`w-14 h-14 rounded-full bg-rose-600/20 border border-rose-500/40 hover:bg-rose-500/30 flex items-center justify-center group cursor-pointer transition-all duration-300 shadow-lg shadow-rose-950/50 ${
              heartClicked ? 'scale-125 bg-rose-500/40' : 'hover:scale-110'
            }`}
            title="Cliquer pour envoyer tout mon amour à Koloina"
          >
            <Heart
              className={`w-7 h-7 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform duration-300 ${
                heartClicked ? 'scale-125 text-rose-400' : 'animate-pulse'
              }`}
            />
          </button>
          <span className="text-xs text-rose-300/80 font-sans-clean mt-2">
            Clique pour faire battre mon cœur
          </span>
        </div>
      </div>

      {/* Footer Text */}
      <footer className="text-center text-xs text-slate-400 font-sans-clean space-y-2 mb-12">
        <p className="tracking-wide">
          Toujours là pour toi. Toujours prêt à avancer avec toi.
        </p>
        <p className="tracking-widest uppercase text-[10px] text-rose-400/80 font-medium">
          ÉTERNELLEMENT · KOLOINA
        </p>
      </footer>
    </div>
  );
};
