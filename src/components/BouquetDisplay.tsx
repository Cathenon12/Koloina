import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Flower2, Send, MessageSquareHeart, Check, Edit3, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioSynth';
import { LOVE_AFFIRMATIONS } from '../data/poemData';
import bouquetImg from '../assets/images/bouquet_koloina_1786824504934.jpg';

interface BouquetDisplayProps {
  onHeartSent: () => void;
  loveCount: number;
}

export const BouquetDisplay: React.FC<BouquetDisplayProps> = ({ onHeartSent, loveCount }) => {
  const [currentAffirmation, setCurrentAffirmation] = useState<string>(
    "Pour toi Koloina, mon amour, ma fleur éternelle... 🌹"
  );
  const [isBlooming, setIsBlooming] = useState(false);

  // Custom personalized message state with localStorage persistence
  const [customMessageInput, setCustomMessageInput] = useState('');
  const [savedCustomMessage, setSavedCustomMessage] = useState<string>(() => {
    return localStorage.getItem('koloina_custom_message') || '';
  });
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  useEffect(() => {
    if (savedCustomMessage) {
      localStorage.setItem('koloina_custom_message', savedCustomMessage);
    } else {
      localStorage.removeItem('koloina_custom_message');
    }
  }, [savedCustomMessage]);

  const triggerFlowerShower = (e?: React.MouseEvent) => {
    onHeartSent();
    audioEngine.playBouquetSound();
    setIsBlooming(true);
    setTimeout(() => setIsBlooming(false), 1200);

    // Pick random sweet affirmation
    const nextMsg = LOVE_AFFIRMATIONS[Math.floor(Math.random() * LOVE_AFFIRMATIONS.length)];
    setCurrentAffirmation(nextMsg);

    // Launch rose petals and heart confetti
    const x = e ? e.clientX / window.innerWidth : 0.5;
    const y = e ? e.clientY / window.innerHeight : 0.5;

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { x, y },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#fbbf24', '#ffffff', '#e11d48'],
      shapes: ['circle', 'square'],
      ticks: 240,
      gravity: 0.7,
      scalar: 1.3,
      drift: 0.05
    });

    confetti({
      particleCount: 30,
      spread: 110,
      origin: { x, y: y - 0.08 },
      colors: ['#e11d48', '#be123c', '#ff2d55', '#ffe4e6'],
      ticks: 260,
      scalar: 1.6
    });
  };

  const handleSaveCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessageInput.trim()) return;

    const trimmed = customMessageInput.trim();
    setSavedCustomMessage(trimmed);
    setIsEditingMessage(false);
    setMessageSentSuccess(true);
    setTimeout(() => setMessageSentSuccess(false), 3000);

    onHeartSent();
    audioEngine.playHeartSound();

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x: 0.5, y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff', '#fbbf24'],
      scalar: 1.2,
      ticks: 200
    });
  };

  const handleStartEdit = () => {
    setCustomMessageInput(savedCustomMessage);
    setIsEditingMessage(true);
  };

  const handleDeleteCustomMessage = () => {
    setSavedCustomMessage('');
    setCustomMessageInput('');
    setIsEditingMessage(false);
  };

  return (
    <div
      id="koloina-bouquet-showcase"
      className="relative w-full max-w-xl mx-auto my-6 p-6 md:p-8 rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-rose-500/30 rose-card-glow text-center overflow-hidden transition-all duration-500"
    >
      {/* Background radial soft aura */}
      <div className="absolute inset-0 bg-radial from-rose-500/15 via-pink-500/5 to-transparent pointer-events-none" />

      {/* Header Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs tracking-wider uppercase mb-4 font-sans-clean">
        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
        <span>Bouquet Éternel Dédié à Koloina</span>
        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
      </div>

      {/* Realistic Bouquet Image Showcase */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        {/* Soft pulsing aura behind bouquet */}
        <div className={`absolute w-64 h-64 rounded-full bg-rose-500/25 blur-3xl transition-all duration-700 pointer-events-none ${isBlooming ? 'scale-140 bg-rose-500/50' : 'scale-100'}`} />

        {/* Image Container with floating animation and glass frame */}
        <div
          onClick={triggerFlowerShower}
          className={`relative group cursor-pointer p-3 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-md transition-all duration-500 ${
            isBlooming ? 'scale-105 rotate-1' : 'scale-100 animate-float-gentle'
          }`}
          title="Clique sur le bouquet pour faire pleuvoir des pétales d'amour !"
        >
          <img
            src={bouquetImg}
            alt="Bouquet de roses roses et rouges pour Koloina"
            referrerPolicy="no-referrer"
            className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl drop-shadow-[0_15px_30px_rgba(244,63,94,0.4)] group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-rose-200 font-sans-clean flex items-center gap-1.5 border border-rose-500/30">
              <Sparkles className="w-3 h-3 text-rose-300" />
              Toucher pour fleurir
            </span>
          </div>
        </div>
      </div>

      {/* Display Custom Message if validated and not editing */}
      {savedCustomMessage && !isEditingMessage ? (
        <div
          id="custom-validated-message-card"
          className="relative px-5 py-4 my-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900/80 to-rose-950/70 border border-rose-500/40 shadow-xl text-left animate-fade-in group"
        >
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-rose-500/20">
            <div className="flex items-center gap-2 text-xs font-sans-clean text-rose-300 font-medium">
              <MessageSquareHeart className="w-4 h-4 text-rose-400" />
              <span>Ton mot doux pour Koloina</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-edit-custom-message"
                onClick={handleStartEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Modifier mon message"
                aria-label="Modifier mon message"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-delete-custom-message"
                onClick={handleDeleteCustomMessage}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                title="Supprimer mon message"
                aria-label="Supprimer mon message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="font-cormorant text-xl md:text-2xl text-rose-100 italic leading-relaxed text-center py-1">
            « {savedCustomMessage} »
          </p>

          <div className="flex items-center justify-center gap-1 text-[11px] text-rose-400/80 font-sans-clean mt-2">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>Gravé sous les roses pour toujours</span>
          </div>
        </div>
      ) : (
        /* Affirmation Text Banner */
        <div className="min-h-[56px] flex items-center justify-center px-4 py-3 my-4 rounded-2xl bg-rose-950/50 border border-rose-500/25">
          <p className="font-cormorant text-lg md:text-2xl text-rose-100 italic font-medium tracking-wide">
            « {currentAffirmation} »
          </p>
        </div>
      )}

      {/* Personalized Message Input Form */}
      {(!savedCustomMessage || isEditingMessage) && (
        <form
          id="form-custom-love-message"
          onSubmit={handleSaveCustomMessage}
          className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-rose-500/25 backdrop-blur-md text-left transition-all duration-300"
        >
          <label
            htmlFor="input-koloina-message"
            className="block text-xs font-medium text-rose-200 mb-2 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <MessageSquareHeart className="w-3.5 h-3.5 text-rose-400" />
              {isEditingMessage ? 'Modifier ton message pour Koloina :' : 'Laisser un message personnalisé sous le bouquet :'}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              {customMessageInput.length}/160
            </span>
          </label>

          <div className="relative flex flex-col sm:flex-row items-center gap-2">
            <input
              id="input-koloina-message"
              type="text"
              maxLength={160}
              value={customMessageInput}
              onChange={(e) => setCustomMessageInput(e.target.value)}
              placeholder="Ex: Mon trésor Koloina, je t'aime plus que tout au monde..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-rose-100 placeholder-slate-500 text-sm font-sans-clean focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-all"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="btn-submit-custom-message"
                type="submit"
                disabled={!customMessageInput.trim()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs font-sans-clean flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-600/30 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEditingMessage ? 'Enregistrer' : 'Déposer'}</span>
              </button>

              {isEditingMessage && (
                <button
                  type="button"
                  onClick={() => setIsEditingMessage(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans-clean cursor-pointer transition-colors"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Feedback Toast upon adding message */}
      {messageSentSuccess && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 mb-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-sans-clean animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Ton message personnalisé est désormais affiché sous le bouquet !</span>
        </div>
      )}

      {/* Actions and Love Proof counter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-5">
        <button
          id="btn-offrir-fleur"
          onClick={triggerFlowerShower}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-medium text-sm tracking-wide shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Flower2 className="w-5 h-5 text-rose-200 group-hover:rotate-45 transition-transform duration-300" />
          <span>Offrir une fleur à Koloina</span>
          <Heart className="w-4 h-4 text-white fill-white group-hover:scale-125 transition-transform duration-300" />
        </button>

        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-sans-clean shadow-inner">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>
            <strong className="text-rose-300 font-semibold">{loveCount}</strong> roses d'amour offertes
          </span>
        </div>
      </div>
    </div>
  );
};
