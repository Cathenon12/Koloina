import React from 'react';
import { Heart, Sparkles, Flower2, ArrowRight, BookOpen, Volume2, Shield, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';
import romanticBg from '../assets/images/romantic_night_bg_1786824515087.jpg';
import bouquetImg from '../assets/images/bouquet_koloina_1786824504934.jpg';

interface WelcomePageProps {
  onEnterApp: () => void;
  onOpenBouquet: () => void;
  onOpenLetter: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onEnterApp,
  onOpenBouquet,
  onOpenLetter,
}) => {
  const handleStartExperience = async (e: React.MouseEvent) => {
    // Calculate origin coordinates safely before any async operations
    let x = 0.5;
    let y = 0.6;
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

    // Soft celebration confetti
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x, y },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ffffff', '#fbbf24'],
      scalar: 1.2,
      ticks: 200,
    });

    // Start sweet romantic piano background music
    try {
      await audioEngine.startMusic();
      audioEngine.playHeartSound();
    } catch {
      // Ignore audio start errors if blocked
    }

    onEnterApp();
  };

  return (
    <div
      id="welcome-page-container"
      className="relative min-h-[86vh] w-full flex flex-col items-center justify-center text-center px-4 py-8 overflow-hidden rounded-3xl"
    >
      {/* Realistic Cinematic Scenery Background with Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <img
          src={romanticBg}
          alt="Nuit étoilée romantique pour Koloina"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
        />
        {/* Deep romantic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-[#0b0f19]/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-[#0b0f19]" />
      </div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative max-w-3xl w-full p-8 md:p-12 rounded-3xl bg-slate-950/60 backdrop-blur-xl border border-rose-500/30 rose-card-glow shadow-2xl flex flex-col items-center"
      >
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs md:text-sm font-sans-clean tracking-wider uppercase mb-6 shadow-md shadow-rose-950/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>Une Déclaration d'Amour Éternelle</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
        </div>

        {/* Realistic Romantic Bouquet Thumbnail with Glowing Ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-rose-500/30 blur-xl rounded-full animate-pulse" />
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 shadow-xl overflow-hidden animate-float-gentle">
            <img
              src={bouquetImg}
              alt="Roses pour Koloina"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-rose-600 border border-rose-300 text-white shadow-lg">
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Primary Requested Greeting Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-romantic font-semibold text-rose-50 leading-tight md:leading-snug tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] max-w-2xl">
          Pour toi, Koloina, mon amour aujourd’hui, demain et pour toujours. ❤️
        </h1>

        {/* Subtitle & Emotional quote */}
        <p className="font-cormorant text-xl md:text-2xl text-rose-200/90 italic mt-5 mb-8 max-w-xl leading-relaxed">
          « Tu es cette douceur qui apaise mes tempêtes, cette lumière qui éclaire mes nuits,
          ce sourire qui rend mes journées plus belles. »
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-8 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-rose-500/20 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-200">Toujours là</p>
              <p className="text-[11px] text-slate-400">Dans le calme & la tempête</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-rose-500/20 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
              <Flower2 className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-200">Jardin Éternel</p>
              <p className="text-[11px] text-slate-400">Roses et vœux d'amour</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-rose-500/20 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-200">Mon Cœur</p>
              <p className="text-[11px] text-slate-400">Celui qui reste à tes côtés</p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button
            id="btn-start-romantic-journey"
            onClick={handleStartExperience}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-semibold text-sm md:text-base tracking-wide shadow-xl shadow-rose-600/40 hover:shadow-rose-600/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
            <span>Découvrir notre poème d'amour</span>
            <ArrowRight className="w-5 h-5 text-rose-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="btn-welcome-bouquet"
            onClick={onOpenBouquet}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-rose-200 font-medium text-sm border border-rose-500/30 hover:border-rose-500/50 shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flower2 className="w-4 h-4 text-rose-400" />
            <span>Voir le Bouquet de Roses</span>
          </button>
        </div>

        {/* Note on romantic background music: Amir - Rétine */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-rose-300/80 font-sans-clean">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-rose-500/20">
            <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Fond sonore : <strong>Amir - Rétine</strong> ❤️</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
