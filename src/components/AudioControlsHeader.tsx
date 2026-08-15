import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Volume1, Play, Pause, Music, Upload, RotateCcw } from 'lucide-react';
import { audioEngine, AudioState } from '../utils/audioSynth';

export const AudioControlsHeader: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>(audioEngine.getState());
  const [showSlider, setShowSlider] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState({ ...state });
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = async () => {
    await audioEngine.togglePlay();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioEngine.setVolume(val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await audioEngine.loadCustomAudioFile(file);
      setShowAudioMenu(false);
    }
  };

  const handleResetTrack = async () => {
    await audioEngine.resetToAmirRetine();
    setShowAudioMenu(false);
  };

  const getVolumeIcon = () => {
    if (audioState.isMuted || audioState.volume === 0) {
      return <VolumeX className="w-4 h-4 text-rose-400" />;
    }
    if (audioState.volume < 0.4) {
      return <Volume1 className="w-4 h-4 text-rose-300" />;
    }
    return <Volume2 className="w-4 h-4 text-rose-300" />;
  };

  return (
    <div className="relative">
      <div
        id="audio-controls-header"
        className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-rose-500/25 shadow-lg shadow-black/30 font-sans-clean transition-all duration-300"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {/* Play / Pause Toggle Button */}
        <button
          id="btn-play-pause-music"
          onClick={handleTogglePlay}
          className={`p-2 rounded-xl border transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
            audioState.isPlaying
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 shadow-sm shadow-rose-500/30'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
          }`}
          title={audioState.isPlaying ? "Mettre la musique en pause" : "Écouter Amir - Rétine"}
          aria-label="Contrôle musique Amir - Rétine"
        >
          {audioState.isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Play className="w-3.5 h-3.5 text-rose-300 fill-rose-300/40" />
          )}

          <div className="flex items-center gap-1.5 text-left">
            <Music className="w-3 h-3 text-rose-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-rose-200 tracking-wide max-w-[130px] sm:max-w-[170px] truncate leading-tight">
                {audioState.trackName || 'Amir - Rétine'}
              </span>
              <span className="text-[9px] text-rose-400/80 hidden sm:inline leading-none">
                Chanson pour Koloina
              </span>
            </div>
          </div>
        </button>

        {/* Mini Visualizer / Equalizer when playing */}
        {audioState.isPlaying && !audioState.isMuted && (
          <div className="hidden sm:flex items-end gap-0.5 h-3.5 px-0.5">
            <span className="w-0.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
            <span className="w-0.5 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
            <span className="w-0.5 bg-rose-300 rounded-full animate-bounce [animation-delay:-0.45s] h-3.5" />
            <span className="w-0.5 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.2s] h-2.5" />
          </div>
        )}

        {/* Music Options / Upload Trigger */}
        <button
          id="btn-music-options"
          onClick={() => setShowAudioMenu(!showAudioMenu)}
          className="p-1.5 rounded-lg border border-transparent hover:border-rose-500/30 text-rose-300 hover:text-white transition-colors cursor-pointer"
          title="Options de musique (Importer MP3 ou réinitialiser)"
          aria-label="Options de musique"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>

        {/* Mute / Unmute Button */}
        <button
          id="btn-mute-unmute"
          onClick={handleToggleMute}
          className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            audioState.isMuted
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
              : 'bg-slate-800/60 border-transparent hover:border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={audioState.isMuted ? "Réactiver le son" : "Couper le son"}
          aria-label={audioState.isMuted ? "Réactiver le son" : "Couper le son"}
        >
          {getVolumeIcon()}
        </button>

        {/* Volume slider */}
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${showSlider ? 'w-16 sm:w-20 opacity-100' : 'w-12 sm:w-16 opacity-90'}`}>
          <input
            id="music-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={audioState.isMuted ? 0 : audioState.volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            aria-label="Curseur de volume"
            title={`Volume: ${Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%`}
          />
        </div>
      </div>

      {/* Popover Menu for Custom MP3 Audio */}
      {showAudioMenu && (
        <div
          id="audio-options-popover"
          className="absolute top-full right-0 mt-2 w-64 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-rose-500/30 shadow-2xl shadow-black/80 z-50 text-xs font-sans-clean animate-fade-in"
        >
          <div className="font-semibold text-rose-200 mb-1 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-rose-400" />
            <span>Fond Sonore : Amir - Rétine</span>
          </div>
          <p className="text-slate-300 text-[11px] mb-3 leading-relaxed">
            La chanson <i>Rétine</i> d'Amir est active. Vous pouvez aussi charger votre propre fichier audio (MP3, WAV, M4A).
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="flex flex-col gap-2">
            <button
              id="btn-upload-mp3-track"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Charger un fichier audio MP3</span>
            </button>

            {audioState.isCustomTrack && (
              <button
                id="btn-reset-to-amir"
                onClick={handleResetTrack}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revenir à Amir - Rétine (Mélodie)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

