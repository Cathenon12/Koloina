import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Maximize2,
  X,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOVE_REASONS } from '../data/poemData';
import { audioEngine } from '../utils/audioSynth';

export const ReasonsCardSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [likedCardIds, setLikedCardIds] = useState<number[]>([]);

  const currentReason = LOVE_REASONS[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % LOVE_REASONS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + LOVE_REASONS.length) % LOVE_REASONS.length);
  };

  const handleHeartCard = (id: number, e: React.MouseEvent) => {
    audioEngine.playHeartSound();
    if (!likedCardIds.includes(id)) {
      setLikedCardIds((prev) => [...prev, id]);
    }

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
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185', '#ffffff'],
      ticks: 140,
      scalar: 1.05
    });
  };

  return (
    <div
      id="reasons-for-koloina-section"
      className="w-full mt-8 pt-8 border-t border-rose-500/25 flex flex-col items-center"
    >
      {/* Main Title as requested by the user */}
      <div className="text-center mb-6 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-sans-clean mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Une Déclaration Spéciale</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <h3 className="text-2xl md:text-3xl font-serif-romantic font-semibold text-rose-100 drop-shadow-md">
          Koloina, voici pourquoi je suis tellement attaché à toi :
        </h3>
        <p className="text-xs md:text-sm text-rose-300/80 font-sans-clean mt-1">
          Fais glisser les cartes pour découvrir mes sentiments
        </p>
      </div>

      {/* Swipeable Slide Card Container */}
      <div className="w-full max-w-xl relative min-h-[460px] sm:min-h-[420px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentReason.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 80, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) handleNext();
              else if (info.offset.x > 40) handlePrev();
            }}
            id={`reason-card-${currentReason.id}`}
            className="w-full rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 p-5 sm:p-6 rose-card-glow text-left shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center cursor-grab active:cursor-grabbing"
          >
            {/* Ambient Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentReason.accentColor || 'from-rose-500/20 to-pink-500/10'} pointer-events-none`}
            />

            {/* Photo Thumbnail with Zoom & Heart Button */}
            <div className="relative w-44 sm:w-48 h-56 sm:h-64 shrink-0 rounded-2xl overflow-hidden border-2 border-rose-500/40 shadow-xl group">
              <img
                src={currentReason.image}
                alt={`Photo de Koloina ${currentReason.number}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Number Badge */}
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1">
                <span>{currentReason.emoji}</span>
                <span>#{currentReason.number}</span>
              </div>

              {/* View full size photo button */}
              <button
                id={`btn-zoom-photo-${currentReason.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(currentReason.image);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Agrandir la photo"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Heart floating on photo */}
              <button
                id={`btn-heart-photo-${currentReason.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHeartCard(currentReason.id, e);
                }}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/40 text-rose-400 hover:text-rose-300 hover:scale-110 transition-all cursor-pointer"
                title="J'aime cette photo"
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedCardIds.includes(currentReason.id) ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>

            {/* Reason Text Details */}
            <div className="flex-1 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{currentReason.emoji}</span>
                  <span className="text-xs uppercase tracking-widest font-sans-clean text-rose-300 font-semibold">
                    Raison #{currentReason.number}
                  </span>
                </div>

                <h4 className="font-serif-romantic text-lg sm:text-xl font-bold text-rose-100 leading-snug mb-3">
                  {currentReason.title}
                </h4>

                <p className="font-cormorant text-base sm:text-lg text-slate-200 leading-relaxed italic">
                  "{currentReason.description}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between text-xs text-rose-300/80 font-sans-clean">
                <span>Pour toujours dans mon cœur</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {currentReason.number} / {LOVE_REASONS.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Controls & Indicators */}
      <div className="flex items-center justify-between w-full max-w-sm mt-5 mb-2 px-4">
        <button
          id="btn-prev-reason"
          onClick={handlePrev}
          aria-label="Photo précédente"
          className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-rose-950/80 border border-rose-500/30 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-black/40 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress Card Dots with Numbers */}
        <div className="flex items-center gap-2">
          {LOVE_REASONS.map((reason, idx) => (
            <button
              key={reason.id}
              id={`btn-dot-reason-${reason.id}`}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer text-[10px] font-bold ${
                idx === currentIndex
                  ? 'w-8 h-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/40'
                  : 'w-6 h-6 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
              }`}
              aria-label={`Aller à la raison ${reason.number}`}
            >
              {reason.number}
            </button>
          ))}
        </div>

        <button
          id="btn-next-reason"
          onClick={handleNext}
          aria-label="Photo suivante"
          className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-rose-950/80 border border-rose-500/30 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-black/40 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Lightbox / Fullscreen Image View Modal */}
      {selectedPhoto && (
        <div
          id="photo-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-lg w-full max-h-[85vh] flex flex-col items-center">
            <button
              id="btn-close-lightbox"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto}
              alt="Photo agrandie de Koloina"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl border-2 border-rose-500/50 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs text-rose-200 font-sans-clean mt-3">
              Koloina · Pour l'éternité ❤️
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
