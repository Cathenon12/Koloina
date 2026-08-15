/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingParticlesCanvas } from './components/FloatingParticlesCanvas';
import { WelcomePage } from './components/WelcomePage';
import { PoemCarousel } from './components/PoemCarousel';
import { BouquetDisplay } from './components/BouquetDisplay';
import { FullLetterModal } from './components/FullLetterModal';
import { AudioControlsHeader } from './components/AudioControlsHeader';
import { Heart, Flower2, BookOpen, Sparkles, Home } from 'lucide-react';

export default function App() {
  const [loveCount, setLoveCount] = useState(() => {
    const saved = localStorage.getItem('koloina_love_count');
    return saved ? parseInt(saved, 10) : 108;
  });
  const [activeTab, setActiveTab] = useState<'welcome' | 'carousel' | 'bouquet'>('welcome');
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('koloina_love_count', loveCount.toString());
  }, [loveCount]);

  const handleIncrementLove = () => {
    setLoveCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex flex-col items-center relative selection:bg-rose-500/30 selection:text-rose-200 overflow-x-hidden">
      {/* Dynamic Floating Particles (Hearts, Flower Petals, Bouquets, Stars) */}
      <FloatingParticlesCanvas />

      {/* Ambient background glow orbs */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation & Audio Controls Header Bar */}
      <header className="relative z-30 w-full max-w-5xl px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/10 bg-[#0b0f19]/70 backdrop-blur-md sticky top-0">
        {/* Brand / Logo */}
        <button
          id="btn-nav-home"
          onClick={() => setActiveTab('welcome')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500/30 transition-all duration-300">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 group-hover:text-rose-300 group-hover:fill-rose-300" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="font-serif-romantic text-sm font-semibold tracking-wide text-rose-100 block leading-tight">
              Pour Koloina
            </span>
            <span className="text-[10px] text-rose-300/70 uppercase tracking-widest font-sans-clean">
              Mon Amour Éternel
            </span>
          </div>
        </button>

        {/* View Mode Tabs */}
        <nav
          id="main-nav-tabs"
          className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-lg"
          aria-label="Navigation principale"
        >
          <button
            id="tab-btn-welcome"
            onClick={() => setActiveTab('welcome')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans-clean flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
              activeTab === 'welcome'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Accueil</span>
          </button>

          <button
            id="tab-btn-carousel"
            onClick={() => setActiveTab('carousel')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans-clean flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
              activeTab === 'carousel'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Poème</span>
          </button>

          <button
            id="tab-btn-bouquet"
            onClick={() => setActiveTab('bouquet')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans-clean flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
              activeTab === 'bouquet'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>Bouquet</span>
          </button>
        </nav>

        {/* Right Section: Audio Controls & Full Letter Button */}
        <div className="flex items-center gap-2">
          {/* Enhanced Background Music & Volume Controller */}
          <AudioControlsHeader />

          {/* Full Letter Modal Opener */}
          <button
            id="btn-open-full-letter"
            onClick={() => setIsLetterModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-rose-500/20 text-xs text-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lire la lettre complète"
            aria-label="Lire la lettre complète"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Lettre</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-5xl px-4 py-4 sm:py-6 flex-1 flex flex-col justify-center items-center">
        {activeTab === 'welcome' && (
          <WelcomePage
            onEnterApp={() => setActiveTab('carousel')}
            onOpenBouquet={() => setActiveTab('bouquet')}
            onOpenLetter={() => setIsLetterModalOpen(true)}
          />
        )}

        {activeTab === 'carousel' && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <PoemCarousel onHeartSent={handleIncrementLove} loveCount={loveCount} />
            {/* Quick Link to Bouquet under the carousel */}
            <div className="w-full max-w-2xl text-center -mt-4 mb-8">
              <button
                id="btn-switch-to-bouquet"
                onClick={() => setActiveTab('bouquet')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-sans-clean transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
              >
                <Flower2 className="w-4 h-4 text-rose-400" />
                <span>Voir le Bouquet de Roses pour Koloina 💐</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bouquet' && (
          <div className="w-full max-w-2xl animate-fade-in py-2">
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-4xl font-serif-romantic font-semibold text-slate-100">
                Le Bouquet Éternel
              </h2>
              <p className="text-xs uppercase tracking-widest text-rose-300 font-sans-clean mt-1">
                Une rose pour chaque baiser, une fleur pour chaque souvenir
              </p>
            </div>

            <BouquetDisplay onHeartSent={handleIncrementLove} loveCount={loveCount} />

            <div className="text-center mt-6 mb-8">
              <button
                id="btn-return-to-carousel"
                onClick={() => setActiveTab('carousel')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-sans-clean transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Retourner au Poème d'Amour</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Full Letter Modal */}
      <FullLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
      />
    </div>
  );
}

