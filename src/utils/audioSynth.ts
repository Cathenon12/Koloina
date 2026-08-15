// Romantic Audio Engine: Amir - Rétine (Acoustic Guitar, Piano & Strings arrangement)
import { loadSavedAudioTrack, saveAudioTrack, clearSavedAudioTrack } from './audioStorage';

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isCustomTrack: boolean;
  trackName: string;
  duration: number;
  currentTime: number;
  activePreset: string;
}

type AudioListener = (state: AudioState) => void;

// Musical scale & note definitions (frequencies in Hz) in C# Minor / E Major
const NOTES = {
  // Octave 2
  C2: 65.41,
  Cs2: 69.30,
  D2: 73.42,
  Ds2: 77.78,
  E2: 82.41,
  F2: 87.31,
  Fs2: 92.50,
  G2: 98.00,
  Gs2: 103.83,
  A2: 110.00,
  As2: 116.54,
  B2: 123.47,

  // Octave 3
  C3: 130.81,
  Cs3: 138.59,
  D3: 146.83,
  Ds3: 155.56,
  E3: 164.81,
  F3: 174.61,
  Fs3: 185.00,
  G3: 196.00,
  Gs3: 207.65,
  A3: 220.00,
  As3: 233.08,
  B3: 246.94,

  // Octave 4
  C4: 261.63,
  Cs4: 277.18,
  D4: 293.66,
  Ds4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.00,
  Gs4: 415.30,
  A4: 440.00,
  As4: 466.16,
  B4: 493.88,

  // Octave 5
  C5: 523.25,
  Cs5: 554.37,
  D5: 587.33,
  Ds5: 622.25,
  E5: 659.25,
  F5: 698.46,
  Fs5: 739.99,
  G5: 783.99,
  Gs5: 830.61,
  A5: 880.00,
  As5: 932.33,
  B5: 987.77,

  // Octave 6
  C6: 1046.50,
  Cs6: 1108.73,
  Ds6: 1244.51,
  E6: 1318.51,
  Gs6: 1661.22,
};

interface RetineMeasure {
  name: string;
  bass: number;
  padChord: number[];
  arpeggio: number[];
  melody: { note: number; delay: number; duration: number; vol: number }[];
}

// Full Arrangement of Amir - "Rétine"
// Key: C#m (C# minor / E Major) - 94 BPM
const AMIR_RETINE_TRACK: RetineMeasure[] = [
  // 1. Verse 1: "C'est parti de rien..."
  {
    name: "Verse - C#m",
    bass: NOTES.Cs2,
    padChord: [NOTES.Cs3, NOTES.Gs3, NOTES.E4],
    arpeggio: [NOTES.Cs3, NOTES.Gs3, NOTES.Cs4, NOTES.E4, NOTES.Gs4, NOTES.Cs5],
    melody: [
      { note: NOTES.Gs4, delay: 0.3, duration: 0.35, vol: 0.22 },
      { note: NOTES.Gs4, delay: 0.7, duration: 0.35, vol: 0.22 },
      { note: NOTES.Gs4, delay: 1.1, duration: 0.45, vol: 0.23 },
      { note: NOTES.Fs4, delay: 1.7, duration: 0.35, vol: 0.20 },
      { note: NOTES.E4, delay: 2.1, duration: 0.6, vol: 0.24 },
    ],
  },
  // 2. Verse 1: "On était deux, deux étrangers..."
  {
    name: "Verse - G#m",
    bass: NOTES.Gs2,
    padChord: [NOTES.Gs2, NOTES.Ds3, NOTES.B3],
    arpeggio: [NOTES.Gs2, NOTES.Ds3, NOTES.Gs3, NOTES.B3, NOTES.Ds4, NOTES.Gs4],
    melody: [
      { note: NOTES.Fs4, delay: 0.3, duration: 0.4, vol: 0.21 },
      { note: NOTES.E4, delay: 0.8, duration: 0.4, vol: 0.20 },
      { note: NOTES.Ds4, delay: 1.3, duration: 0.4, vol: 0.19 },
      { note: NOTES.E4, delay: 1.8, duration: 0.4, vol: 0.22 },
      { note: NOTES.Fs4, delay: 2.3, duration: 0.6, vol: 0.23 },
    ],
  },
  // 3. Verse 1: "C'est parti de loin, je n'voulais pas me dévoiler..."
  {
    name: "Verse - A",
    bass: NOTES.A2,
    padChord: [NOTES.A2, NOTES.E3, NOTES.Cs4],
    arpeggio: [NOTES.A2, NOTES.E3, NOTES.A3, NOTES.Cs4, NOTES.E4, NOTES.A4],
    melody: [
      { note: NOTES.E4, delay: 0.25, duration: 0.35, vol: 0.20 },
      { note: NOTES.Fs4, delay: 0.65, duration: 0.35, vol: 0.22 },
      { note: NOTES.Gs4, delay: 1.05, duration: 0.4, vol: 0.24 },
      { note: NOTES.A4, delay: 1.55, duration: 0.4, vol: 0.25 },
      { note: NOTES.Gs4, delay: 2.05, duration: 0.35, vol: 0.22 },
      { note: NOTES.Fs4, delay: 2.45, duration: 0.5, vol: 0.21 },
    ],
  },
  // 4. Verse 1: "Mais ma pudeur tu l'as volée, le ciel en est témoin..."
  {
    name: "Verse - E",
    bass: NOTES.E2,
    padChord: [NOTES.E2, NOTES.B2, NOTES.Gs3],
    arpeggio: [NOTES.E2, NOTES.B2, NOTES.E3, NOTES.Gs3, NOTES.B3, NOTES.E4],
    melody: [
      { note: NOTES.Gs4, delay: 0.3, duration: 0.4, vol: 0.23 },
      { note: NOTES.Fs4, delay: 0.8, duration: 0.4, vol: 0.22 },
      { note: NOTES.E4, delay: 1.3, duration: 0.4, vol: 0.24 },
      { note: NOTES.Ds4, delay: 1.8, duration: 0.4, vol: 0.20 },
      { note: NOTES.E4, delay: 2.3, duration: 0.8, vol: 0.25 },
    ],
  },
  // 5. Pre-Chorus: "Puisqu'une seconde à tes côtés vaut bien des années..."
  {
    name: "Pre-Chorus - F#m",
    bass: NOTES.Fs2,
    padChord: [NOTES.Fs2, NOTES.Cs3, NOTES.A3],
    arpeggio: [NOTES.Fs2, NOTES.Cs3, NOTES.Fs3, NOTES.A3, NOTES.Cs4, NOTES.Fs4],
    melody: [
      { note: NOTES.A4, delay: 0.3, duration: 0.4, vol: 0.22 },
      { note: NOTES.B4, delay: 0.8, duration: 0.4, vol: 0.24 },
      { note: NOTES.Cs5, delay: 1.3, duration: 0.5, vol: 0.27 },
      { note: NOTES.B4, delay: 1.9, duration: 0.4, vol: 0.23 },
      { note: NOTES.A4, delay: 2.4, duration: 0.6, vol: 0.22 },
    ],
  },
  // 6. Pre-Chorus: "Mais ça m'amuse, ma muse, on n'est pas près de faner..."
  {
    name: "Pre-Chorus - B",
    bass: NOTES.B2,
    padChord: [NOTES.B2, NOTES.Fs3, NOTES.Ds4],
    arpeggio: [NOTES.B2, NOTES.Fs3, NOTES.B3, NOTES.Ds4, NOTES.Fs4, NOTES.B4],
    melody: [
      { note: NOTES.B4, delay: 0.3, duration: 0.4, vol: 0.24 },
      { note: NOTES.Cs5, delay: 0.8, duration: 0.4, vol: 0.26 },
      { note: NOTES.Ds5, delay: 1.3, duration: 0.6, vol: 0.28 },
      { note: NOTES.E5, delay: 2.0, duration: 0.9, vol: 0.30 },
    ],
  },

  // 7. CHORUS 1: "Si dans ta rétine l'amour..."
  {
    name: "Chorus - C#m (Si dans ta rétine)",
    bass: NOTES.Cs2,
    padChord: [NOTES.Cs3, NOTES.Gs3, NOTES.E4],
    arpeggio: [NOTES.Cs3, NOTES.Gs3, NOTES.Cs4, NOTES.E4, NOTES.Gs4, NOTES.Cs5],
    melody: [
      { note: NOTES.Gs4, delay: 0.2, duration: 0.35, vol: 0.26 },
      { note: NOTES.Gs4, delay: 0.6, duration: 0.35, vol: 0.26 },
      { note: NOTES.Gs4, delay: 1.0, duration: 0.45, vol: 0.27 },
      { note: NOTES.B4, delay: 1.5, duration: 0.5, vol: 0.29 },
      { note: NOTES.A4, delay: 2.1, duration: 0.4, vol: 0.26 },
      { note: NOTES.Gs4, delay: 2.6, duration: 0.5, vol: 0.25 },
    ],
  },
  // 8. CHORUS 2: "Ne supporte plus la lumière du jour..."
  {
    name: "Chorus - G#m",
    bass: NOTES.Gs2,
    padChord: [NOTES.Gs2, NOTES.Ds3, NOTES.B3],
    arpeggio: [NOTES.Gs2, NOTES.Ds3, NOTES.Gs3, NOTES.B3, NOTES.Ds4, NOTES.Gs4],
    melody: [
      { note: NOTES.Fs4, delay: 0.2, duration: 0.35, vol: 0.24 },
      { note: NOTES.Gs4, delay: 0.6, duration: 0.35, vol: 0.25 },
      { note: NOTES.A4, delay: 1.0, duration: 0.4, vol: 0.27 },
      { note: NOTES.Gs4, delay: 1.5, duration: 0.35, vol: 0.25 },
      { note: NOTES.Fs4, delay: 1.9, duration: 0.35, vol: 0.23 },
      { note: NOTES.E4, delay: 2.3, duration: 0.4, vol: 0.24 },
      { note: NOTES.Fs4, delay: 2.8, duration: 0.5, vol: 0.25 },
    ],
  },
  // 9. CHORUS 3: "Je rallumerai les étoiles autour..."
  {
    name: "Chorus - A",
    bass: NOTES.A2,
    padChord: [NOTES.A2, NOTES.E3, NOTES.Cs4],
    arpeggio: [NOTES.A2, NOTES.E3, NOTES.A3, NOTES.Cs4, NOTES.E4, NOTES.A4],
    melody: [
      { note: NOTES.Gs4, delay: 0.2, duration: 0.35, vol: 0.26 },
      { note: NOTES.Gs4, delay: 0.6, duration: 0.35, vol: 0.26 },
      { note: NOTES.Gs4, delay: 1.0, duration: 0.45, vol: 0.27 },
      { note: NOTES.B4, delay: 1.5, duration: 0.5, vol: 0.30 },
      { note: NOTES.A4, delay: 2.1, duration: 0.4, vol: 0.26 },
      { note: NOTES.Gs4, delay: 2.6, duration: 0.5, vol: 0.25 },
    ],
  },
  // 10. CHORUS 4: "J'apprendrai à compter jusqu'à toujours..."
  {
    name: "Chorus - E",
    bass: NOTES.E2,
    padChord: [NOTES.E2, NOTES.B2, NOTES.Gs3],
    arpeggio: [NOTES.E2, NOTES.B2, NOTES.E3, NOTES.Gs3, NOTES.B3, NOTES.E4],
    melody: [
      { note: NOTES.Fs4, delay: 0.2, duration: 0.35, vol: 0.24 },
      { note: NOTES.Gs4, delay: 0.6, duration: 0.35, vol: 0.25 },
      { note: NOTES.A4, delay: 1.0, duration: 0.4, vol: 0.27 },
      { note: NOTES.Gs4, delay: 1.5, duration: 0.35, vol: 0.25 },
      { note: NOTES.Fs4, delay: 1.9, duration: 0.35, vol: 0.23 },
      { note: NOTES.E4, delay: 2.3, duration: 0.4, vol: 0.24 },
      { note: NOTES.Ds4, delay: 2.8, duration: 0.5, vol: 0.22 },
    ],
  },
  // 11. CHORUS 5: "Et toi, tu pourras compter sur moi..."
  {
    name: "Chorus - F#m",
    bass: NOTES.Fs2,
    padChord: [NOTES.Fs2, NOTES.Cs3, NOTES.A3],
    arpeggio: [NOTES.Fs2, NOTES.Cs3, NOTES.Fs3, NOTES.A3, NOTES.Cs4, NOTES.Fs4],
    melody: [
      { note: NOTES.E4, delay: 0.25, duration: 0.35, vol: 0.23 },
      { note: NOTES.Fs4, delay: 0.65, duration: 0.35, vol: 0.25 },
      { note: NOTES.Gs4, delay: 1.05, duration: 0.4, vol: 0.27 },
      { note: NOTES.B4, delay: 1.55, duration: 0.6, vol: 0.30 },
      { note: NOTES.Gs4, delay: 2.25, duration: 0.45, vol: 0.26 },
      { note: NOTES.Fs4, delay: 2.75, duration: 0.4, vol: 0.24 },
      { note: NOTES.E4, delay: 3.2, duration: 0.6, vol: 0.26 },
    ],
  },
  // 12. CHORUS 6: "Et ça finira jamais, ça finira jamais, ça finira jamais..."
  {
    name: "Chorus - B to C#m (Ça finira jamais)",
    bass: NOTES.B2,
    padChord: [NOTES.B2, NOTES.Fs3, NOTES.Ds4],
    arpeggio: [NOTES.B2, NOTES.Fs3, NOTES.B3, NOTES.Ds4, NOTES.Fs4, NOTES.B4, NOTES.Cs5],
    melody: [
      { note: NOTES.Gs4, delay: 0.2, duration: 0.3, vol: 0.25 },
      { note: NOTES.Fs4, delay: 0.55, duration: 0.3, vol: 0.23 },
      { note: NOTES.E4, delay: 0.9, duration: 0.4, vol: 0.25 },

      { note: NOTES.Gs4, delay: 1.35, duration: 0.3, vol: 0.25 },
      { note: NOTES.Fs4, delay: 1.7, duration: 0.3, vol: 0.23 },
      { note: NOTES.E4, delay: 2.05, duration: 0.4, vol: 0.25 },

      { note: NOTES.Gs4, delay: 2.5, duration: 0.3, vol: 0.26 },
      { note: NOTES.Fs4, delay: 2.85, duration: 0.3, vol: 0.24 },
      { note: NOTES.E4, delay: 3.2, duration: 0.6, vol: 0.28 },
      { note: NOTES.Cs5, delay: 3.8, duration: 1.2, vol: 0.30 },
    ],
  },
];

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.70;
  private timerId: number | null = null;
  private currentMeasure: number = 0;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private listeners: Set<AudioListener> = new Set();

  // Custom Audio Element (for MP3 upload or saved tracks)
  private audioElement: HTMLAudioElement | null = null;
  private audioObjectURL: string | null = null;
  private isCustomTrack: boolean = false;
  private trackName: string = 'Amir - Rétine (Mélodie Romantique)';
  private duration: number = 0;
  private currentTime: number = 0;
  private activePreset: string = 'amir_retine';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSavedTrack();
    }
  }

  private async initSavedTrack() {
    try {
      const saved = await loadSavedAudioTrack();
      if (saved && saved.blob) {
        this.setupAudioElementWithBlob(saved.blob, saved.name);
      }
    } catch {
      // Ignore
    }
  }

  public subscribe(fn: AudioListener) {
    this.listeners.add(fn);
    fn(this.getState());
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): AudioState {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      isMuted: this.isMuted,
      isCustomTrack: this.isCustomTrack,
      trackName: this.trackName,
      duration: this.duration,
      currentTime: this.currentTime,
      activePreset: this.activePreset,
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((fn) => fn(st));
  }

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Reverb / Dreamy Stereo Delay
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.32, this.ctx.currentTime);

      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(2000, this.ctx.currentTime);

      this.musicGain.connect(this.delayNode);
      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayGain);
      this.delayGain.connect(this.delayNode); // feedback loop
      this.delayGain.connect(this.masterGain);

      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public async loadCustomAudioFile(file: File): Promise<boolean> {
    try {
      await saveAudioTrack(file);
      this.setupAudioElementWithBlob(file, file.name);
      if (this.isPlaying) {
        await this.playAudioElement();
      }
      return true;
    } catch (err) {
      console.error('Failed to load custom audio file:', err);
      return false;
    }
  }

  public async resetToAmirRetine() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.audioObjectURL) {
      URL.revokeObjectURL(this.audioObjectURL);
      this.audioObjectURL = null;
    }
    await clearSavedAudioTrack();
    this.isCustomTrack = false;
    this.trackName = 'Amir - Rétine (Mélodie Romantique)';
    this.notify();
    if (this.isPlaying) {
      this.startSynthesizer();
    }
  }

  private setupAudioElementWithBlob(blob: Blob, name: string) {
    if (this.audioObjectURL) {
      URL.revokeObjectURL(this.audioObjectURL);
    }

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';

      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement) {
          this.currentTime = this.audioElement.currentTime;
          this.duration = this.audioElement.duration || 0;
          this.notify();
        }
      });

      this.audioElement.addEventListener('loadedmetadata', () => {
        if (this.audioElement) {
          this.duration = this.audioElement.duration || 0;
          this.notify();
        }
      });
    }

    this.audioObjectURL = URL.createObjectURL(blob);
    this.audioElement.src = this.audioObjectURL;
    this.audioElement.volume = this.isMuted ? 0 : this.volume;
    this.isCustomTrack = true;
    this.trackName = name.replace(/\.[^/.]+$/, '');
    this.notify();
  }

  private async playAudioElement(): Promise<boolean> {
    if (!this.audioElement) return false;
    try {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      await this.audioElement.play();
      this.isPlaying = true;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Autoplay guard', err);
      return false;
    }
  }

  public async startMusic(): Promise<boolean> {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isCustomTrack && this.audioElement) {
      const ok = await this.playAudioElement();
      if (ok) return true;
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startSynthesizer();
      this.notify();
    }
    return true;
  }

  public async togglePlay(): Promise<boolean> {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      return this.startMusic();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
    }

    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthesizer();
    this.notify();
  }

  private startSynthesizer() {
    this.currentMeasure = 0;
    this.playNextMeasure();
  }

  private stopSynthesizer() {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private playNextMeasure() {
    if (!this.isPlaying || this.isCustomTrack || !this.ctx || !this.musicGain) return;

    const measure = AMIR_RETINE_TRACK[this.currentMeasure % AMIR_RETINE_TRACK.length];
    const now = this.ctx.currentTime;
    // Each measure duration is tailored for ~94 BPM
    const measureDuration = 4.2;

    // 1. Warm String Pad / Cello Undercurrent
    this.playWarmPad(measure.bass, measure.padChord, now, measureDuration + 0.6);

    // 2. Flowing Acoustic Guitar / Piano Arpeggio
    measure.arpeggio.forEach((freq, idx) => {
      const noteTime = now + idx * 0.28;
      this.playPianoNote(freq, noteTime, 3.8, 0.16 - idx * 0.01);
    });

    // 3. Amir - Rétine Expressive Lead Melody (Warm Sine + Flute/Violin Harmonics)
    measure.melody.forEach(({ note, delay, duration, vol }) => {
      this.playMelodyNote(note, now + delay, duration, vol);
    });

    this.currentMeasure++;

    this.timerId = window.setTimeout(() => {
      this.playNextMeasure();
    }, measureDuration * 1000);
  }

  // Romantic Grand Piano / Guitar Pluck
  private playPianoNote(freq: number, startTime: number, duration: number, peakVolume: number) {
    if (!this.ctx || !this.musicGain) return;

    try {
      const oscFundamental = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, startTime);
      filter.frequency.exponentialRampToValueAtTime(500, startTime + duration);

      oscFundamental.type = 'sine';
      oscFundamental.frequency.setValueAtTime(freq, startTime);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 1.002, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(peakVolume * 0.4, startTime + 0.6);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      oscFundamental.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.musicGain);

      oscFundamental.start(startTime);
      oscHarmonic.start(startTime);
      oscFundamental.stop(startTime + duration + 0.1);
      oscHarmonic.stop(startTime + duration + 0.1);
    } catch {
      // guard
    }
  }

  // Warm Orchestra Pad
  private playWarmPad(bassFreq: number, chordFreqs: number[], startTime: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    try {
      // Bass warmth
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(240, startTime);

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, startTime);

      bassGain.gain.setValueAtTime(0.0001, startTime);
      bassGain.gain.linearRampToValueAtTime(0.18, startTime + 0.9);
      bassGain.gain.linearRampToValueAtTime(0.14, startTime + duration - 0.6);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.start(startTime);
      bassOsc.stop(startTime + duration + 0.1);

      // Pad chord notes
      chordFreqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, startTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.065, startTime + 1.2);
        gain.gain.linearRampToValueAtTime(0.05, startTime + duration - 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain!);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      });
    } catch {
      // guard
    }
  }

  // Amir - Rétine Expressive Lead Melody
  private playMelodyNote(freq: number, startTime: number, duration: number, peakVolume: number) {
    if (!this.ctx || !this.musicGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Gentle romantic vocal vibrato
      vibrato.frequency.setValueAtTime(5.0, startTime);
      vibratoGain.gain.setValueAtTime(2.6, startTime);
      vibrato.connect(osc.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3400, startTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(peakVolume * 0.75, startTime + duration * 0.6);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.musicGain);

      vibrato.start(startTime + 0.05);
      osc.start(startTime);
      vibrato.stop(startTime + duration + 0.05);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // guard
    }
  }

  // Sound effect when clicking heart
  public playHeartSound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [NOTES.Cs5, NOTES.E5, NOTES.Gs5, NOTES.Cs6];

    notes.forEach((freq, i) => {
      try {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.0001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.3);
      } catch {
        // guard
      }
    });
  }

  // Sound effect when sending flower / bouquet
  public playBouquetSound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [NOTES.A4, NOTES.Cs5, NOTES.E5, NOTES.Gs5, NOTES.Cs6];

    notes.forEach((freq, i) => {
      try {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.0001, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 1.9);
      } catch {
        // guard
      }
    });
  }
}

export const audioEngine = new RomanticAudioEngine();
